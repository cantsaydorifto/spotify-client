<script lang="ts">
  import Player from './Player.svelte';
  import Heart from './icons/Heart.svelte';
  // export let track: TrackObjectSimplified;
  const trackLink = {
    name: 'Subliminal',
    album: 'Subliminal',
    link: 'https://aac.saavncdn.com/624/45dfa2361588635387e4d363ea517e8a_320.mp4'
  };
</script>

<footer>
  <div class="current-song">
    <img src="https://i.scdn.co/image/ab67616d00004851f812179ed2b99e4ae771d3d1" alt="" />
    <div class="song-details">
      <span>Subliminal</span>
      <span><a href="/">half•alive</a></span>
    </div>
    <Heart width="18px" height="18px" />
  </div>
  <div class="player-controls">
    <Player track={trackLink} />
  </div>
</footer>

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
  .current-song > img {
    width: 56px;
    height: 56px;
    border-radius: 4px;
  }
  .player-controls {
    flex: 7;
    display: flex;
    height: 100%;
  }
</style>
