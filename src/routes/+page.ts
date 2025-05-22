import interceptFetch from '$lib/interceptor/interceptFetch';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, parent }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const { user } = await parent();
  if (!user) {
    throw redirect(307, '/svn');
  }
  const [res1] = await Promise.all([fetch('/api/spotify/browse/new-releases?limit=50&country=US')]);

  return {
    newReleases: res1.ok ? await (res1.json() as Promise<ListOfNewReleasesResponse>) : null,
    color: {
      dominantColor: 'var(--sidebar-color)'
    }
  };
};

function randomizeArray(nums: any[]) {
  const arr = [...nums];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 20);
}

const getEmptyLikesPlaylist = (): PlaylistObjectSimplified => ({
  collaborative: false,
  description: null,
  external_urls: { spotify: '' },
  href: '',
  id: 'likes',
  images: [
    {
      height: 640,
      url: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
      width: 640
    }
  ],
  name: 'Liked Songs',
  owner: {
    display_name: 'Spotify',
    external_urls: {
      spotify: 'https://open.spotify.com/user/spotify'
    },
    href: 'https://api.spotify.com/v1/users/spotify',
    id: 'spotify',
    type: 'user',
    uri: 'spotify:user:spotify'
  },
  public: null,
  snapshot_id: '',
  tracks: { href: '', total: 0 },
  type: 'playlist',
  uri: ''
});
