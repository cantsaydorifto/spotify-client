import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { interceptFetch } from '$lib';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, params }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);

  const res = await fetch('/api/spotify/albums/' + params.id);
  if (!res.ok) throw error(res.status, 'Album not found');
  const album = (await res.json()) as SingleAlbumResponse;
  const albumSongIds = album.tracks.items.map((el) => el.id);
  const [colorRes, hasLikedRes] = await Promise.all([
    album.images.length > 0
      ? fetch('/api/color?image=' + album.images[0].url)
      : Promise.resolve(null),
    fetch(`/api/spotify/me/tracks/contains?ids=${albumSongIds.join(',')}`)
  ]);

  console.log('ALBUM REQ');

  // if (hasliked.length !== album.tracks.items.length)
  //   throw error(500, 'Album Songs and Liked Songs Length Dont match');

  // if (colorData) color = colorData.dominantColor;

  return {
    album,
    color: colorRes && colorRes.ok ? ((await colorRes.json()) as { dominantColor: string }) : null,
    hasLiked: hasLikedRes.ok ? await (hasLikedRes.json() as Promise<boolean[]>) : []
  };
};
