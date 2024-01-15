<script>
  import './globals.css';
  import './tippy-styles.css';
  import '@fontsource/metropolis';
  import '@fontsource/metropolis/300.css';
  import '@fontsource/metropolis/400.css';
  import '@fontsource/metropolis/500.css';
  import '@fontsource/metropolis/600.css';
  import '@fontsource/metropolis/700.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import FooterPlayer from '$lib/components/FooterPlayer.svelte';
  import NProgress from 'nprogress';
  import './nprogress.css';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { currentSong } from '$lib/components/store/currentPlaying';

  NProgress.configure({ showSpinner: false });

  afterNavigate(() => {
    NProgress.done();
  });
  beforeNavigate(() => {
    NProgress.start();
  });

  $: curTrack = $currentSong.trackLink ? $currentSong.trackLink.name : '';
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{curTrack}</title>
</svelte:head>

<div class="main">
  <div class="sidebar">
    <Sidebar desktop={true} />
  </div>
  <div class="content">
    <Navbar />
    <main class="main-content">
      <slot />
    </main>
  </div>
  <FooterPlayer />
</div>

<style>
  .main {
    display: flex;
  }
  .sidebar {
    position: relative;
  }
  .content {
    flex: 1;
  }
  .main-content {
    padding: var(--navbar-height) 15px 60px 15px;
  }
  @media (min-width: 1000px) {
    .sidebar {
      width: var(--sidebar-width);
    }
  }
  @media (min-width: 800px) {
    .main-content {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
</style>
