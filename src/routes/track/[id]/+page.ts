import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import interceptFetch from '$lib/interceptor/interceptFetch';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, params }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const res = await fetch('/api/spotify/tracks/' + params.id);
  if (!res.ok) throw error(res.status, 'Track not found');
  const track = (await res.json()) as TrackObjectFull;

  let color: string | null = null;
  const [colorRes, songRes, hasLikedRes, recommendedObjectRes] = await Promise.all([
    track.album.images.length > 0
      ? fetch('/api/color?image=' + track.album.images[0].url)
      : Promise.resolve(null),
    fetch(
      `/api/song/${track.track_number}?query=${encodeURIComponent(
        `${track.album.name} ${track.artists[0].name}`
      )}&count=${track.album.total_tracks}`
    ),
    fetch(`/api/spotify/me/tracks/contains?ids=${track.id}`),
    fetch(
      `/api/spotify/recommendations?seed_artists=${track.album.artists[0].id}&seed_tracks=${track.id}`
    )
  ]);

  const [colorData, songJson, hasliked] = await Promise.all([
    colorRes ? (colorRes.json() as Promise<{ dominantColor: string }>) : Promise.resolve(null),
    songRes.ok ? (songRes.json() as Promise<{ song: SaavnSong }>) : Promise.resolve(null),
    hasLikedRes.ok ? (hasLikedRes.json() as Promise<boolean[]>) : Promise.resolve([])
  ]);
  let recommendedObject: RecommendationsObject = { seeds: [], tracks: [] };
  if (recommendedObjectRes.ok) {
    recommendedObject = (await recommendedObjectRes.json()) as RecommendationsObject;
  }
  if (colorData) color = colorData.dominantColor;

  const lyricsRes = await fetch(
    `/api/song/${encodeURIComponent(`${track.name} ${track.artists[0].name}`)}/lyrics`
  );
  const metadata = (await lyricsRes.json()) as SaavnApiLyricsResponse;

  return {
    track,
    trackLink: {
      name: track.name,
      album: track.album.name,
      img: track.album.images[0].url,
      link: songJson ? songJson.song.downloadUrl[songJson.song.downloadUrl.length - 1].link : ''
    },
    color,
    hasliked,
    recommendedTracks: convertRecommendedTracksToTrackObjectFull(recommendedObject),
    lyrics: metadata
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
