<script lang="ts">
  import Frame from './Frame.svelte';
  import IndividualTrackRow from './IndividualTrackRow.svelte';
  import TrackLoadingRow from './TrackLoadingRow.svelte';
  async function getQuickPicks() {
    let recommendedObject: RecommendationsObject = { seeds: [], tracks: [] };
    const likeRes = await fetch(`/api/spotify/me/tracks?limit=5`);
    if (!likeRes.ok) {
      return recommendedObject;
    }
    const likes = (await likeRes.json()) as UsersSavedTracksResponse;
    const recommendedObjectRes = await fetch(
      `/api/spotify/recommendations?seed_tracks=${likes.items
        .slice(0, 5)
        .map((el) => el.track.id)
        .join(',')}`
    );
    if (recommendedObjectRes.ok) {
      recommendedObject = (await recommendedObjectRes.json()) as RecommendationsObject;
    }
    // console.log(recommendedObject.tracks.length);
    return recommendedObject;
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
    {:then value}
      <Frame>
        <div class="trackContainer">
          {#each value.tracks.slice(0, 4) as track}
            <IndividualTrackRow hasLiked={false} {track} />
          {/each}
        </div>
        <div class="trackContainer">
          {#each value.tracks.slice(4, 8) as track}
            <IndividualTrackRow hasLiked={false} {track} />
          {/each}
        </div>
        <div class="trackContainer">
          {#each value.tracks.slice(8, 12) as track}
            <IndividualTrackRow hasLiked={false} {track} />
          {/each}
        </div>
        <div class="trackContainer">
          {#each value.tracks.slice(12, 16) as track}
            <IndividualTrackRow hasLiked={false} {track} />
          {/each}
        </div>
        <div class="trackContainer">
          {#each value.tracks.slice(16, 20) as track}
            <IndividualTrackRow hasLiked={false} {track} />
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
