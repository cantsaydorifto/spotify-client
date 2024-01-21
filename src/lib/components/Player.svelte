<script lang="ts">
  import { onMount } from 'svelte';
  import SongDurationSlider from './SongDurationSlider.svelte';
  import VolumeSlider from './VolumeSlider.svelte';
  import Pause from './icons/Pause.svelte';
  import Play from './icons/Play.svelte';
  import Volume from './icons/Volume.svelte';
  import tippy from '$lib/actions/tippy';
  import { currentSong, playSong, playSongPrevious } from './store/currentPlaying';
  import SkipForward from './icons/SkipForward.svelte';
  import SkipBack from './icons/SkipBack.svelte';
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
    $currentSong.audio = audio;
    audio.addEventListener('timeupdate', () => {
      currentTimeElement.textContent = msToTime(audio.currentTime * 1000);
      currentTimeElement2.textContent = msToTime(audio.currentTime * 1000);
      if (isFinite(audio.duration))
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: audio.currentTime
        });
    });
    audio.addEventListener('loadedmetadata', () => {
      // console.log('done');
      durationTimeElement.textContent = msToTime(audio.duration * 1000);
      durationTimeElement2.textContent = msToTime(audio.duration * 1000);
    });
    audio.addEventListener('play', function () {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime
      });
      navigator.mediaSession.metadata = new MediaMetadata({
        title: $currentSong.trackLink ? $currentSong.trackLink.name : 'No Song Playing',
        artist: $currentSong.trackLink ? $currentSong.trackLink.artist.name : 'No Artist Playing',
        album: $currentSong.trackLink ? $currentSong.trackLink.album.name : 'No Album Playing',
        artwork: $currentSong.trackLink
          ? [{ src: $currentSong.trackLink.img, sizes: '640x640', type: 'image/png' }]
          : []
      });
      navigator.mediaSession.setActionHandler('play', () => {
        audio.play();
        paused = false;
        $currentSong.isPaused = paused;
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
        paused = true;
        $currentSong.isPaused = paused;
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        skipTrackForward(true);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        skipTrackForward(false);
      });
      console.log(navigator.mediaSession.metadata);
    });
  });

  function skipTrackForward(frwd: boolean) {
    if (frwd && $currentSong.curTrackPtr < $currentSong.songQueue.length) {
      playSong();
      return;
    }
    if (!frwd && $currentSong.curTrackPtr > 0) {
      playSongPrevious();
      return;
    }
  }

  function togglePlay() {
    if (paused) {
      audio.play();
    } else {
      audio.pause();
    }
    paused = !paused;
    $currentSong.isPaused = paused;
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
    <div class="player-controls">
      <button on:click={() => skipTrackForward(false)} class="skip-song"
        ><SkipBack width="20" height="20" stroke="white" /></button
      >
      <button disabled={!track} class="play-song" on:click={togglePlay}>
        {#if !paused}
          <Pause stroke="white" stroke-width="1" width="27" height="27" />
        {:else}
          <Play stroke="white" stroke-width="1" width="27" height="27" />
        {/if}
      </button>
      <button on:click={() => skipTrackForward(true)} class="skip-song"
        ><SkipForward width="20" height="20" stroke="white" /></button
      >
    </div>
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
    /* padding: 8px 0; */
  }
  .skip-song {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
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
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .player-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
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
    .volume-tippy-btn > :global(svg) {
      stroke: var(--text-color);
    }
    .timeContainer {
      display: block;
    }
    .button-container {
      display: flex;
      gap: 20px;
    }
  }
  @media only screen and (max-width: 600px) {
    .timeContainer {
      display: none;
    }
  }
</style>
