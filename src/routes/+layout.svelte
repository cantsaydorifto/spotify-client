<script lang="ts">
  import '../app.css';
  import '../globals.css';
  import '../tippy-styles.css';
  import 'tippy.js/animations/shift-away.css';
  import '@fontsource/metropolis';
  import '@fontsource/metropolis/300.css';
  import '@fontsource/metropolis/400.css';
  import '@fontsource/metropolis/500.css';
  import '@fontsource/metropolis/600.css';
  import '@fontsource/metropolis/700.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import FooterPlayer from '$lib/components/FooterPlayer.svelte';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import Progress from '$lib/components/Progress.svelte';

  let loading = $state(false);

  beforeNavigate(() => {
    loading = true;
  });

  afterNavigate(() => {
    loading = false;
  });
  //   import { currentSong } from '$lib/store/currentPlaying';
  //   $: curTrack = $currentSong.trackLink ? $currentSong.trackLink.name : '';

  let { children } = $props();
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- <title>{curTrack}</title> -->
</svelte:head>

<Progress {loading} />
<div class="main">
  <div class="sidebar">
    <Sidebar desktop={true} />
  </div>
  <div class="content">
    <Navbar />
    <main class="main-content">
      {@render children()}
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
