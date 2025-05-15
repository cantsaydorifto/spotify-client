<script lang="ts">
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  export let hasLiked: boolean[];
  export let tracks: TrackObjectFull[];
</script>

<h2>Popular</h2>
<TrackDetails {hasLiked} noRowHeader {tracks} trackLinks={null} />
