<script lang="ts">
  import Clock3 from './icons/Clock3.svelte';
  import Play from './icons/Play.svelte';
  import {
    addFetchedSongsToQueue,
    clearQueue,
    currentSong,
    playSong
  } from './store/currentPlaying';
  export let tracks:
    | (TrackObjectSimplified & { album?: AlbumObjectSimplified; link?: string })[]
    | (TrackObjectFull & { link?: string })[];
  tracks = tracks.filter((track) => !!track);
  export let trackLinks:
    | {
        name: string;
        album: string;
        img: string;
        link: string;
      }[]
    | null;

  if (trackLinks) {
    let t = trackLinks; // typescript error
    tracks.forEach((track, idx) => {
      track.link = t[idx].link;
    });
  }

  export let noRowHeader = false;
  function msToTime(duration: number) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const paddedMinutes = minutes === 0 ? '0' : minutes;
    const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours > 0 ? `${hours}:` : ''}${paddedMinutes}:${paddedSeconds}`;
  }
</script>

<div class="tracks">
  {#if !noRowHeader}
    <div class="row header">
      <div class="number-column">
        <span class="number">#</span>
      </div>
      <div class="info-column">
        <span class="track-title">Title</span>
      </div>
      <div class="duration-column">
        <Clock3 />
      </div>
      <div class="actions-column" />
    </div>
  {/if}
  <div class="tracks-container">
    {#each tracks as track, idx}
      <div
        class="row"
        class:playing={$currentSong.trackLink ? $currentSong.trackLink.id === track.id : false}
      >
        <div class="number-column">
          <span class="number">{idx + 1}</span>
        </div>
        <div class="trackInfoContainer">
          {#if track.album && track.album.images.length > 0}
            <img src={track.album.images[track.album.images.length - 1].url} alt="" />
          {/if}
          <div class="info-column">
            <div class="track-title">
              <h4 title={track.name}>{track.name}</h4>
              {#if track.explicit}
                <span class="explicit">E</span>
              {/if}
            </div>
            <p class="artists">
              {#each track.artists as artist, artistIndex}
                <a href="/artist/{artist.id}">{artist.name}</a
                >{#if artistIndex < track.artists.length - 1}{', '}{/if}
              {/each}
            </p>
          </div>
        </div>
        <div class="duration-column">
          <button
            on:click={async () => {
              clearQueue();
              if (!trackLinks && track.album && !track.link) {
                const tracksToQueue = tracks
                  ? tracks.slice(idx).map((el) => ({
                      name: el.name,
                      id: el.id,
                      artist: { name: el.artists[0].name, id: el.artists[0].id },
                      img: el.album ? el.album.images[0].url : '',
                      link: '',
                      album: {
                        name: el.album ? el.album.name : '',
                        totalTracks: el.album ? el.album.total_tracks : 0
                      },
                      trackNumber: el.track_number,
                      preview_url: el.preview_url || '',
                      needsFetch: true
                    }))
                  : null;
                addFetchedSongsToQueue(tracksToQueue);
                playSong();
                return;
              }
              const tracksToQueue = trackLinks
                ? tracks.slice(idx).map((trackLink) => ({
                    name: trackLink.name,
                    id: trackLink.id,
                    artist: { name: trackLink.artists[0].name, id: trackLink.artists[0].id },
                    img: trackLinks ? trackLinks[0].img : '',
                    link: trackLink.link || '',
                    album: {
                      name: track.album ? track.album.name : '',
                      totalTracks: track.album ? track.album.total_tracks : 0
                    },
                    trackNumber: track.track_number,
                    preview_url: track.preview_url || ''
                  }))
                : null;
              addFetchedSongsToQueue(tracksToQueue);
              playSong();
            }}><Play width="15px" height="15px" stroke="white" /></button
          >
          <span class="duration">{msToTime(track.duration_ms)}</span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    padding: 7px 5px;
    border-radius: 4px;
  }

  .header {
    border-bottom: 1px solid var(--border);
    border-radius: 0px;
    padding: 5px;
    margin-bottom: 20px;
  }

  .tracks-container {
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
    gap: 10px;
  }

  .track-title {
    font-size: 0.875rem;
  }

  .row:not(.header):hover,
  .playing {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .number-column {
    width: 30px;
    display: flex;
    justify-content: flex-end;
    margin-right: 25px;
  }

  .number {
    color: var(--light-gray);
    font-size: 0.875rem;
  }

  .trackInfoContainer {
    flex: 1;
    display: flex;
    gap: 20px;
  }

  .trackInfoContainer > img {
    width: 50px;
    height: 50px;
    border-radius: 2px;
  }

  .info-column {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 7px;
  }

  .info-column > span {
    color: var(--light-gray);
  }

  .track-title {
    display: flex;
    align-items: center;
  }

  .track-title h4 {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1;
    max-width: 300px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }

  .explicit {
    text-transform: uppercase;
    background-color: hsla(0, 0%, 100%, 0.6);
    font-size: 0.5rem;
    margin-left: 10px;
    border: 1px solid;
    padding: 2px 4px;
    border-radius: 2px;
    line-height: 0.625rem;
    color: var(--header-color);
  }

  .artists {
    color: var(--light-gray);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    max-width: 350px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }

  .artists a {
    color: inherit;
    text-decoration: none;
  }

  .artists a:hover {
    text-decoration: underline;
  }

  .duration {
    display: inline-block;
    color: var(--light-gray);
    /* background-color: red; */
    width: 30px;
    margin: 0 auto;
    font-size: 0.875rem;
  }
  .duration-column {
    padding-right: 30px;
    display: flex;
    align-items: center;
    gap: 30px;
  }
  .duration-column > button {
    border: none;
    background-color: #5d5d5d24;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;
  }
  @media only screen and (max-width: 600px) {
    .row {
      padding-left: 0;
    }
    .number-column {
      width: 15px;
      margin-right: 10px;
    }
    .duration {
      display: none;
    }
    .duration-column {
      padding-right: 0;
      padding-left: 5px;
    }
    .trackInfoContainer {
      gap: 10px;
    }
  }
  @media only screen and (max-width: 520px) {
    /* .track-title h4 {
      max-width: 200px;
    } */
  }
</style>
