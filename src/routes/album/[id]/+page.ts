import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import interceptFetch from '$lib/interceptor/interceptFetch';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, params }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const saavnAlbumTracks: {
    name: string;
    album: string;
    link: string;
  }[] = [];
  const res = await fetch('/api/spotify/albums/' + params.id);
  if (!res.ok) throw error(res.status, 'Album not found');
  const album = (await res.json()) as SingleAlbumResponse;
  let color: string | null = null;
  const albumSongIds = album.tracks.items.map((el) => el.id);
  const [colorRes, res2, hasLikedRes, recommendedObjectRes] = await Promise.all([
    album.images.length > 0
      ? fetch('/api/color?image=' + album.images[0].url)
      : Promise.resolve(null),
    fetch(
      '/api/album?query=' +
        `${encodeURIComponent(`${album.name} ${album.artists[0].name}`)}&count=${
          album.total_tracks
        }`
    ),
    fetch(`/api/spotify/me/tracks/contains?ids=${albumSongIds.join(',')}`),
    fetch(
      `/api/spotify/recommendations?seed_artists=${
        album.artists[0].id
      }&seed_tracks=${album.tracks.items
        .slice(0, 4)
        .map((el) => el.id)
        .join(',')}`
    )
  ]);

  const [colorData, res2Json, hasliked] = await Promise.all([
    colorRes ? (colorRes.json() as Promise<{ dominantColor: string }>) : Promise.resolve(null),
    res2.ok ? (res2.json() as Promise<{ album: SaavnApiAlbumResponse }>) : Promise.resolve(null),
    hasLikedRes.ok ? (hasLikedRes.json() as Promise<boolean[]>) : Promise.resolve([])
  ]);
  let recommendedObject: RecommendationsObject = { seeds: [], tracks: [] };
  if (recommendedObjectRes.ok) {
    recommendedObject = (await recommendedObjectRes.json()) as RecommendationsObject;
  }
  if (hasliked.length !== album.tracks.items.length)
    throw error(500, 'Album Songs and Liked Songs Length Dont match');

  if (colorData) color = colorData.dominantColor;

  if (res2Json) {
    saavnAlbumTracks.push(
      ...res2Json.album.data.songs.map((el) => ({
        name: el.name,
        album: el.album.name,
        artist: el.primaryArtists,
        link: el.downloadUrl[el.downloadUrl.length - 1].link
      }))
    );
  }

  return {
    album,
    color,
    tracks: saavnAlbumTracks.map((el) => ({
      ...el,
      album: {
        name: album.name,
        id: album.id
      }
    })),
    hasliked,
    recommendedTracks: convertRecommendedTracksToTrackObjectFull(recommendedObject)
  };
};

function convertRecommendedTracksToTrackObjectFull(
  recommendationsObject: RecommendationsObject
): TrackObjectFull[] {
  return recommendationsObject.tracks.map((recommendationTrack) => {
    return {
      ...recommendationTrack,
      album: {
        ...recommendationTrack.album,
        album_type: 'album'
      }
    };
  });
}
