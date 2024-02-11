<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  import Button from '$lib/components/Button.svelte';
  import CatergorySection from '$lib/components/CatergorySection.svelte';
  import { currentSong } from '$lib/components/store/currentPlaying';
  import QuickPicks from '$lib/components/QuickPicks.svelte';

  export let data;
  const sections: {
    title: string;
    path: string;
    items: (AlbumObjectSimplified | PlaylistObjectSimplified)[];
  }[] = [];
  $: {
    if (data.forYouPlaylists) {
      sections.push({
        title: 'For You',
        path: '/playlist',
        items: data.forYouPlaylists
      });
    }
    if (data.newReleases) {
      data.newReleases.albums.items.forEach((el) => {
        el.images.sort((a, b) => (a.height && b.height ? a.height - b.height : -1));
      });
      sections.push({
        title: 'New Releases',
        path: '/album',
        items: data.newReleases.albums.items
      });
    }
    if (data.featuredPlaylists) {
      sections.push({
        title: 'Featured Playlists',
        path: '/playlist',
        items: data.featuredPlaylists.playlists.items
      });
    }
    data.randomCategories.forEach((el) => {
      sections.push({
        title: el.name,
        path: `/playlist`,
        items: el.playlists.items
      });
    });
  }
  // console.log(data.randomCategories);
  $: pageTitle = $currentSong.trackLink ? $currentSong.trackLink.name : 'Home';
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<QuickPicks />

{#each sections as section}
  <CatergorySection {section} />
{/each}
