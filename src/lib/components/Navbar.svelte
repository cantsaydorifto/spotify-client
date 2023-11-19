<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import tippy from '$lib/actions/tippy';
  import LogoutButton from './LogoutButton.svelte';
  import PlayBtn from './PlayBtn.svelte';
  import Sidebar from './Sidebar.svelte';
  import DownArrow from './icons/DownArrow.svelte';
  import ExternalLink from './icons/ExternalLink.svelte';
  import UserProfileIcon from './icons/UserProfileIcon.svelte';

  let yScroll: number;
  let navbar: HTMLDivElement;
  let opacity = 0;
  $: color = $page.data.color;
  $: artist = $page.data.artist as SingleArtistResponse | undefined;
  $: album = $page.data.album as SingleAlbumResponse | undefined;
  $: playlist = $page.data.playlist as SinglePlaylistResponse | undefined;
  $: navbar &&
    (yScroll / (color ? 276 : navbar.offsetHeight) < 1
      ? (opacity = color ? 0 : yScroll / navbar.offsetHeight)
      : (opacity = 1));
  $: user = $page.data.user;
</script>

<svelte:window bind:scrollY={yScroll} />
<div bind:this={navbar} class="navbar">
  <div class="content">
    <div class="sidebarToggle">
      {#if browser}
        <Sidebar desktop={false} />
      {/if}
      <div class="playlistInfo" style:opacity={`${opacity}`}>
        {#if album}
          <PlayBtn innerSize={24} outerSize={45} />
          <span>{album.name}</span>
        {:else if playlist}
          <PlayBtn innerSize={24} outerSize={45} />
          <span>{playlist.name}</span>
        {:else if artist}
          <PlayBtn innerSize={24} outerSize={45} />
          <span>{artist.name}</span>
        {/if}
      </div>
    </div>
    <div class="profileInfo">
      <button
        class="profileBtn"
        use:tippy={{
          content: document.getElementById('profile-menu') || undefined,
          onMount: () => {
            const template = document.getElementById('profile-menu');
            if (template) {
              template.style.display = 'block';
            }
          },
          trigger: 'click',
          placement: 'bottom-end',
          interactive: true,
          theme: 'menu'
        }}
      >
        {#if user?.images && user.images.length > 0}
          <img src={user.images[0].url} alt={user.display_name} />
        {:else}
          <UserProfileIcon />
        {/if}
        <!-- {user?.display_name} -->
        <span class="visually-hidden">Profile Menu</span>
        <DownArrow />
      </button>
    </div>
  </div>
  <div id="profile-menu" style="display: none;">
    <div class="profile-menu-content">
      <ul>
        <li>
          <a href={user?.external_urls.spotify} target="_blank" rel="noopener noreferrer"
            >View on Spotify
            <ExternalLink />
          </a>
        </li>
        <li><a href="/profile">View Profile</a></li>
        <li><LogoutButton /></li>
      </ul>
    </div>
  </div>
  <div
    style:background-color={$page.data.color ? $page.data.color : 'var(--header-color)'}
    style:opacity={`${opacity}`}
    class="navbar-color"
  >
    <div class="navbar-color-overlay" />
  </div>
</div>

<style>
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 3px 16px;
  }
  .navbar {
    height: var(--navbar-height);
    width: calc(100% - var(--sidebar-width)); /* prevent overflow ===> 100% - 250px */
    position: fixed;
    display: flex;
    justify-content: space-between;
    z-index: 1;
  }
  .sidebarToggle {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .navbar-color {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .navbar-color-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  @media only screen and (max-width: 1000px) {
    .navbar {
      width: 100%;
    }
  }
  .profileBtn {
    border: 1px solid var(--border);
    border-radius: 20px;
    background: none;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px;
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.4s, border 0.4s;
    font-weight: 500;
  }
  .profileBtn:hover {
    background-color: var(--accent-color-darker);
    border: 1px solid var(--accent-color-darker);
  }
  .profileBtn > img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 5px;
  }
  .profile-menu-content {
    padding: 5px 0;
  }
  .profile-menu-content > ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .profile-menu-content > ul > li:hover {
    background-image: linear-gradient(rgba(255, 255, 255, 0.07) 0 0);
  }
  .profile-menu-content ul > li > a,
  .profile-menu-content :global(button) {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    padding: 10px 15px;
    background: none;
    font-weight: 300;
    border: none;
    text-decoration: none;
    cursor: pointer;
    color: var(--menu-text-color);
    width: 170px;
    text-align: left;
    line-height: 1;
    font-size: 0.875rem;
  }
  .playlistInfo {
    transition: opacity 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 4px;
  }
  .playlistInfo > span {
    font-size: 1.25rem;
    font-weight: 800;
    max-width: 1000px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }
</style>
