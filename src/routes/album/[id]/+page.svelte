<script lang="ts">
  import Player from '$lib/components/Player.svelte';
  import Heart from '$lib/components/icons/Heart.svelte';
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import Play from '$lib/components/icons/Play.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';

  function getTrackDuration(items: TrackObjectSimplified[]) {
    let duration = 0;
    items.forEach((el) => {
      duration += el.duration_ms;
    });
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration / 1000) % 60);
    return {
      minutes: minutes !== 0 ? `${minutes} min` : '',
      seconds: seconds !== 0 ? `${seconds} sec` : ''
    };
  }

  export let data;
  $: album = data.album;
  $: color = data.color;
  $: tracks = data.tracks;
  $: {
    console.log(tracks);
  }
</script>

<div class="container">
  <div
    class="color-gradient"
    style:background-image="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
  />
  <img src={album.images.length > 0 ? album.images[0].url : ''} alt="" />
  <div class="details">
    <span>{album.type[0].toUpperCase() + album.type.slice(1)}</span>
    <h1>{album.name}</h1>
    <div class="albumInfo">
      <!-- <img src={album.artists[0].} alt=""> -->
      <a href={'/artist/' + album.artists[0].id}>{album.artists[0].name}</a>
      <span>&middot; {new Date(album.release_date).getFullYear()}</span>
      <span>&middot; {album.total_tracks} songs &middot;</span>
      <span class="duration"
        >{getTrackDuration(album.tracks.items).minutes}
        {getTrackDuration(album.tracks.items).seconds}</span
      >
    </div>
  </div>
</div>
<div class="content">
  <div class="play">
    <button class="playBtn"><Play /></button>
    <button class="heart"><Heart width="36px" height="36px" /></button>
    <button class="heart"><ThreeHorizontalDots /></button>
  </div>
  <TrackDetails tracks={data.album.tracks.items} />
  <p>
    Release Date : {new Date(album.release_date).toLocaleDateString('en', {
      dateStyle: 'long'
    })}
  </p>
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