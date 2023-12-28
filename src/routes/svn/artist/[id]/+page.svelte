<script lang="ts">
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import PlayBtn from '$lib/components/PlayBtn.svelte';
  import Button from '$lib/components/Button.svelte';
  import CatergorySection from '$lib/components/CatergorySection.svelte';

  export let data;

  const trackLinks = data.tracks.map((el) => {
    return {
      name: el.name,
      album: el.album.name,
      img: el.album.images[el.album.images.length - 1].url,
      link: el.link || ''
    };
  });

  $: artist = data.artist;
  $: albums = data.albums;
  $: tracks = data.tracks;
  $: color = data.color;
</script>

<div class="container">
  <div
    class="color-gradient"
    style:background-image="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
  />
  <img src={artist.image.length > 0 ? artist.image[artist.image.length - 1].link : ''} alt="" />
  <div class="details">
    <span>Artist</span>
    <h1>{artist.name}</h1>
    <!-- <div class="albumInfo">
      <span>{numberToCommaString(artist.followers.total)} followers</span>
    </div> -->
  </div>
</div>

<div class="content">
  <div class="play">
    <PlayBtn innerSize={25} />
    <!-- <button class="heart"><Heart width="36px" height="36px" /></button> -->
    <Button element="button" style="outline">Follow</Button>
    <button class="heart"><ThreeHorizontalDots /></button>
  </div>
  <h2>Popular</h2>
  <TrackDetails svn noRowHeader {tracks} {trackLinks} />
  <CatergorySection
    saavnHomepageData={{ albums, charts: [], playlists: [], trendingAlbums: [], trendingSongs: [] }}
  />
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
    width: 300px;
    height: 300px;
    object-fit: cover;
    transition: transform 0.5s;
    /* border-radius: 12px; */
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
  h2 {
    font-size: 1.5rem;
    padding-left: 20px;
  }
  .albumInfo {
    font-size: 0.875rem;
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
    .details > h1 {
      font-size: 2rem;
    }
    .content {
      padding: 0 15px;
      margin: 0 -15px;
    }
  }
  @media only screen and (max-width: 600px) {
    .container {
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .details > span {
      display: none;
    }
    .details > h1 {
      text-align: center;
    }
  }
</style>
