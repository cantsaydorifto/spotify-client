<script lang="ts">
  import Play from './icons/Play.svelte';
  import greenEqualiser from '../../assets/equaliser-animated-green.gif';
  import { currentSong, playSvnSong, togglePlay } from './store/currentPlaying';
  export let track: SaavnSong;

  function msToTime(duration: number) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const paddedMinutes = minutes === 0 ? '0' : minutes;
    const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours > 0 ? `${hours}:` : ''}${paddedMinutes}:${paddedSeconds}`;
  }
</script>

<div class="tracks">
  <div class="tracks-container">
    <div
      class="row"
      class:playing={$currentSong.trackLink ? $currentSong.trackLink.id === track.id : false}
    >
      <div class="trackInfoContainer">
        {#if $currentSong.trackLink && $currentSong.trackLink.id === track.id}
          <div
            class="imageContainer"
            style="background-image: url({track.image[track.image.length - 2].link})"
          >
            <div class="overlay" style:display="block" />
            {#if !$currentSong.isPaused}
              <img style:z-index="2" width="15" height="15" src={greenEqualiser} alt="equaliser" />
            {:else}
              <button on:click={() => togglePlay()} class="playBtn" style:display="block">
                <Play width="20px" height="20px" stroke="white" />
              </button>
            {/if}
          </div>
        {:else}
          <div
            class="imageContainer"
            style="background-image: url({track.image[track.image.length - 2].link})"
          >
            <div class="overlay" />
            <button class="playBtn" on:click={() => playSvnSong(track)}
              ><Play width="20px" height="20px" stroke="white" /></button
            >
          </div>
        {/if}
        <div class="info-column">
          <div class="track-title">
            <h4
              style:color={$currentSong.trackLink && $currentSong.trackLink.id === track.id
                ? 'var(--accent-color)'
                : 'white'}
              title={track.name}
            >
              <a data-sveltekit-preload-data="tap" href={`/track/${track.id}`}>{@html track.name}</a
              >
            </h4>
            {#if track.explicitContent}
              <span class="explicit">E</span>
            {/if}
          </div>
          <p class="artists">
            <a href={`/svn/artist/${track.primaryArtistsId}`}>{track.primaryArtists}</a>
            &middot;
            <a href={`/svn/album/${track.album.id}`}>{track.album.name}</a>
          </p>
        </div>
      </div>
      <div class="duration-column">
        <span class="duration">{msToTime(Number(track.duration) * 1000)}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .tracks {
    animation: fadeIn 0.5s ease-in-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .row {
    display: flex;
    align-items: center;
    padding: 7px 5px;
    width: 500px;
    border-radius: 4px;
  }

  .tracks-container {
    display: flex;
    flex-direction: column;
  }

  .track-title {
    font-size: 0.875rem;
  }

  .row:hover,
  .playing {
    background-color: rgba(255, 255, 255, 0.05);
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
  }

  .playBtn {
    display: none;
    z-index: 2;
    animation: popIn 0.2s ease-in-out;
  }

  .row:hover .playBtn {
    display: block;
  }

  @keyframes popIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 01;
    }
  }

  .trackInfoContainer {
    flex: 1;
    display: flex;
    gap: 20px;
  }

  .imageContainer {
    width: 50px;
    height: 50px;
    border-radius: 2px;
    background-size: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .row:hover .overlay {
    display: block;
  }

  .overlay {
    z-index: 0;
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 2px;
    animation: popIn 0.2s ease-in-out;
  }

  .info-column {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 7px;
  }
  .track-title {
    display: flex;
    align-items: center;
  }

  .track-title h4 {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1;
    max-width: 300px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }

  .track-title > h4 > a {
    color: inherit;
    text-decoration: none;
  }

  .explicit {
    text-transform: uppercase;
    background-color: hsla(0, 0%, 100%, 0.6);
    font-size: 0.5rem;
    margin-left: 10px;
    border: 1px solid;
    padding: 2px 4px;
    border-radius: 2px;
    line-height: 0.625rem;
    color: var(--header-color);
  }

  .artists {
    color: var(--light-gray);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    max-width: 300px;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    gap: 5px;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }

  .artists > a {
    max-width: 150px;
    overflow: hidden;
    color: inherit;
    text-decoration: none;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }

  .artists > a:hover {
    text-decoration: underline;
  }

  .duration {
    display: inline-block;
    color: var(--light-gray);
    /* background-color: red; */
    width: 30px;
    margin: 0 auto;
    font-size: 0.875rem;
  }
  .duration-column {
    padding-right: 10px;
    display: flex;
    align-items: center;
    gap: 30px;
  }
  @media only screen and (max-width: 600px) {
    .duration {
      display: none;
    }
    .duration-column {
      padding-right: 0;
      padding-left: 5px;
    }
    .trackInfoContainer {
      gap: 10px;
    }
    .row {
      width: calc(100vw - 36px);
    }
  }
  @media only screen and (max-width: 450px) {
    .track-title h4 {
      max-width: 200px;
    }
    .artists > a:nth-child(1) {
      max-width: 120px;
    }
    .artists > a:nth-child(2) {
      max-width: 100px;
    }
  }
  @media only screen and (max-width: 370px) {
    .track-title h4 {
      max-width: 150px;
    }
    .artists > a:nth-child(2) {
      max-width: 75px;
    }
  }
  @media only screen and (max-width: 350px) {
    .artists > a:nth-child(1) {
      max-width: 80px;
    }
  }
  @media only screen and (max-width: 300px) {
    .track-title h4 {
      max-width: 70px;
    }
    .artists > a:nth-child(2) {
      max-width: 30px;
    }
  }
</style>
