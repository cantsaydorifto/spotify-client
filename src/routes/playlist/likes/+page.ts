import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import interceptFetch from '$lib/interceptor/interceptFetch';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const res = await fetch('/api/spotify/me/tracks?limit=50');
  if (!res.ok) throw error(res.status, 'Saved Tracks Not Found');
  const userSavedTrackRes = (await res.json()) as UsersSavedTracksResponse;

  const trackOffset = userSavedTrackRes.items.length < 50 ? userSavedTrackRes.items.length : 50;
  const hasMoreTracks = userSavedTrackRes.total > trackOffset;

  userSavedTrackRes.items = userSavedTrackRes.items
    .slice(0, 50)
    .filter((el) => !!el.track && el.track.type === 'track');

  return {
    userSavedTrackRes,
    pagination: {
      trackOffset,
      hasMoreTracks
    },
    color: { dominantColor: 'rgb(80, 56, 160)' }
  };
};
