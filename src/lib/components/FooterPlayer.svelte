<script lang="ts">
  import Player from './Player.svelte';
  import Music from './icons/Music.svelte';
  import { currentSong } from './store/currentPlaying';
</script>

{#if !!$currentSong.trackLink}
  <footer>
    <div class="footerContainer">
      <div class="current-song">
        <img src={$currentSong.trackLink.img} alt="" />
        <div class="song-details">
          <span title={$currentSong.trackLink.name}>{$currentSong.trackLink.name}</span>
          <span><a href="/">{$currentSong.trackLink.artist}</a></span>
        </div>
        <!-- <Heart width="18px" height="18px" /> -->
      </div>
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
    bottom: 0;
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
  .current-song > img,
  .albumArtContainer {
    width: 56px;
    height: 56px;
    border-radius: 4px;
    flex-shrink: 0;
    background-color: var(--dark-gray);
    display: flex;
    justify-content: center;
    align-items: center;
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
    .song-details > span {
      max-width: 400px;
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
