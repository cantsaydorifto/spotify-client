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
  const [colorRes, res2, hasLikedRes] = await Promise.all([
    album.images.length > 0
      ? fetch('/api/color?image=' + album.images[0].url)
      : Promise.resolve(null),
    fetch(
      '/api/album?query=' +
        `${encodeURIComponent(`${album.name} ${album.artists[0].name}`)}&count=${
          album.total_tracks
        }`
    ),
    fetch(`/api/spotify/me/tracks/contains?ids=${albumSongIds.join(',')}`)
  ]);

  const [colorData, res2Json, hasliked] = await Promise.all([
    colorRes ? (colorRes.json() as Promise<{ dominantColor: string }>) : Promise.resolve(null),
    res2.ok ? (res2.json() as Promise<{ album: SaavnApiAlbumResponse }>) : Promise.resolve(null),
    hasLikedRes.json() as Promise<boolean[]>
  ]);

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
    tracks: saavnAlbumTracks,
    hasliked
  };
};
