import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch('/api/spotify/playlists/' + params.id);
  if (!res.ok) throw error(res.status, 'Playlist not found');
  const playlist = (await res.json()) as SinglePlaylistResponse;
  let color: string | null = null;
  if (playlist.images.length > 0) {
    const colorRes = await fetch('/api/color?image=' + playlist.images[0].url);
    if (colorRes.ok) {
      const { dominantColor } = (await colorRes.json()) as { dominantColor: string };
      console.log(dominantColor);
      color = dominantColor;
    }
  }
  return {
    playlist,
    color
  };
};
