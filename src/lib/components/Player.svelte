<script lang="ts">
  import SongDurationSlider from './SongDurationSlider.svelte';
  import VolumeSlider from './VolumeSlider.svelte';
  import Pause from './icons/Pause.svelte';
  import Play from './icons/Play.svelte';

  export let track: {
    name: string;
    album: string;
    link: string;
  };
  let audio: HTMLAudioElement;
  let paused = true;

  function togglePlay() {
    if (paused) {
      audio.play();
    } else {
      audio.pause();
    }
    paused = !paused;
  }
</script>

<div class="player">
  <audio bind:this={audio} src={track.link} bind:paused preload="none" />
  <button class="play-song" on:click={togglePlay}>
    {#if !paused}
      <Pause width="18" height="18" />
    {:else}
      <Play width="18" height="18" />
    {/if}
  </button>
  {#if audio}
    <SongDurationSlider {audio} />
  {:else}
    <SongDurationSlider audio={null} />
  {/if}
</div>

<div class="volume-controls">
  {#if audio}
    <VolumeSlider {audio} />
  {:else}
    <VolumeSlider audio={null} />
  {/if}
</div>

<style>
  .player {
    flex: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
  }
  .play-song {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    border-radius: 50%;
    padding: 8px;
    background-color: var(--text-color);
  }
  .volume-controls {
    flex: 3;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 30px;
  }
</style>
