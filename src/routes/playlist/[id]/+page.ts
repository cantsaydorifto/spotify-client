import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import interceptFetch from '$lib/interceptor/interceptFetch';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, params }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const res = await fetch('/api/spotify/playlists/' + params.id);
  if (!res.ok) throw error(res.status, 'Playlist not found');
  const playlist = (await res.json()) as SinglePlaylistResponse;
  let color: string | null = null;

  const trackOffset = playlist.tracks.items.length < 50 ? playlist.tracks.items.length : 50;
  const hasMoreTracks = playlist.tracks.total > trackOffset;

  playlist.tracks.items = playlist.tracks.items
    .slice(0, 50)
    .filter((el) => !!el.track && el.track.type === 'track');

  const playlistSongIds = playlist.tracks.items.map((el) => el.track!.id);
  const hasLikedRes = await fetch(
    `/api/spotify/me/tracks/contains?ids=${playlistSongIds.filter((el) => !!el).join(',')}`
  );
  const hasliked = (await hasLikedRes.json()) as boolean[];

  if (hasliked.length !== playlist.tracks.items.length)
    throw error(500, 'Playlist Songs and Liked Songs Length Dont match');

  if (playlist.images.length > 0) {
    const colorRes = await fetch('/api/color?image=' + playlist.images[0].url);
    if (colorRes.ok) {
      const { dominantColor } = (await colorRes.json()) as { dominantColor: string };
      color = dominantColor;
    }
  }
  return {
    playlist,
    pagination: {
      trackOffset,
      hasMoreTracks
    },
    color,
    hasliked
  };
};
