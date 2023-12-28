<script>
  import Button from '$lib/components/Button.svelte';
  import CatergorySection from '$lib/components/CatergorySection.svelte';

  export let data;
  const saavnHomepageData = {
    playlists: data.playlists,
    charts: data.charts,
    albums: data.albums,
    trendingSongs: data.trendingSongs,
    trendingAlbums: data.trendingAlbums
  };
</script>

<h1>Not Logged In</h1>
<Button element="a" style="solid" href="/api/auth/login">Login</Button>
<CatergorySection {saavnHomepageData} />
