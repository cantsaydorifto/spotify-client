<script lang="ts">
  import CatergorySection from '$lib/components/CatergorySection.svelte';
  import Search from '$lib/components/icons/Search.svelte';

  type DebounceFunction = (...p: any[]) => any;

  let sections: {
    title: string;
    path: string;
    items: (AlbumObjectSimplified | PlaylistObjectSimplified)[];
  }[] = [];

  let loading = false;
  let artistSearchResults: ArtistObjectFull[] = [];
  let trackSearchResults: TrackObjectFull[] = [];

  function debounce(fn: DebounceFunction, t: number): DebounceFunction {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args);
      }, t);
    };
  }

  const handleInputChange = debounce(async (value) => {
    loading = true;
    try {
      if (value === '') {
        sections = [];
        artistSearchResults = [];
        trackSearchResults = [];
        loading = false;
        return;
      }
      // console.log(`/api/spotify/search?market=US&q=${encodeURIComponent(value)}`);
      const searhType = ['album', 'artist', 'playlist', 'track'];
      const res = await fetch(
        `/api/spotify/search?market=US&q=${encodeURIComponent(value)}&type=${searhType.join(',')}`
      );
      if (!res.ok) {
        loading = false;
        return;
      }
      const resJson = (await res.json()) as SearchResponse;
      sections = [
        {
          title: 'Albums',
          path: '/album',
          items: resJson.albums ? resJson.albums.items : []
        },
        {
          title: 'Playlists',
          path: '/playlist',
          items: resJson.playlists ? resJson.playlists.items : []
        }
      ];
      artistSearchResults = [...(resJson.artists ? resJson.artists.items : [])];
      trackSearchResults = [...(resJson.tracks ? resJson.tracks.items : [])];
      // console.log(sections);
      loading = false;
    } catch (err) {
      console.log(err);
    }
  }, 300);
</script>

<h1>Search</h1>
<div class="searchContainer">
  <Search width="20px" />
  <input type="text" on:input={(ev) => handleInputChange(ev.target.value)} />
</div>

{#if !loading}
  <CatergorySection
    artistSearchResults={{ title: 'Artists', items: artistSearchResults }}
    {trackSearchResults}
  />
  {#each sections as section}
    <CatergorySection {section} />
  {/each}
{:else}
  <h2 class="loading">Loading...</h2>
{/if}

<style>
  input {
    background-color: var(--medium-gray);
    height: 38px;
    width: 300px;
    border-radius: 50px;
    padding: 5px 14px 5px 35px;
    color: var(--text-color);
    /* outline: white; */
    border: none;
  }
  .searchContainer {
    position: relative;
    margin-bottom: 40px;
  }
  .searchContainer > :global(svg) {
    position: absolute;
    top: calc(50% - 10px);
    left: 8px;
  }
  .loading {
    color: var(--medium-gray);
  }
</style>
