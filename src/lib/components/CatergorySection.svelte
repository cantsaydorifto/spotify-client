<script lang="ts">
  import MusicIcon from '$lib/components/icons/Music.svelte';
  import Frame from './Frame.svelte';
  import PlayBtn from './PlayBtn.svelte';
  import { currentSong } from './store/currentPlaying';

  export let section: {
    title: string;
    path: string;
    items: (AlbumObjectSimplified | PlaylistObjectSimplified)[];
  } = {
    title: '',
    path: '',
    items: []
  };

  export let artistSearchResults: { title: string; items: ArtistObjectFull[] } = {
    items: [],
    title: 'Artists'
  };
  export let trackSearchResults: TrackObjectFull[] = [];

  export let saavnHomepageData: {
    playlists: SaavnHomepagePlaylistData[];
    charts: SaavnHomepagePlaylistData[];
    albums: SaavnHomepageALbumData[];
  } | null = null;

  async function playSong(track: TrackObjectFull) {
    // console.log(track.album.name + ' ' + track.album.artists[0].name);
    const songRes = await fetch(
      `/api/song/${track.track_number}?query=${encodeURIComponent(
        `${track.album.name} ${track.album.artists[0].name}`
      )}&count=${track.album.total_tracks}`
    );
    let [songLink, songName] = ['', ''];
    if (!songRes.ok) {
      // console.log('not ok');
      songLink = track.preview_url || '';
      songName = track.name || '';
      console.log(songLink);
    } else {
      const song = await songRes.json();
      songLink = song.song.downloadUrl[song.song.downloadUrl.length - 1].link;
      songName = song.song.name;
    }
    // console.log({
    //   name: songName,
    //   link: songLink,
    //   artist: track.album.artists[0].name,
    //   img: track.album.images[0].url
    // });
    $currentSong.trackLink = {
      id: track.id,
      album: { name: track.album.name, totalTracks: track.album.total_tracks },
      trackNumber: track.track_number,
      preview_url: track.preview_url || '',
      name: songName,
      link: songLink,
      artist: {
        id: track.album.artists[0].id,
        name: track.album.artists[0].name
      },
      img: track.album.images[0].url
    };
  }
</script>

{#if section.items.length !== 0}
  <section>
    <div class="info">
      <h2>{section.title}</h2>
    </div>
    <div class="grid-container">
      <Frame>
        {#each section.items as playlist}
          {#if playlist}
            <a href={`${section.path}/${playlist.id}`} class="playlistContainer">
              <div class="playlist">
                {#if playlist.images.length > 1}
                  <div class="playlistImg">
                    <img src={playlist.images[1].url} alt="" />
                  </div>
                {:else if playlist.images.length > 0}
                  <div class="playlistImg">
                    <img src={playlist.images[playlist.images.length - 1].url} alt="" />
                  </div>
                {:else}
                  <div class="no-image-container">
                    <MusicIcon width="100" height="100" />
                  </div>
                {/if}
                <div class="playlistInfo">
                  <p title={playlist.name}>{playlist.name}</p>
                  {#if playlist.type === 'album' && playlist.artists}
                    <span title={playlist.artists.map((el) => el.name).join(', ')}
                      >{playlist.artists.map((el) => el.name).join(', ')}</span
                    >
                  {:else if playlist.type === 'playlist' && playlist.description}
                    <span title={playlist.description}>{playlist.description}</span>
                  {/if}
                  <!-- <p>{playlist.}</p> -->
                </div>
              </div>
            </a>
          {/if}
        {/each}
      </Frame>
    </div>
  </section>
{/if}
{#if artistSearchResults.items.length !== 0}
  <section>
    <div class="info">
      <h2>{artistSearchResults.title}</h2>
    </div>
    <div class="grid-container">
      <Frame>
        {#each artistSearchResults.items as artist}
          <a href={`/artist/${artist.uri.slice(15)}`} class="playlistContainer">
            <div class="playlist">
              {#if artist.images.length > 1}
                <div class="playlistImg artistImg">
                  <img src={artist.images[1].url} alt="" />
                </div>
              {:else if artist.images.length > 0}
                <div class="playlistImg artistImg">
                  <img src={artist.images[artist.images.length - 1].url} alt="" />
                </div>
              {:else}
                <div class="no-image-container">
                  <MusicIcon width="100" height="100" />
                </div>
              {/if}
              <div class="playlistInfo">
                <p title={artist.name}>{artist.name}</p>
              </div>
            </div>
          </a>
        {/each}
      </Frame>
    </div>
  </section>
{/if}
{#if trackSearchResults.length !== 0}
  <section>
    <div class="info">
      <h2>Tracks</h2>
    </div>
    <div class="grid-container">
      <Frame>
        {#each trackSearchResults as track}
          <div class="playlistContainer">
            <div class="playlist">
              {#if track.album.images.length > 1}
                <div class="playlistImgContainer track">
                  <a href={`/album/${track.album.uri.slice(14)}`}>
                    <img src={track.album.images[1].url} alt="" />
                  </a>
                  <PlayBtn innerSize={25} outerSize={40} onclick={() => playSong(track)} />
                </div>
              {:else if track.album.images.length > 0}
                <div class="playlistImg artistImg">
                  <img src={track.album.images[track.album.images.length - 1].url} alt="" />
                </div>
              {:else}
                <div class="no-image-container track">
                  <a href={`/album/${track.album.uri.slice(14)}`}>
                    <MusicIcon width="100" height="100" color="white" />
                  </a>
                  <PlayBtn innerSize={25} outerSize={40} />
                </div>
              {/if}
              <div class="playlistInfo">
                <a href={`/album/${track.album.uri.slice(14)}`} title={track.name}>{track.name}</a>
                <a href={`/artist/${track.artists[0].id}`} title={track.artists[0].name}
                  >{track.artists[0].name}</a
                >
              </div>
            </div>
          </div>
        {/each}
      </Frame>
    </div>
  </section>
{/if}
{#if !!saavnHomepageData}
  {#if saavnHomepageData.albums.length > 0}
    <section>
      <div class="info">
        <h2>New Releases</h2>
      </div>
      <div class="grid-container">
        <Frame>
          {#each saavnHomepageData.albums as album}
            <a
              href={album.type === 'album' ? `/svn/album/${album.id}` : `/svn/song/${album.id}`}
              class="playlistContainer"
            >
              <div class="playlist">
                {#if album.image.length > 1}
                  <div class="playlistImg">
                    <img src={album.image[1].link} alt={album.name} />
                  </div>
                {:else if album.image.length > 0}
                  <div class="playlistImg">
                    <img src={album.image[album.image.length - 1].link} alt="" />
                  </div>
                {:else}
                  <div class="no-image-container">
                    <MusicIcon width="100" height="100" />
                  </div>
                {/if}
                <div class="playlistInfo">
                  <p title={album.name}>{album.name}</p>
                  <span
                    title={album.primaryArtists.length > 0
                      ? album.primaryArtists[0].name
                      : album.artists.length > 0
                      ? album.artists[0].name
                      : ''}
                    >{album.primaryArtists.length > 0
                      ? album.primaryArtists[0].name
                      : album.artists.length > 0
                      ? album.artists[0].name
                      : ''}</span
                  >
                </div>
              </div>
            </a>
          {/each}
        </Frame>
      </div>
    </section>
  {/if}
  {#if saavnHomepageData.playlists.length > 0}
    <section>
      <div class="info">
        <h2>Playlists</h2>
      </div>
      <div class="grid-container">
        <Frame>
          {#each saavnHomepageData.playlists as playlist}
            <a href={`/svn/playlist/${playlist.id}`} class="playlistContainer">
              <div class="playlist">
                {#if playlist.image.length > 1}
                  <div class="playlistImg">
                    <img src={playlist.image[1].link} alt={playlist.title} />
                  </div>
                {:else if playlist.image.length > 0}
                  <div class="playlistImg">
                    <img src={playlist.image[playlist.image.length - 1].link} alt="" />
                  </div>
                {:else}
                  <div class="no-image-container">
                    <MusicIcon width="100" height="100" />
                  </div>
                {/if}
                <div class="playlistInfo">
                  <p title={playlist.title}>{playlist.title}</p>
                </div>
              </div>
            </a>
          {/each}
        </Frame>
      </div>
    </section>
  {/if}
  {#if saavnHomepageData.charts.length > 0}
    <section>
      <div class="info">
        <h2>Charts</h2>
      </div>
      <div class="grid-container">
        <Frame>
          {#each saavnHomepageData.charts as playlist}
            <a href={`/svn/playlist/${playlist.id}`} class="playlistContainer">
              <div class="playlist">
                {#if playlist.image.length > 1}
                  <div class="playlistImg">
                    <img src={playlist.image[1].link} alt={playlist.title} />
                  </div>
                {:else if playlist.image.length > 0}
                  <div class="playlistImg">
                    <img src={playlist.image[playlist.image.length - 1].link} alt="" />
                  </div>
                {:else}
                  <div class="no-image-container">
                    <MusicIcon width="100" height="100" />
                  </div>
                {/if}
                <div class="playlistInfo">
                  <p title={playlist.title}>{playlist.title}</p>
                </div>
              </div>
            </a>
          {/each}
        </Frame>
      </div>
    </section>
  {/if}
{/if}

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
  }
  section {
    display: flex;
    flex-direction: column;
    position: relative;
    /* gap: 8px; */
    width: calc(100vw - var(--sidebar-width) - 70px);
    overflow: hidden;
    margin: 30px 0;
  }
  .grid-container {
    display: flex;
    padding: 0 16px;
  }
  .playlistContainer {
    padding: 16px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-color);
    background-color: #181818;
    transition: background-color 0.3s ease;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    width: 180px;
    height: 250px;
  }
  .playlistContainer:hover {
    background-color: #282828;
  }
  .playlist {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    height: 100%;
  }
  .track {
    position: relative;
  }
  .track > :global(button) {
    position: absolute;
    bottom: 10px;
    right: 10px;
    opacity: 0;
    transform: translateY(10px);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.4);
  }
  .playlistContainer:hover > .playlist > .track > :global(button) {
    opacity: 1;
    transform: translateY(0);
  }
  .playlistInfo {
    width: 100%;
  }
  .playlistImg > img,
  .playlistImgContainer > a > img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 8px;
  }
  .artistImg > img {
    border-radius: 50%;
  }
  .playlistInfo > p {
    font-weight: 600;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .playlistInfo > a:nth-child(1) {
    line-height: 1.7;
    color: var(--text-color);
    text-decoration: none;
    display: inline-block;
    font-weight: 500;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .playlistInfo > a:nth-child(2) {
    color: var(--light-gray);
    display: inline-block;
    text-decoration: none;
    font-weight: 300;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .playlistInfo > a:nth-child(2):hover {
    text-decoration: underline;
  }
  .playlistInfo > span {
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .no-image-container {
    width: 100%;
    height: 100%;
    background-color: #181818;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    .track > :global(button) {
      transform: translateY(0);
      opacity: 1;
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
