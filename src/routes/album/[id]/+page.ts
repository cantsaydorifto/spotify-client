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
  if (album.images.length > 0) {
    const colorRes = await fetch('/api/color?image=' + album.images[0].url);
    if (colorRes.ok) {
      const { dominantColor } = (await colorRes.json()) as { dominantColor: string };
      color = dominantColor;
    }
  }
  const res2 = await fetch(
    '/api/album?query=' +
      `${encodeURIComponent(`${album.name} ${album.artists[0].name}`)}&count=${album.total_tracks}`
  );
  if (res2.ok) {
    const res2Json = (await res2.json()) as { album: SaavnApiAlbumResponse };
    // console.log(res2Json);
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
    tracks: saavnAlbumTracks
  };
};
