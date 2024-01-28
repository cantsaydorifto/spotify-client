<script lang="ts">
  import Player from './Player.svelte';
  import { currentSong } from './store/currentPlaying';
</script>

{#if !!$currentSong.trackLink}
  <footer>
    <div class="footerContainer">
      {#key $currentSong.trackLink.id}
        <div class="current-song">
          {#if $currentSong.trackLink.id === 'LOADING'}
            <span class="loadingImageContainer">
              <span class="loader" />
            </span>
          {:else}
            <img src={$currentSong.trackLink.img} alt="" />
          {/if}
          <div class="song-details">
            <span title={$currentSong.trackLink.name}>{@html $currentSong.trackLink.name}</span>
            <span
              ><a href={`/artist/${$currentSong.trackLink.artist.id}`}
                >{@html $currentSong.trackLink.artist.name}</a
              ></span
            >
          </div>
          <!-- <Heart width="18px" height="18px" /> -->
        </div>
      {/key}
      <div class="player-controls">
        <Player track={$currentSong.trackLink} />
      </div>
    </div>
  </footer>
{/if}

<style>
  footer {
    z-index: 2;
    width: 100%;
    position: fixed;
    bottom: -1px;
    background-color: var(--sidebar-color);
    animation: player 0.2s ease-in-out;
  }
  @keyframes player {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }
  .footerContainer {
    height: 88px;
    padding: 8px 0;
    width: 100%;
    display: flex;
    position: relative;
  }
  .current-song {
    flex: 3;
    display: flex;
    gap: 16px;
    align-items: center;
    height: 100%;
    min-width: 220px;
    padding: 10px 0 10px 16px;
    animation: fadeIn 0.35s ease-in-out;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .song-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .song-details > span {
    display: -webkit-box;
    max-width: 330px;
    padding-right: 20px;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }
  .song-details > span:nth-child(1) {
    font-size: 0.875rem;
  }
  .song-details > span:nth-child(2) {
    font-size: 0.6875rem;
  }
  .song-details > span:nth-child(2) > a {
    color: var(--light-gray);
    text-decoration: none;
  }
  .song-details > span:nth-child(2) > a:hover {
    text-decoration: underline;
  }
  .current-song > img {
    width: 56px;
    height: 56px;
    border-radius: 4px;
    flex-shrink: 0;
    background-color: var(--dark-gray);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loadingImageContainer {
    width: 56px;
    height: 56px;
    opacity: 0.6;
    border-radius: 4px;
    flex-shrink: 0;
    background-color: rgba(66, 66, 66, 0.588);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loader {
    width: 25px;
    height: 25px;
    border: 2px solid #7b7b7b;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .player-controls {
    flex: 7;
    display: flex;
    height: 100%;
  }
  @media only screen and (max-width: 900px) {
    .player-controls {
      flex: none;
      padding-right: 16px;
    }
    .current-song {
      flex: 1;
    }
  }
  @media only screen and (max-width: 700px) {
    .song-details > span {
      max-width: 250px;
    }
  }
  @media only screen and (max-width: 550px) {
    .song-details > span {
      max-width: 120px;
    }
  }
</style>
