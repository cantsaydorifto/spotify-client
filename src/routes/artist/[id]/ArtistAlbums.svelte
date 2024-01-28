<script lang="ts">
  import CatergorySection from '$lib/components/CatergorySection.svelte';
  import LoadingCategorySection from '$lib/components/LoadingCategorySection.svelte';
  import { getArtistAlbums } from './helper';

  export let artistId: string;
</script>

{#await getArtistAlbums(artistId)}
  <LoadingCategorySection />
  <LoadingCategorySection />
  <LoadingCategorySection />
{:then { artistAlbums, artistAppearsOn, artistSingles }}
  <CatergorySection section={{ items: artistAlbums, title: 'Albums', path: '/album' }} />
  <CatergorySection section={{ items: artistSingles, title: 'Singles', path: '/album' }} />
  <CatergorySection section={{ items: artistAppearsOn, title: 'Appears On', path: '/album' }} />
{:catch}
  <!-- errors are handled in the getArtistAlbums function so these components are never acutally used -->
  <!-- in case of an error getArtistsAlbums return empty arrays -->
  <LoadingCategorySection error="Error Fetching Albums" />
  <LoadingCategorySection error="Error Fetching Singles" />
  <LoadingCategorySection error="Error Fetching Appears On" />
{/await}
