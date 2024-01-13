<script lang="ts">
  import CatergorySection from '$lib/components/CatergorySection.svelte';
  import Search from '$lib/components/icons/Search.svelte';

  type DebounceFunction = (...p: any[]) => any;

  let artistSearchResults: SaavnSearchArtists[] = [];
  let trackSearchResults: SaavnSearchSong[] = [];
  let playlistSeachResults: SaavnSearchPlaylists[] = [];
  let albumSearchResults: SaavnSearchAlbum[] = [];

  let loading = false;

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
        playlistSeachResults = [];
        albumSearchResults = [];
        artistSearchResults = [];
        trackSearchResults = [];
        loading = false;
        return;
      }
      const res = await fetch(`/api/saavn/search/all?query=${encodeURIComponent(value)}}`);
      if (!res.ok) {
        loading = false;
        return;
      }
      const resJson = (await res.json()) as SaavnApiSearchAllResponse;
      playlistSeachResults = resJson.data.playlists.results;
      albumSearchResults = resJson.data.albums.results;
      artistSearchResults = resJson.data.artists.results;
      trackSearchResults = resJson.data.songs.results;
      console.log(resJson);
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
  {#if playlistSeachResults.length === 0 && albumSearchResults.length === 0}
    <h2 class="loading">No Results</h2>
  {:else}
    <CatergorySection
      saavnHomepageData={{
        searchResults: true,
        playlists: playlistSeachResults.map((el) => ({
          ...el,
          userId: el.id,
          subtitle: '',
          songCount: '',
          firstname: '',
          followerCount: '',
          lastUpdated: '',
          explicitContent: ''
        })),
        albums: albumSearchResults.map((el) => ({
          id: el.id,
          name: el.title,
          year: el.year,
          type: el.type,
          language: el.language,
          url: el.url,
          explicitContent: '0',
          playCount: 0,
          image: el.image,
          primaryArtists: [
            { id: '', name: el.artist, url: '', type: '', role: '', image: el.image }
          ],
          artists: [{ id: '', name: el.artist, url: '', type: '', role: '', image: el.image }]
        })),
        charts: [],
        trendingAlbums: [],
        artistSearchResults,
        trendingSongs: trackSearchResults.map((el) => ({
          ...el,
          name: el.title,
          year: '',
          releaseDate: '',
          duration: 0,
          label: '',
          primaryArtistsId: '',
          primaryArtists: el.primaryArtists,
          featuredArtists: el.singers,
          featuredArtistsId: '',
          explicitContent: 0,
          playCount: '',
          language: el.language,
          hasLyrics: '',
          url: el.url,
          downloadUrl: [
            {
              quality: '',
              link: ''
            }
          ],
          copyright: '',
          image: el.image,
          album: {
            id: el.id,
            name: el.album,
            url: el.url
          }
        }))
      }}
    />
  {/if}
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
