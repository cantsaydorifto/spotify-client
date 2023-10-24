<script lang="ts">
  import Player from './Player.svelte';
  import Heart from './icons/Heart.svelte';
  import Music from './icons/Music.svelte';
  import { currentSong } from './store/currentPlaying';
</script>

{#if !$currentSong.trackLink}
  <footer>
    <div class="current-song">
      <div class="albumArtContainer">
        <Music width="20" />
      </div>
      <div class="song-details">
        <span>Nothings Playing</span>
        <span><a href="/">No Artist</a></span>
      </div>
      <Heart width="18px" height="18px" />
    </div>
    <div class="player-controls">
      <Player track={null} />
    </div>
  </footer>
{:else}
  <footer>
    <div class="current-song">
      <img src={$currentSong.trackLink.img} alt="" />
      <div class="song-details">
        <span>{$currentSong.trackLink.name}</span>
        <span><a href="/">{$currentSong.trackLink.artist}</a></span>
      </div>
      <Heart width="18px" height="18px" />
    </div>
    <div class="player-controls">
      <Player track={$currentSong.trackLink} />
    </div>
  </footer>
{/if}

<style>
  footer {
    z-index: 2;
    width: 100%;
    height: 88px;
    padding: 8px 0;
    position: fixed;
    bottom: 0;
    display: flex;
    background-color: var(--sidebar-color);
  }
  .current-song {
    flex: 3;
    display: flex;
    gap: 16px;
    align-items: center;
    height: 100%;
    padding: 10px 0 10px 16px;
  }
  .song-details {
    display: flex;
    flex-direction: column;
    padding-right: 8px;
    gap: 5px;
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
</style>
