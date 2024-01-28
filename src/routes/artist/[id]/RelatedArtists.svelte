<script lang="ts">
  import CatergorySection from '$lib/components/CatergorySection.svelte';
  import LoadingCategorySection from '$lib/components/LoadingCategorySection.svelte';
  import { getRelatedArtists } from './helper';

  export let artistId: string;
</script>

{#await getRelatedArtists(artistId)}
  <LoadingCategorySection />
{:then { relatedArtists }}
  <CatergorySection artistSearchResults={{ title: 'Related Artists', items: relatedArtists }} />
{:catch error}
  <!-- errors are handled in the getRelatedArtists function so this component is never acutally used -->
  <!-- in case of an error getRelatedArtists return empty arrays -->
  <LoadingCategorySection error="Error Fetching Related Artists" />
{/await}
