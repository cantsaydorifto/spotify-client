<script lang="ts">
  import { error } from '@sveltejs/kit';
  import Clock3 from './icons/Clock3.svelte';
  import Play from './icons/Play.svelte';
  import { currentSong } from './store/currentPlaying';
  export let tracks: TrackObjectSimplified[] | TrackObjectFull[];
  export let trackLinks:
    | {
        name: string;
        album: string;
        img: string;
        link: string;
      }[]
    | null;
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
  <div class="tracks-container">
    {#each tracks as track, idx}
      <div class="row">
        <div class="number-column">
          <span class="number">{idx + 1}</span>
        </div>
        <div class="info-column">
          <div class="track-title">
            <h4>{track.name}</h4>
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
        <div class="duration-column">
          <button
            on:click={async () => {
              if (!trackLinks) {
                console.log(track.album.name + ' ' + track.album.artists[0].name);
                const songRes = await fetch(
                  `/api/song/${track.track_number}?query=${encodeURIComponent(
                    `${track.album.name} ${track.album.artists[0].name}`
                  )}&count=${track.album.total_tracks}`
                );
                let [songLink, songName] = ['', ''];
                if (!songRes.ok) {
                  console.log('not ok');
                  songLink = track.preview_url || '';
                  songName = track.name || '';
                  console.log(songLink);
                } else {
                  const song = await songRes.json();
                  songLink = song.song.downloadUrl[song.song.downloadUrl.length - 1].link;
                  songName = song.song.name;
                }
                console.log({
                  name: songName,
                  link: songLink,
                  artist: track.album.artists[0].name,
                  img: track.album.images[0].url
                });
                $currentSong.trackLink = {
                  name: songName,
                  link: songLink,
                  artist: track.album.artists[0].name,
                  img: track.album.images[0].url
                };
                // const res = await fetch('/api/song/' + track.id);
                return;
              }
              $currentSong.trackLink = {
                name: track.name,
                link: trackLinks[idx].link,
                artist: track.artists[0].name,
                img: trackLinks[idx].img
              };
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
    gap: 10px;
  }

  .track-title {
    font-size: 0.875rem;
  }

  .row:not(.header):hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .number-column {
    width: 30px;
    display: flex;
    justify-content: flex-end;
    margin-right: 42px;
  }

  .number {
    color: var(--light-gray);
    font-size: 0.875rem;
  }

  .info-column {
    flex: 1;
    display: flex;
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
</style>
