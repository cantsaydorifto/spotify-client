<script lang="ts">
  import Home from './icons/Home.svelte';
  import Search from './icons/Search.svelte';
  import Playlist from './icons/Playlist.svelte';
  import SidebarMenu from './icons/SidebarMenu.svelte';
  import Cross from './icons/Cross.svelte';
  import logo from '../../assets/SpotifyLogo.png';
  import { page } from '$app/stores';
  import { tick, type ComponentType } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  export let desktop: boolean;
  $: isSidebarActive = false;
  let closeNavbarButton: HTMLButtonElement;
  let openNavbarButton: HTMLButtonElement;
  let navLastFocusElement: HTMLAnchorElement;

  beforeNavigate(() => {
    isSidebarActive = false;
  });

  const navItems: {
    path: string;
    name: string;
    svg: ComponentType;
  }[] = [
    {
      path: '/',
      name: 'Home',
      svg: Home
    },
    {
      path: '/search',
      name: 'Search',
      svg: Search
    },
    {
      path: '/playlists',
      name: 'Playlists',
      svg: Playlist
    }
  ];
</script>

<div class="sidebar-content" class:desktop class:mobile={!desktop}>
  {#if !desktop && isSidebarActive}
    <div
      class="overlay"
      on:click={() => {
        isSidebarActive = false;
      }}
    />
  {/if}
  <nav aria-label="Main">
    {#if !desktop}
      <button
        class="sidebar-toggle icon-btn"
        aria-expanded={isSidebarActive}
        bind:this={openNavbarButton}
        on:click={async () => {
          isSidebarActive = true;
          await tick(); // does not work for some reason ===> fix later
          setTimeout(() => {
            closeNavbarButton.focus();
          }, 300); // 300ms is the duration of the animation
        }}
      >
        <SidebarMenu color="var(--text-color)" />
        <span class="visually-hidden">Open Navbar Menu</span>
      </button>
    {/if}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="sidebar-inner-content"
      class:hide-sidebar={!isSidebarActive || desktop}
      style:visibility={!isSidebarActive && !desktop ? 'hidden' : 'visible'}
      on:keydown={(ev) => {
        if (desktop) return;
        if (ev.key === 'Escape') {
          isSidebarActive = false;
          openNavbarButton.focus();
        }
      }}
    >
      <div class="nav-header">
        <img src={logo} class="logo" alt="Spotify" />
        {#if !desktop}
          <button
            class="icon-btn"
            bind:this={closeNavbarButton}
            on:keydown={(ev) => {
              if (desktop) return;
              if (ev.key === 'Tab' && ev.shiftKey) {
                ev.preventDefault();
                navLastFocusElement.focus();
              }
            }}
            on:click={async () => {
              isSidebarActive = false;
              openNavbarButton.focus();
            }}
            ><Cross color="var(--text-color)" />
            <span class="visually-hidden">Close Navbar Menu</span>
          </button>
        {/if}
      </div>
      <ul>
        {#each navItems as navItem, idx}
          {#if navItems.length - 1 === idx}
            <li class:active={navItem.path === $page.url.pathname}>
              <a
                bind:this={navLastFocusElement}
                on:keydown={(ev) => {
                  if (desktop) return;
                  if (ev.key === 'Tab' && !ev.shiftKey) {
                    ev.preventDefault();
                    closeNavbarButton.focus();
                  }
                }}
                href={navItem.path}
              >
                <svelte:component
                  this={navItem.svg}
                  focusable="false"
                  aria-hidden="true"
                  color="var(--text-color)"
                  size={26}
                  width={26}
                  height={26}
                  stroke-width={2}
                />
                {navItem.name}</a
              >
            </li>
          {:else}
            <li class:active={navItem.path === $page.url.pathname}>
              <a href={navItem.path}>
                <svelte:component
                  this={navItem.svg}
                  focusable="false"
                  aria-hidden="true"
                  color="var(--text-color)"
                  size={26}
                  width={26}
                  height={26}
                  stroke-width={2}
                />
                {navItem.name}</a
              >
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  </nav>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--sidebar-color);
    animation: pop 0.2s ease-in-out forwards;
  }
  @keyframes pop {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.5;
    }
  }
  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    padding-left: 5px;
  }
  .logo {
    max-width: 100%;
    width: 130px;
  }
  .sidebar-inner-content {
    min-width: var(--sidebar-width);
    background-color: var(--sidebar-color);
    height: 100vh;
    overflow: auto;
    padding: 20px 10px;
    display: none;
  }
  ul {
    margin-top: 30px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 7px 7px 0 7px;
  }
  ul > li:active a {
    opacity: 1;
  }
  ul > li:hover a {
    opacity: 1;
  }
  ul > li a {
    display: flex;
    gap: 10px;
    align-items: center;
    text-decoration: none;
    color: var(--text-color);
    font-size: 0.875rem;
    opacity: 0.7;
    font-weight: 500;
    transition: opacity 0.4s;
  }
  .icon-btn {
    border: none;
    background: none;
    cursor: pointer;
    width: 25px;
    height: 25px;
  }
  @media only screen and (min-width: 756px) {
    .desktop .sidebar-inner-content {
      display: block;
    }
    .overlay {
      display: none;
    }
    .sidebar-toggle {
      display: none;
    }
  }
  .mobile .sidebar-inner-content {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    transition: all 0.3s;
  }
  .mobile .hide-sidebar {
    transform: translateX(-100%);
  }
  @media only screen and (max-width: 756px) {
    .mobile .sidebar-inner-content {
      display: block;
    }
  }
</style>
