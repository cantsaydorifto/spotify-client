<script lang="ts">
  import { onMount } from 'svelte';
  import SongDurationSlider from './SongDurationSlider.svelte';
  import VolumeSlider from './VolumeSlider.svelte';
  import Pause from './icons/Pause.svelte';
  import Play from './icons/Play.svelte';
  import Volume from './icons/Volume.svelte';
  import tippy from '$lib/actions/tippy';

  export let track: {
    link: string;
  } | null;
  let audio: HTMLAudioElement;
  let currentTimeElement: HTMLSpanElement;
  let currentTimeElement2: HTMLSpanElement;
  let durationTimeElement: HTMLSpanElement;
  let durationTimeElement2: HTMLSpanElement;
  let paused = true;

  onMount(() => {
    audio.addEventListener('timeupdate', () => {
      currentTimeElement.textContent = msToTime(audio.currentTime * 1000);
      currentTimeElement2.textContent = msToTime(audio.currentTime * 1000);
    });
    audio.addEventListener('loadedmetadata', () => {
      // console.log('done');
      durationTimeElement.textContent = msToTime(audio.duration * 1000);
      durationTimeElement2.textContent = msToTime(audio.duration * 1000);
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
    <div class="timeContainer">
      <span bind:this={currentTimeElement2}>0:00</span>
      <span>/</span>
      <span bind:this={durationTimeElement2}>0:00</span>
    </div>
    <button disabled={!track} class="play-song" on:click={togglePlay}>
      {#if !paused}
        <Pause width="18" height="18" />
      {:else}
        <Play width="18" height="18" />
      {/if}
    </button>
    <button
      class="volume-tippy-btn"
      use:tippy={{
        content: document.getElementById('volume-menu') || undefined,
        onMount: () => {
          const template = document.getElementById('volume-menu');
          if (template) {
            template.style.display = 'block';
          }
        },
        trigger: 'mouseenter click',
        placement: 'top-end',
        interactive: true,
        theme: 'vol-menu'
      }}
    >
      <Volume width="20" />
    </button>
    <span bind:this={currentTimeElement} class="time time-l">0:00</span>
    <span bind:this={durationTimeElement} class="time time-r">0:00</span>
    <div id="volume-menu" style="display: none;">
      <div class="volume-controls-tippy">
        {#if audio}
          <VolumeSlider {audio} />
        {:else}
          <VolumeSlider audio={null} />
        {/if}
      </div>
    </div>
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
  .volume-tippy-btn {
    background: none;
    border: none;
    display: none;
  }
  .volume-controls-tippy {
    width: 100px;
  }
  .button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
  .timeContainer {
    display: none;
  }
  .timeContainer > span {
    font-size: 0.75rem;
    width: 50px;
    color: var(--light-gray);
  }
  @media only screen and (max-width: 900px) {
    .time {
      display: none;
    }
    .volume-controls {
      flex: none;
      display: none;
    }
    .player {
      flex: none;
      justify-content: center;
    }
    .volume-tippy-btn {
      display: block;
    }
    .play-song > :global(svg) {
      fill: var(--text-color);
    }
    .volume-tippy-btn > :global(svg) {
      stroke: var(--text-color);
    }
    .play-song {
      background-color: var(--sidebar-color);
      scale: 1.5;
      padding: 0;
    }
    .timeContainer {
      display: block;
    }
    .button-container {
      display: flex;
      gap: 20px;
    }
  }
</style>
