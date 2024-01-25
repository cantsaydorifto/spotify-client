import interceptFetch from '$lib/interceptor/interceptFetch';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, parent }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const problemIds = ['0JQ5DAqbMKFIRybaNTYXXy', '0JQ5DAqbMKFy0OenPG51Av', '0JQ5DAqbMKFDTEtSaS4R92'];
  const parentData = await parent();
  if (!parentData.user) {
    throw redirect(307, '/svn');
  }
  const res4 = await fetch('/api/spotify/browse/categories?country=US');
  const categoryJson = res4.ok ? ((await res4.json()) as MultipleCategoriesResponse) : null;
  const randomCategories = (
    categoryJson
      ? categoryJson.categories.items.sort(() => Math.random() - Math.random()).slice(0, 4)
      : []
  ).filter((el) => !problemIds.includes(el.id));

  const a = await (async () => {
    try {
      const res = await Promise.all(
        randomCategories.map((el) =>
          fetch(`/api/spotify/browse/categories/${el.id}/playlists?country=US`)
        )
      );
      const res_1 = (await Promise.all(res.map((el) => el.json()))) as CategoryPlaylistsResponse[];
      return res_1.map((el, i) => {
        return {
          ...el,
          name: randomCategories[i].name
        };
      });
    } catch (err) {
      return [];
    }
  })();

  const [res1, res2, res3, res5, res6, res7] = await Promise.all([
    fetch('/api/spotify/browse/new-releases?country=US&limit=50'),
    fetch('/api/spotify/browse/featured-playlists?country=US'),
    fetch(`/api/spotify/users/${parentData.user?.id}/playlists`),
    fetch(`/api/spotify/search?q=${encodeURIComponent('Daily Mix')}&type=playlist`),
    fetch(`/api/spotify/search?q=${encodeURIComponent('Discover Weekly')}&type=playlist`),
    fetch(`/api/spotify/search?q=${encodeURIComponent('for you')}&type=playlist`)
  ]);
  const forYouPlaylists: PlaylistObjectSimplified[] = [];

  const [dailyMix, discoverWeekly, forYouReults] = await Promise.all([
    res5.json() as SearchResponse,
    res6.json() as SearchResponse,
    res7.json() as SearchResponse
  ]);
  console.log('RESPONSE', dailyMix);
  if (dailyMix.playlists) {
    dailyMix.playlists.items.forEach((el) => {
      if (el.owner.id === 'spotify' && el.name.startsWith('Daily Mix')) forYouPlaylists.push(el);
    });
    forYouPlaylists.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (forYouReults.playlists && forYouReults.playlists.items.length > 0) {
    forYouReults.playlists.items.forEach((el) => {
      if (
        el.owner.id === 'spotify' &&
        !(
          el.name === 'Discover Weekly' ||
          el.name.startsWith('Daily Mix') ||
          el.name.endsWith('Radio')
        )
      ) {
        forYouPlaylists.unshift(el);
      }
    });
  }

  if (
    discoverWeekly.playlists &&
    discoverWeekly.playlists.items.length > 0 &&
    discoverWeekly.playlists.items[0].owner.id === 'spotify'
  ) {
    forYouPlaylists.unshift(discoverWeekly.playlists.items[0]);
  }

  forYouPlaylists.unshift(getEmptyLikesPlaylist());

  return {
    newReleases: res1.ok ? (res1.json() as Promise<ListOfNewReleasesResponse>) : null,
    featuredPlaylists: res2.ok ? (res2.json() as Promise<ListOfFeaturedPlaylistsResponse>) : null,
    userCreatedPlaylists: res3.ok ? (res3.json() as Promise<ListOfUsersPlaylistsResponse>) : null,
    randomCategories: a,
    forYouPlaylists
  };
};

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
