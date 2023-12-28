<script>
  import CatergorySection from '$lib/components/CatergorySection.svelte';

  export let data;
  const saavnHomepageData = {
    playlists: data.playlists,
    charts: data.charts,
    albums: data.albums
    // trending: data.trending
  };
</script>

<CatergorySection {saavnHomepageData} />
