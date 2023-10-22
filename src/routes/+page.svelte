<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  import Button from '$lib/components/Button.svelte';
  import MusicIcon from '$lib/components/icons/Music.svelte';
  export let data;
  const sections: {
    title: string;
    path: string;
    items: (AlbumObjectSimplified | PlaylistObjectSimplified)[];
  }[] = [];
  $: {
    if (data.newReleases) {
      sections.push({
        title: 'New Releases',
        path: '/new-releases',
        items: data.newReleases.albums.items
      });
    }
    if (data.featuredPlaylists) {
      sections.push({
        title: 'Featured Playlists',
        path: '/featured-playlists',
        items: data.featuredPlaylists.playlists.items
      });
    }
    if (data.userCreatedPlaylists) {
      sections.push({
        title: 'Created Playlists',
        path: '/playlists',
        items: data.userCreatedPlaylists.items
      });
    }
    data.randomCategories.forEach((el) => {
      sections.push({
        title: el.name,
        path: `/category/${el.name}`,
        items: el.playlists.items
      });
    });
  }
  // console.log(data.randomCategories);
</script>

<h1>Welcome to SvelteKit</h1>
<h4>{data.user ? data.user.display_name : 'Not signed in'}</h4>
<LogoutButton />
<Button element="a" style="solid" href="/api/auth/login">Login</Button>
{#each sections as section}
  <section>
    <div class="info">
      <h2>{section.title}</h2>
      <Button element="a" style="outline" href="/">Show all</Button>
    </div>
    <div class="grid-container">
      {#each section.items as playlist}
        <div class="playlistContainer">
          <div class="playlist">
            {#if playlist.images.length > 0}
              <div class="playlistImg">
                <img src={playlist.images[0].url} alt="" />
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
        </div>
      {/each}
    </div>
  </section>
{/each}

<style>
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;
  }
  .grid-container {
    display: flex;
    gap: 30px;
  }
  .playlistContainer {
    padding: 16px;
    border-radius: 8px;
    background-color: #181818;
    transition: background-color 0.3s ease;
    cursor: pointer;
    width: 200px;
    height: 270px;
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
  .playlistInfo {
    width: 100%;
  }
  .playlistImg > img {
    width: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  .playlistInfo > p {
    font-weight: 700;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
</style>
