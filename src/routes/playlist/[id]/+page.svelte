<script lang="ts">
  import Heart from '$lib/components/icons/Heart.svelte';
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import Play from '$lib/components/icons/Play.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';

  export let data;
  $: playlist = data.playlist;
  $: color = data.color;
  $: tracks = data.playlist.tracks.items.map((item) => item.track!);
</script>

<div class="container">
  <div
    class="color-gradient"
    style:background-image="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
  />
  <img src={playlist.images.length > 0 ? playlist.images[0].url : ''} alt="" />
  <div class="details">
    <span>{playlist.type[0].toUpperCase() + playlist.type.slice(1)}</span>
    <h1>{playlist.name}</h1>
    <div class="albumInfo">
      <!-- <img src={album.artists[0].} alt=""> -->
      <a href={'/user/' + playlist.owner.display_name}>{playlist.owner.display_name}</a>
      <span>&middot; {playlist.tracks.total} songs &middot;</span>
    </div>
  </div>
</div>

<div class="content">
  <div class="play">
    <button class="playBtn"><Play width="25" height="25" /></button>
    <button class="heart"><Heart width="36px" height="36px" /></button>
    <button class="heart"><ThreeHorizontalDots /></button>
  </div>
  <TrackDetails {tracks} trackLinks={null} />
</div>

<style>
  .container {
    position: relative;
    /* z-index: -1; */
    margin: calc(-1 * var(--navbar-height)) -30px 0 -30px;
    padding: 80px 30px 30px 30px;
    display: flex;
    gap: 50px;
  }
  .container > img {
    width: 230px;
    height: 230px;
    transition: transform 0.5s;
    box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
  }
  .container > img:hover {
    transform: scale(1.05);
  }
  .color-gradient {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 150%;
  }
  .details {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
  }
  .details > span {
    font-size: 0.875rem;
  }
  .details > h1 {
    font-size: 4rem;
    margin: 8px 0;
    line-height: normal;
    font-weight: 700;
  }
  .albumInfo {
    font-size: 0.875rem;
  }
  .albumInfo > a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 700;
  }
  .albumInfo > a:hover {
    text-decoration: underline;
  }
  .duration {
    color: var(--light-gray);
  }
  .content {
    min-height: 300px;
    background-image: linear-gradient(0deg, var(--bg-color), rgba(0, 0, 0, 0.2));
    margin: 0 -30px;
    padding: 0 30px;
  }
  .play {
    padding: 20px 0;
    display: flex;
    gap: 32px;
    align-items: center;
    height: 100px;
  }
  .playBtn {
    width: 56px;
    height: 56px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 50%;
    background-color: var(--accent-color);
    transition: all 0.3s;
  }
  .heart {
    background: none;
    border: none;
    transition: transform 0.3s;
    width: 34px;
    height: 34px;
    cursor: pointer;
  }
  .playBtn:hover,
  .heart:hover {
    transform: scale(1.05);
  }
</style>
