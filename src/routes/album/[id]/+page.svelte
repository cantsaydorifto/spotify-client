<script lang="ts">
  import Heart from '$lib/components/icons/Heart.svelte';
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import PlayBtn from '$lib/components/PlayBtn.svelte';
  import { currentSong } from '$lib/components/store/currentPlaying';

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
  $: tracks = data.tracks.map((el) => ({ ...el, img: album.images[0].url }));
  $: pageTitle = $currentSong.trackLink
    ? $currentSong.trackLink.name
    : `${album.name} - Album by ${album.artists[0].name}`;
  $: hasLiked = data.hasliked;
  $: recommendations = data.recommendedTracks;
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="container">
  <div
    class="color-gradient"
    style:background-image="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
  />
  <img src={album.images.length > 0 ? album.images[0].url : ''} alt="" />
  <div class="details">
    <span>{album.type[0].toUpperCase() + album.type.slice(1)}</span>
    <h1 title={album.name}>{@html album.name}</h1>
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
    <PlayBtn innerSize={25} />
    <button class="heart"><Heart width="36px" height="36px" /></button>
    <button class="heart"><ThreeHorizontalDots /></button>
  </div>
  <TrackDetails {hasLiked} tracks={album.tracks.items} trackLinks={tracks} />
  <p>
    Release Date : {new Date(album.release_date).toLocaleDateString('en', {
      dateStyle: 'long'
    })}
  </p>
  <h2>Recommendations Based On {album.name}</h2>
  <TrackDetails noRowHeader tracks={recommendations || []} trackLinks={null} />
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
    font-size: 3rem;
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
  .content > p {
    color: var(--light-gray);
    font-size: 1rem;
    margin: 20px 0 60px 0;
  }
  .content > h2 {
    color: var(--light-gray);
  }
  .content {
    min-height: 300px;
    background-image: linear-gradient(0deg, var(--bg-color), rgba(0, 0, 0, 0.2));
    margin: 0 -30px;
    padding: 0 30px 50px 30px;
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
    .details > h1 {
      font-size: 2rem;
    }
    .content {
      margin: 0 -15px;
      padding: 0 8px 50px 8px;
    }
  }
  @media only screen and (max-width: 600px) {
    .container {
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }
</style>
