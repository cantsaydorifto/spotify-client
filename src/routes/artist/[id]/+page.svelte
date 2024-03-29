<script lang="ts">
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import PlayBtn from '$lib/components/PlayBtn.svelte';
  import Button from '$lib/components/Button.svelte';
  import { currentSong } from '$lib/components/store/currentPlaying.js';
  import Radio from '$lib/components/icons/Radio.svelte';
  import { numberToCommaString } from './helper';
  import ArtistAlbums from './ArtistAlbums.svelte';
  import ArtistSearchPlaylists from './ArtistSearchPlaylists.svelte';
  import RelatedArtists from './RelatedArtists.svelte';
  import ArtistTracks from './ArtistTracks.svelte';

  export let data;
  $: artist = data.artist;
  $: color = data.color ? data.color.dominantColor : null;
  $: tracks = data.artistTracks;
  $: hasLiked = data.hasliked;
  $: curTrack = $currentSong.trackLink ? $currentSong.trackLink.name : artist.name;
  $: showRecommendations = false;
</script>

<svelte:head>
  <title>{curTrack}</title>
</svelte:head>

{#key artist.id}
  <div class="container">
    <div
      class="color-gradient"
      style:background-image="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
    />
    <img src={artist.images.length > 0 ? artist.images[0].url : ''} alt="" />
    <div class="details">
      <span>{artist.type[0].toUpperCase() + artist.type.slice(1)}</span>
      <h1>{@html artist.name}</h1>
      <div class="albumInfo">
        <!-- <img src={album.artists[0].} alt=""> -->
        <!-- <a href={'/user/' + playlist.owner.display_name}>{playlist.owner.display_name}</a> -->
        <span>{numberToCommaString(artist.followers.total)} followers</span>
      </div>
    </div>
  </div>
{/key}

<div class="content">
  <div class="play">
    <PlayBtn innerSize={25} />
    <!-- <button class="heart"><Heart width="36px" height="36px" /></button> -->
    <Button element="button" style="outline">Follow</Button>
    <button
      class="recommendationBtn"
      title="Recommendations"
      on:click={() => {
        showRecommendations = !showRecommendations;
      }}
    >
      <Radio
        width="40"
        height="40"
        stroke={showRecommendations ? 'var(--accent-color)' : 'var(--light-gray)'}
      />
    </button>
    <button class="heart"><ThreeHorizontalDots /></button>
  </div>
  <ArtistTracks {showRecommendations} artistId={artist.id} {hasLiked} {tracks} />
  <!-- <h2>Discography</h2> -->

  <ArtistAlbums artistId={artist.id} />
  <ArtistSearchPlaylists artistName={artist.name} />
  <RelatedArtists artistId={artist.id} />
</div>

<style>
  .container {
    position: relative;
    /* z-index: -1; */
    margin: calc(-1 * var(--navbar-height)) -30px 0 -30px;
    padding: 80px 30px 30px 30px;
    display: flex;
    animation: fadeIn 0.3s ease-in-out;
    gap: 50px;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
  .recommendationBtn {
    background: none;
    border: none;
    cursor: pointer;
  }
  .recommendationBtn :global(svg) {
    transition: stroke 0.5s;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
