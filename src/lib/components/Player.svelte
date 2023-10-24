<script lang="ts">
  import { onMount } from 'svelte';
  import SongDurationSlider from './SongDurationSlider.svelte';
  import VolumeSlider from './VolumeSlider.svelte';
  import Pause from './icons/Pause.svelte';
  import Play from './icons/Play.svelte';

  export let track: {
    link: string;
  } | null;
  let audio: HTMLAudioElement;
  let currentTimeElement: HTMLSpanElement;
  let durationTimeElement: HTMLSpanElement;
  let paused = true;

  onMount(() => {
    audio.addEventListener('timeupdate', () => {
      currentTimeElement.textContent = msToTime(audio.currentTime * 1000);
    });
    audio.addEventListener('loadedmetadata', () => {
      console.log('done');
      durationTimeElement.textContent = msToTime(audio.duration * 1000);
    });
  });

  function togglePlay() {
    if (paused) {
      audio.play();
    } else {
      audio.pause();
    }
    paused = !paused;
  }
  function msToTime(duration: number) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const paddedMinutes = minutes === 0 ? '0' : minutes;
    const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours > 0 ? `${hours}:` : ''}${paddedMinutes}:${paddedSeconds}`;
  }
</script>

<div class="player">
  <audio autoplay bind:this={audio} src={track ? track.link : ''} bind:paused preload="none" />
  <div class="button-container">
    <button disabled={!track} class="play-song" on:click={togglePlay}>
      {#if !paused}
        <Pause width="18" height="18" />
      {:else}
        <Play width="18" height="18" />
      {/if}
    </button>
    <span bind:this={currentTimeElement} class="time time-l">0:00</span>
    <span bind:this={durationTimeElement} class="time time-r">0:00</span>
  </div>
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
  .button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
  }
  .time {
    font-size: 0.75rem;
    width: 50px;
    position: absolute;
    color: var(--light-gray);
  }
  .time-l {
    text-align: left;
    left: 0;
    bottom: 0;
  }
  .time-r {
    text-align: right;
    right: 0;
    bottom: 0;
  }
</style>
