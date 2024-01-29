<script lang="ts">
  import Heart from '$lib/components/icons/Heart.svelte';
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import PlayBtn from '$lib/components/PlayBtn.svelte';
  import { currentSong, setColor, togglePlay } from '$lib/components/store/currentPlaying';
  import { getColor, getTrackDuration, loadMoreTracks, startPlaylistPlayback } from './helpers.js';
  import { onMount } from 'svelte';

  async function loadMoreHandler() {
    const res = await loadMoreTracks(pagination, playlist.id);
    if (!res) return;
    const { playlistTracks, likedByUser } = res;
    tracks = [...tracks, ...playlistTracks.items.map((item) => item.track!)];
    hasLiked = [...hasLiked, ...likedByUser];
  }

  export let data;
  $: playlist = data.playlist;
  $: color = null as string | null;
  $: pagination = data.pagination;
  $: hasLiked = data.hasliked;
  $: tracks = data.playlist.tracks.items.map((item) => item.track!);
  $: pageTitle = $currentSong.trackLink
    ? $currentSong.trackLink.name
    : `${playlist.name} - Playlist by ${playlist.owner.display_name}`;

  onMount(() => {
    getColor(playlist.images[0].url).then((res) => {
      if (!res) return;
      color = res.dominantColor;
      setColor(res.dominantColor);
    });
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class={'container'}>
  <div
    class={'color-gradient'}
    style:background="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
    style:opacity={color ? 1 : 0}
  />
  <img src={playlist.images.length > 0 ? playlist.images[0].url : ''} alt="" />
  <div class="details">
    <span>{playlist.type[0].toUpperCase() + playlist.type.slice(1)}</span>
    <h1 title={playlist.name}>{@html playlist.name}</h1>
    <div class="albumInfo">
      <!-- {#if playlist.owner.images && playlist.owner.images.length > 0}
        <img src={playlist.owner.images[0].url} alt="" />
      {/if} -->
      <p title={playlist.description} class="description">{@html playlist.description}</p>
      <a href={'/user/' + playlist.owner.display_name}>{@html playlist.owner.display_name}</a>
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
    {#if !$currentSong.trackLink || !$currentSong.currentlyPlaying || $currentSong.currentlyPlaying.id !== playlist.id}
      <PlayBtn
        onclick={() => startPlaylistPlayback(tracks, { name: playlist.name, id: playlist.id })}
        type="play"
        innerSize={25}
      />
    {:else if $currentSong.currentlyPlaying.type === 'PLAYLIST' && $currentSong.isPaused}
      <PlayBtn onclick={() => togglePlay()} type="play" innerSize={25} />
    {:else}
      <PlayBtn onclick={() => togglePlay()} type="pause" innerSize={25} />
    {/if}
    <button class="heart"><Heart width="36px" height="36px" /></button>
    <button class="heart"><ThreeHorizontalDots /></button>
  </div>
  <TrackDetails
    playlist={{ name: playlist.name, id: playlist.id }}
    {hasLiked}
    {tracks}
    trackLinks={null}
  />
  {#if pagination.hasMoreTracks}
    <div class="showMoreBtn">
      <button on:click={() => loadMoreHandler()}>Show More</button>
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
    opacity: 0;
    transition: all 1.5s;
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
