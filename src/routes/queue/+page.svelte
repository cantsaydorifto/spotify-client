<script lang="ts">
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import { currentSong } from '$lib/components/store/currentPlaying';
  import { getTrackDuration } from '../album/[id]/helpers';
  import CurrentTrackContainer from './CurrentTrackContainer.svelte';
  import SongDetails from './SongDetails.svelte';
</script>

{#key $currentSong.trackLink?.id}
  {#if $currentSong.trackLink}
    <CurrentTrackContainer trackLink={$currentSong.trackLink} />
  {/if}
{/key}
{#if $currentSong.curTrackPtr < $currentSong.songQueue.length - 1}
  <h2>
    Up Next : {$currentSong.songQueue[$currentSong.curTrackPtr + 1].name} by {$currentSong
      .songQueue[$currentSong.curTrackPtr + 1].artist.name}
  </h2>
{/if}
<SongDetails tracks={$currentSong.songQueue} />

<style>
  h2 {
    font-weight: 500;
    margin-bottom: 20px;
    font-size: 1.5rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
    line-height: normal;
  }
</style>
