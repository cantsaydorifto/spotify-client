<script lang="ts">
  import Frame from './Frame.svelte';
  import IndividualTrackRowSvn from './IndividualTrackRowSvn.svelte';
  import TrackLoadingRow from './TrackLoadingRow.svelte';

  export let tracks: string[] = [];

  async function getQuickPicks() {
    const res = await fetch('/api/saavn/songs?id=' + tracks.join());
    if (!res.ok) throw { status: res.status, message: 'Song not found' };
    const resJson = (await res.json()) as SaavnApiSongResponse;
    console.log(resJson.data);
    return resJson.data;
  }
</script>

<section class="quick-picks">
  <div class="info">
    <h2 class="heading">Quick Picks</h2>
  </div>
  <div class="grid-container">
    {#await getQuickPicks()}
      <Frame>
        <div class="trackContainer">
          <TrackLoadingRow />
          <TrackLoadingRow />
          <TrackLoadingRow />
          <TrackLoadingRow />
        </div>
        <div class="trackContainer">
          <TrackLoadingRow />
          <TrackLoadingRow />
          <TrackLoadingRow />
          <TrackLoadingRow />
        </div>
        <div class="trackContainer">
          <TrackLoadingRow />
          <TrackLoadingRow />
          <TrackLoadingRow />
          <TrackLoadingRow />
        </div>
        <div class="trackContainer">
          <TrackLoadingRow />
          <TrackLoadingRow />
          <TrackLoadingRow />
          <TrackLoadingRow />
        </div>
      </Frame>
    {:then tracks}
      <Frame>
        <div class="trackContainer">
          {#each tracks.slice(0, 4) as track}
            <IndividualTrackRowSvn {track} />
          {/each}
        </div>
        <div class="trackContainer">
          {#each tracks.slice(4, 8) as track}
            <IndividualTrackRowSvn {track} />
          {/each}
        </div>
        <div class="trackContainer">
          {#each tracks.slice(8, 12) as track}
            <IndividualTrackRowSvn {track} />
          {/each}
        </div>
        <div class="trackContainer">
          {#each tracks.slice(12, 16) as track}
            <IndividualTrackRowSvn {track} />
          {/each}
        </div>
        <div class="trackContainer">
          {#each tracks.slice(16, 20) as track}
            <IndividualTrackRowSvn {track} />
          {/each}
        </div>
      </Frame>
    {:catch error}
      <!-- promise was rejected -->
      <p>Something went wrong: {error.message}</p>
    {/await}
  </div>
</section>

<style>
  .info > h2 {
    color: var(--light-gray);
  }
  .trackContainer {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .quick-picks {
    display: flex;
    flex-direction: column;
    position: relative;
    /* gap: 8px; */
    width: calc(100vw - var(--sidebar-width) - 70px);
    overflow: hidden;
    margin: 30px 0;
  }
  .grid-container,
  .heading {
    display: flex;
    padding: 0 16px;
  }
  @media only screen and (max-width: 1000px) {
    .quick-picks {
      width: calc(100vw - 66px);
    }
  }
  @media only screen and (max-width: 800px) {
    .quick-picks {
      width: calc(100vw - 36px);
    }
  }
  @media only screen and (max-width: 600px) {
    .heading {
      padding-left: 0;
    }
    .grid-container {
      padding: 0;
    }
  }
</style>
