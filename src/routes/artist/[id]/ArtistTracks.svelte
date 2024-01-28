<script lang="ts">
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import { getArtistRecommendedTracks } from './helper';
  export let showRecommendations: boolean;
  export let hasLiked: boolean[];
  export let tracks: TrackObjectFull[];
  export let artistId: string;
</script>

{#key showRecommendations}
  <h2>{!showRecommendations ? 'Popular' : 'Songs You Might Like'}</h2>
{/key}
{#if !showRecommendations}
  <TrackDetails {hasLiked} noRowHeader {tracks} trackLinks={null} />
{:else}
  {#await getArtistRecommendedTracks( artistId, tracks.map((el) => el.id) )}
    <p style:color="green">Loading...</p>
  {:then { hasLikedRecommendations, recommendedTracks }}
    <TrackDetails
      hasLiked={hasLikedRecommendations}
      noRowHeader
      tracks={recommendedTracks}
      trackLinks={null}
    />
  {:catch error}
    <p style="color: red">"Error Fetching Recommendations"</p>
  {/await}
{/if}
