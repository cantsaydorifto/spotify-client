<script lang="ts">
  import CatergorySection from '$lib/components/CatergorySection.svelte';
  import LoadingCategorySection from '$lib/components/LoadingCategorySection.svelte';
  import { getArtistPlaylists } from './helper';

  export let artistName: string;
</script>

{#await getArtistPlaylists(artistName)}
  <LoadingCategorySection />
{:then artistPlaylists}
  <CatergorySection
    section={{ items: artistPlaylists, title: 'Playlist Searches', path: '/playlist' }}
  />
{:catch}
  <!-- errors are handled in getArtistPlaylists so this component is never acutally used -->
  <!-- in case of an error getArtistPlaylists return an empty array -->
  <LoadingCategorySection error="Error Fetching Playlists" />
{/await}
