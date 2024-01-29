<script lang="ts">
  import Heart from '$lib/components/icons/Heart.svelte';
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import PlayBtn from '$lib/components/PlayBtn.svelte';
  import { currentSong } from '$lib/components/store/currentPlaying';
  import { page } from '$app/stores';

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
  $: user = $page.data.user;
  $: userSavedTracks = data.userSavedTrackRes;
  $: color = data.color.dominantColor;
  $: pagination = data.pagination;
  $: tracks = data.userSavedTrackRes.items.map((item) => item.track!);
  $: pageTitle = $currentSong.trackLink ? $currentSong.trackLink.name : 'Saved Tracks';

  async function loadMoreTracks() {
    if (!pagination.hasMoreTracks) return;
    const res = await fetch(`/api/spotify/me/tracks?limit=50&offset=${pagination.trackOffset}`);
    const savedTracks = (await res.json()) as UsersSavedTracksResponse;

    pagination.trackOffset += 50;
    pagination.hasMoreTracks = savedTracks.total > pagination.trackOffset;

    tracks = [...tracks, ...savedTracks.items.map((item) => item.track)] as TrackObjectFull[];
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="container">
  <div
    class="color-gradient"
    style:background-image="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
  />
  <img src="https://misc.scdn.co/liked-songs/liked-songs-640.png" alt="Saved Tracks" />
  <div class="details">
    <span>Playlist</span>
    <h1 title="Liked Tracks">Liked Tracks</h1>
    <div class="albumInfo">
      {#if user && user.images && user.images.length > 0}
        <div>
          <img src={user.images[0].url} alt="" />
          <a href="/user/me">{user.display_name}</a>
        </div>
      {/if}
      <span>{userSavedTracks.total} songs</span>
    </div>
  </div>
</div>

<div class="content">
  <div class="play">
    <PlayBtn innerSize={25} />
  </div>
  <TrackDetails hasLiked={new Array(tracks.length).fill(true)} {tracks} trackLinks={null} />
  {#if pagination.hasMoreTracks}
    <div class="showMoreBtn">
      <button on:click={() => loadMoreTracks()}>Show More</button>
    </div>
  {/if}
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
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .albumInfo > div {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .albumInfo > div > img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
  }
  .albumInfo > div > a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 700;
  }
  .albumInfo > div > a:hover {
    text-decoration: underline;
  }
  .content {
    min-height: 300px;
    background-image: linear-gradient(0deg, var(--bg-color), rgba(0, 0, 0, 0.2));
    margin: 0 -30px;
    padding: 0 30px 60px 30px;
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
  .showMoreBtn {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .showMoreBtn > button {
    border: none;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 20px;
    cursor: pointer;
    text-decoration: none;
    padding: 7px 15px;
    background: none;
    color: var(--text-color);
    border: 2px solid;
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
