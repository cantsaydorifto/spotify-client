<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  import Button from '$lib/components/Button.svelte';
  import CatergorySection from '$lib/components/CatergorySection.svelte';
  export let data;
  const sections: {
    title: string;
    path: string;
    items: (AlbumObjectSimplified | PlaylistObjectSimplified)[];
  }[] = [];
  $: {
    if (data.newReleases) {
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
    if (data.userCreatedPlaylists) {
      sections.push({
        title: 'Created Playlists',
        path: '/playlist',
        items: data.userCreatedPlaylists.items
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
</script>

<h1>Welcome to SvelteKit</h1>
<h4>{data.user ? data.user.display_name : 'Not signed in'}</h4>
<LogoutButton />
<Button element="a" style="solid" href="/api/auth/login">Login</Button>
{#each sections as section}
  <CatergorySection {section} />
{/each}

<style>
</style>
