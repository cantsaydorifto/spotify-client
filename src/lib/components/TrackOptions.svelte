<script lang="ts">
  import tippy from '$lib/actions/tippy';
  import AddToQueue from './icons/AddToQueue.svelte';
  import Album from './icons/Album.svelte';
  import Artist from './icons/Artist.svelte';
  import PlayNext from './icons/PlayNext.svelte';
  import Radio from './icons/Radio.svelte';
  import ThreeVerticalDots from './icons/ThreeVerticalDots.svelte';
  import { addToQueueEnd, playNext, startRadio } from '$lib/components/store/currentPlaying';
  let trackMenu: HTMLDivElement;
  export let track: TrackObjectFull & {
    link?: string | undefined;
  };
  const trackInfo = {
    album: { name: track.album.name, id: track.album.id },
    artist: { name: track.artists[0].name, id: track.artists[0].id },
    id: track.id,
    name: track.name
  };
  const trackConvertedToSong = {
    album: { ...track.album, totalTracks: track.album.total_tracks },
    artist: track.artists[0],
    id: track.id,
    name: track.name,
    trackNumber: track.track_number,
    duration_ms: track.duration_ms,
    img: track.album.images[0].url,
    link: track.link || '',
    preview_url: track.preview_url || '',
    needsFetch: track.link ? false : true
  };
</script>

<button
  class="options"
  use:tippy={{
    content: trackMenu,
    trigger: 'click',
    placement: 'bottom',
    theme: 'track-menu',
    interactive: true,
    onMount: () => {
      trackMenu.style.display = 'block';
    },
    onShown: (instance) => {
      trackMenu.addEventListener('click', (ev) => {
        instance.hide();
      });
    }
  }}
>
  <ThreeVerticalDots width="16" height="16" />
</button>

<div bind:this={trackMenu} id="track-menu" style="display: none;">
  <ul>
    <li>
      <button
        on:click={() => {
          startRadio(track);
        }}><Radio width="18" height="18" />Start Radio</button
      >
    </li>
    <li>
      <button
        on:click={() => {
          playNext(trackConvertedToSong);
        }}><PlayNext width="18" height="18" /> Play Next</button
      >
    </li>
    <li>
      <button
        on:click={() => {
          addToQueueEnd(trackConvertedToSong);
        }}><AddToQueue width="18" height="18" /> Add To Queue</button
      >
    </li>
    {#if trackInfo.album}
      <li>
        <a href={`/album/${trackInfo.album.id}`}><Album width="18" height="18" />Go to Album</a>
      </li>
    {/if}
    <li>
      <a href={`/artist/${trackInfo.artist.id}`}><Artist width="18" height="18" />Go to Artist</a>
    </li>
  </ul>
</div>

<style>
  .options {
    display: none;
    width: 18px;
    margin-left: 12px;
    border: none;
    background: none;
    cursor: pointer;
  }
  @media only screen and (max-width: 600px) {
    .options {
      display: block;
      margin-left: 0;
    }
  }
  #track-menu {
    background-color: var(--menu-background-color);
  }
  ul {
    padding: 5px 0;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  ul > li > button {
    border: none;
    background: none;
    width: 100%;
    cursor: pointer;
  }
  ul > li > a,
  ul > li > button {
    padding: 12px 12px;
    font-size: 0.9rem;
    display: flex;
    color: inherit;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }
  ul > li:hover {
    background-image: linear-gradient(rgba(255, 255, 255, 0.07) 0 0);
  }
</style>
