<script lang="ts">
  import Heart from '$lib/components/icons/Heart.svelte';
  import ThreeHorizontalDots from '$lib/components/icons/ThreeHorizontalDots.svelte';
  import TrackDetails from '$lib/components/TrackDetails.svelte';
  import PlayBtn from '$lib/components/PlayBtn.svelte';
  import {
    addFetchedSongsToQueue,
    clearQueue,
    currentSong,
    playSong,
    setCurrentlyPlaying,
    togglePlay
  } from '$lib/components/store/currentPlaying';

  function startTrackPlayback() {
    clearQueue();
    const trackToQueue = {
      name: track.name,
      id: track.id,
      artist: { name: track.artists[0].name, id: track.artists[0].id },
      img: track.album.images[0].url,
      link: trackLink.link,
      album: {
        name: track.album.name,
        totalTracks: track.album.total_tracks,
        id: track.album.id
      },
      trackNumber: track.track_number,
      preview_url: track.preview_url || '',
      needsFetch: false,
      duration_ms: track.duration_ms
    };
    setCurrentlyPlaying({
      name: track.name,
      id: track.id,
      type: 'SINGLE'
    });
    addFetchedSongsToQueue([trackToQueue], 0);
    playSong();
  }

  function getTrackDuration(item: TrackObjectFull) {
    let duration = 0;
    duration = item.duration_ms;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration / 1000) % 60);
    return {
      minutes: minutes !== 0 ? `${minutes} min` : '',
      seconds: seconds !== 0 ? `${seconds} sec` : ''
    };
  }

  export let data;
  $: track = data.track;
  $: color = data.color;
  $: pageTitle = $currentSong.trackLink
    ? $currentSong.trackLink.name
    : `${track.name} - Track by ${track.artists[0].name}`;
  $: hasLiked = data.hasliked;
  $: recommendations = data.recommendedTracks;
  $: trackLink = { ...data.trackLink, album: { id: track.album.id, name: track.album.name } };
  $: lyrics = data.lyrics;
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="container">
  <div
    class="color-gradient"
    style:background-image="linear-gradient(0deg,transparent,{color || 'var(--light-gray)'})"
  />
  <img src={track.album.images.length > 0 ? track.album.images[0].url : ''} alt="" />
  <div class="details">
    <span>{track.type[0].toUpperCase() + track.type.slice(1)}</span>
    <h1 title={track.name}>{@html track.name}</h1>
    <div class="albumInfo">
      <!-- <img src={track.artists[0].} alt=""> -->
      <a href={'/artist/' + track.artists[0].id}>{track.artists[0].name}</a>
      <span>&middot; {new Date(track.album.release_date).getFullYear()} &middot;</span>
      <span class="duration"
        >{getTrackDuration(track).minutes}
        {getTrackDuration(track).seconds}</span
      >
    </div>
  </div>
</div>
<div class="content">
  <div class="play">
    {#if !$currentSong.trackLink || !$currentSong.currentlyPlaying || $currentSong.currentlyPlaying.id !== track.id}
      <PlayBtn onclick={() => startTrackPlayback()} type="play" innerSize={25} />
    {:else if $currentSong.currentlyPlaying.type === 'SINGLE' && $currentSong.isPaused}
      <PlayBtn onclick={() => togglePlay()} type="play" innerSize={25} />
    {:else}
      <PlayBtn onclick={() => togglePlay()} type="pause" innerSize={25} />
    {/if}
    <button class="heart"><Heart width="36px" height="36px" /></button>
    <button class="heart"><ThreeHorizontalDots /></button>
  </div>
  <TrackDetails noRowHeader {hasLiked} tracks={[track]} trackLinks={[trackLink]} single />
  <p>
    Release Date : {new Date(track.album.release_date).toLocaleDateString('en', {
      dateStyle: 'long'
    })}
  </p>
  {#if lyrics.data}
    <h2>Music Video</h2>
    <iframe
      src={`https://www.youtube.com/embed/${lyrics.data.videoId}`}
      frameborder="0"
      title={track.name}
    />
    <h2>Lyrics</h2>
    <p class="lyrics">{@html lyrics.data.lyrics.join('<br>')}</p>
  {:else}
    <p class="lyrics">Lyrics Unavailable</p>
  {/if}
  <h2>Recommendations Based On {track.name}</h2>
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
  }
  .content > p {
    font-size: 1rem;
    margin: 20px 0 40px 0;
  }
  .content > .lyrics {
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
  iframe {
    width: 100%;
    max-width: 800px;
    height: auto;
    aspect-ratio: 16/9;
    margin: 16px 0;
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
