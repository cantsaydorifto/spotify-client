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
  const res1 = await fetch('/api/spotify/browse/new-releases?country=US&limit=50');
  const res2 = await fetch('/api/spotify/browse/featured-playlists?country=US');
  const res3 = await fetch(`/api/spotify/users/${parentData.user?.id}/playlists`);
  const res4 = await fetch('/api/spotify/browse/categories?country=US');
  const categoryJson = res4.ok ? ((await res4.json()) as MultipleCategoriesResponse) : null;
  const randomCategories = (
    categoryJson
      ? categoryJson.categories.items.sort(() => Math.random() - Math.random()).slice(6)
      : []
  ).filter((el) => !problemIds.includes(el.id));
  // console.log(categoryJson);
  // console.log(randomCategories);
  // console.log(randomCategories.map((el) => el.id));
  const randomCategoriesPromises = randomCategories.map((el) =>
    fetch(`/api/spotify/browse/categories/${el.id}/playlists?country=US`)
  );
  const a = await (async () => {
    try {
      const res = await Promise.all(randomCategoriesPromises);
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
  // console.log(a);
  const [newReleases, featuredPlaylists, userCreatedPlaylists] = await Promise.all([
    res1,
    res2,
    res3
  ]);

  return {
    newReleases: res1.ok ? (newReleases.json() as Promise<ListOfNewReleasesResponse>) : null,
    featuredPlaylists: res2.ok
      ? (featuredPlaylists.json() as Promise<ListOfFeaturedPlaylistsResponse>)
      : null,
    userCreatedPlaylists: res3.ok
      ? (userCreatedPlaylists.json() as Promise<ListOfUsersPlaylistsResponse>)
      : null,
    randomCategories: a
  };
};
