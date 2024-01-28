<script lang="ts">
  import Frame from './Frame.svelte';
  export let error: string | null = null;
</script>

<section>
  <div class="info">
    {#if error}
      <h2>{error}</h2>
    {:else}
      <h2>Loading ...</h2>
    {/if}
  </div>
  <div class="grid-container">
    <Frame>
      {#each Array(10) as _}
        <div class="playlistContainer" />
      {/each}
    </Frame>
  </div>
</section>

<style>
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding: 0 16px; */
  }
  .info > h2 {
    font-size: 1.5rem;
    padding-left: 20px;
    color: var(--light-gray);
  }
  section {
    display: flex;
    flex-direction: column;
    position: relative;
    width: calc(100vw - var(--sidebar-width) - 70px);
    overflow: hidden;
    margin: 30px 0;
  }
  .grid-container {
    display: flex;
    padding: 0 16px;
  }
  .playlistContainer {
    border-radius: 8px;
    background-color: #181818;
    transition: background-color 0.3s ease;
    width: 180px;
    height: 250px;
  }
  .playlistContainer:hover {
    background-color: #282828;
  }
  @media only screen and (max-width: 1000px) {
    section {
      width: calc(100vw - 66px);
    }
  }
  @media only screen and (max-width: 800px) {
    section {
      width: calc(100vw - 36px);
    }
  }
  @media only screen and (max-width: 600px) {
    .info > h2 {
      padding-left: 0;
    }
    .grid-container {
      padding: 0;
    }
  }
</style>
