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
  import LeftArrow from './icons/LeftArrow.svelte';
  import Queue from './icons/Queue.svelte';
  export let track: {
    link: string;
  } | null;
  let audio: HTMLAudioElement;
  let currentTimeElement: HTMLSpanElement;
  let currentTimeElement2: HTMLSpanElement;
  let durationTimeElement: HTMLSpanElement;
  let durationTimeElement2: HTMLSpanElement;
  let volumeMenu: HTMLDivElement;
  let volTippyBtn: HTMLButtonElement;
  let volTippyBtn2: HTMLButtonElement;
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
      // console.log(navigator.mediaSession.metadata);
    });
  });

  function skipTrackForward(frwd: boolean) {
    if (frwd && $currentSong.curTrackPtr < $currentSong.songQueue.length - 1) {
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
    <span bind:this={currentTimeElement} class="time time-l">0:00</span>
    <span bind:this={durationTimeElement} class="time time-r">0:00</span>
    <div bind:this={volumeMenu} id="volume-menu" style="display: none;">
      <div class="volume-controls-tippy">
        <a href="/queue"><Queue width="20" height="20" /></a>
        <Volume width="20" height="20" />
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
  <button
    class="volume-tippy-btn-outside"
    bind:this={volTippyBtn2}
    use:tippy={{
      content: volumeMenu,
      onMount: () => {
        volumeMenu.style.display = 'flex';
        volTippyBtn2.style.transform = 'rotate(180deg)';
      },
      onHide: () => {
        volTippyBtn2.style.transform = 'rotate(0)';
      },
      trigger: 'click mouseenter',
      placement: 'left',
      interactive: true,
      theme: 'vol-menu',
      animation: 'shift-away'
    }}
  >
    <LeftArrow width="25" height="25" />
  </button>
</div>

<style>
  #volume-menu {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
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
    padding-right: 10px;
  }
  .volume-tippy-btn-outside {
    background: none;
    cursor: pointer;
    height: 25px;
    border: none;
    transition: all 0.2s ease-in-out;
  }
  .volume-tippy-btn-outside > :global(svg) {
    stroke: var(--text-color);
  }
  .volume-controls-tippy {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .volume-controls-tippy > a {
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
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
    .player {
      flex: none;
      justify-content: center;
    }
    .timeContainer {
      display: block;
    }
    .button-container {
      display: flex;
      gap: 20px;
    }
    .volume-controls {
      padding: 0 0 0 15px;
    }
  }
  @media only screen and (max-width: 600px) {
    .timeContainer {
      display: none;
    }
  }
</style>
