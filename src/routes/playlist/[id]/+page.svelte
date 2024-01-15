<script lang="ts">
  import Heart from '$lib/components/icons/Heart.svelte';
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import PlayBtn from '$lib/components/PlayBtn.svelte';
  import { currentSong } from '$lib/components/store/currentPlaying';

  function getTrackDuration(items: PlaylistTrackObject[]) {
    let duration = 0;
    items.forEach((el) => {
      duration += el.track?.duration_ms || 0;
    });
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration / 1000) % 60);
    return {
      minutes: minutes !== 0 ? `${minutes} min` : '',
      seconds: seconds !== 0 ? `${seconds} sec` : ''
    };
  }

  export let data;
  $: playlist = data.playlist;
  $: color = data.color;
  $: tracks = data.playlist.tracks.items.map((item) => item.track!);
  $: pageTitle = $currentSong.trackLink
    ? $currentSong.trackLink.name
    : `${playlist.name} - Playlist by ${playlist.owner.display_name}`;
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

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
      <!-- {#if playlist.owner.images && playlist.owner.images.length > 0}
        <img src={playlist.owner.images[0].url} alt="" />
      {/if} -->
      <p class="description">{playlist.description}</p>
      <a href={'/user/' + playlist.owner.display_name}>{playlist.owner.display_name}</a>
      <span>&middot; {playlist.tracks.total} songs &middot;</span>
      <span class="duration"
        >{getTrackDuration(playlist.tracks.items).minutes}
        {getTrackDuration(playlist.tracks.items).seconds}</span
      >
    </div>
  </div>
</div>

<div class="content">
  <div class="play">
    <PlayBtn innerSize={25} />
    <button class="heart"><Heart width="36px" height="36px" /></button>
    <button class="heart"><ThreeHorizontalDots /></button>
  </div>
  <TrackDetails {tracks} trackLinks={null} />
</div>

<style>
  .container {
    position: relative;
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
    font-size: 2rem;
    max-height: 150px;
    max-width: 500px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
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
  .duration,
  .description {
    font-size: 0.875rem;
    color: var(--light-gray);
  }
  .description {
    margin-bottom: 10px;
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
  .heart {
    background: none;
    border: none;
    transition: transform 0.3s;
    width: 34px;
    height: 34px;
    cursor: pointer;
  }
  .heart:hover {
    transform: scale(1.05);
  }
  @media only screen and (max-width: 800px) {
    .container {
      /* gap: 20px; */
      margin: calc(-1 * var(--navbar-height)) -15px 0 -15px;
    }
    .content {
      margin: 0 -15px;
      padding: 0 8px;
    }
  }
  @media only screen and (max-width: 600px) {
    .container {
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }
  }
</style>
