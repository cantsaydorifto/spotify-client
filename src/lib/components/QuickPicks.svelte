<script lang="ts">
  import Frame from './Frame.svelte';
  import IndividualTrackRow from './IndividualTrackRow.svelte';
  import TrackLoadingRow from './TrackLoadingRow.svelte';

  function fisherYatesShuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async function getQuickPicks() {
    const billboardTracks = await fetch('/api/billboard');
    console.log('GETTING QUICK PICKS!!!');
    const billboardTracksJson = billboardTracks.ok
      ? ((await billboardTracks.json()) as SinglePlaylistResponse)
      : null;
    return {
      quickPicks: billboardTracksJson
        ? fisherYatesShuffle(billboardTracksJson.tracks.items.map((el) => el.track!)).slice(0, 20)
        : [],
      billboard: billboardTracksJson ? billboardTracksJson.tracks.items.map((el) => el.track!) : []
    };
  }
</script>

<section class="quick-picks">
  <div class="info">
    <h2 class="heading">Quick Picks</h2>
  </div>
  <div class="grid-container">
    <Frame>
      {#await getQuickPicks()}
        {#each Array(5)}
          <div class="trackContainer">
            {#each Array(4)}
              <TrackLoadingRow />
            {/each}
          </div>
        {/each}
      {:then { billboard, quickPicks }}
        {#each Array(5) as _, rowIndex}
          <div class="trackContainer">
            {#each quickPicks.slice(rowIndex * 4, rowIndex * 4 + 4) as track (track.id)}
              <IndividualTrackRow
                radioPicks={fisherYatesShuffle(billboard).slice(0, 50)}
                hasLiked={false}
                {track}
              />
            {/each}
          </div>
        {/each}
      {:catch}
        <span>ERROR OCCURED!!!!</span>
      {/await}
    </Frame>
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
