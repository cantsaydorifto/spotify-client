<script lang="ts">
  import Heart from '$lib/components/icons/Heart.svelte';
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import PlayBtn from '$lib/components/PlayBtn.svelte';

  function getTrackDuration(items: SaavnSong[]) {
    let duration = 0;
    items.forEach((el) => {
      duration += el.duration * 1000;
    });
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration / 1000) % 60);
    return {
      minutes: minutes !== 0 ? `${minutes} min` : '',
      seconds: seconds !== 0 ? `${seconds} sec` : ''
    };
  }

  export let data;

  const trackLinks = data.tracks.map((track) => {
    return {
      name: track.name,
      album: { name: track.album.name, id: track.album.id },
      img: track.album.images[track.album.images.length - 1].url,
      link: track.link || ''
    };
  });

  $: album = data.song;
  $: tracks = data.tracks;
  $: color = data.color;
  $: commaSeparatedArtists = data.commaSeparatedArtists;
</script>

<div class="container">
  <div
    class="color-gradient"
    style:background-image="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
  />
  <img src={album.image.length > 0 ? album.image[album.image.length - 1].link : ''} alt="" />
  <div class="details">
    <span>Track</span>
    <h1 title={album.name}>{album.name}</h1>
    <div class="albumInfo">
      <!-- <img src={album.artists[0].} alt=""> -->
      {#each commaSeparatedArtists as artist, artistIndex}
        <a href={`/svn/artist/${artist.id}`}>{artist.name}</a
        >{#if artistIndex < commaSeparatedArtists.length - 1}{', '}{/if}
      {/each}
      <span>&middot; {new Date(album.releaseDate).getFullYear()}</span>
      <span>&middot; 1 song &middot;</span>
      <span class="duration"
        >{getTrackDuration([album]).minutes}
        {getTrackDuration([album]).seconds}</span
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
  <TrackDetails {tracks} {trackLinks} svn />
  <p>
    Release Date : {new Date(album.releaseDate).toLocaleDateString('en', {
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
