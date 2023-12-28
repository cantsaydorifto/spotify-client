import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/saavn/modules?language=english,spanish');
  const resJson = (await res.json()).data;
  return {
    playlists: res.ok ? (resJson.playlists as SaavnHomepagePlaylistData[]) : [],
    charts: res.ok ? (resJson.charts as SaavnHomepagePlaylistData[]) : [],
    albums: res.ok ? (resJson.albums as SaavnHomepageALbumData[]) : [],
    trendingSongs: res.ok
      ? (resJson.trending.songs.map((el: { primaryArtists: { name: string; id: string }[] }) => ({
          ...el,
          primaryArtists: el.primaryArtists[0].name,
          primaryArtistsId: el.primaryArtists[0].id
        })) as SaavnSong[])
      : [],
    trendingAlbums: res.ok ? (resJson.trending.albums as SaavnHomepageALbumData[]) : []
  };
};
