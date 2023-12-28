import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/saavn/modules');
  const resJson = (await res.json()).data;
  return {
    playlists: res.ok ? (resJson.playlists as SaavnHomepagePlaylistData[]) : [],
    charts: res.ok ? (resJson.charts as SaavnHomepagePlaylistData[]) : [],
    albums: res.ok ? (resJson.albums as SaavnHomepageALbumData[]) : []
  };
};
