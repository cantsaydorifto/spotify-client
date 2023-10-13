<script>
  import './globals.css';
  import '@fontsource/metropolis';
  import '@fontsource/metropolis/300.css';
  import '@fontsource/metropolis/400.css';
  import '@fontsource/metropolis/500.css';
  import '@fontsource/metropolis/600.css';
  import '@fontsource/metropolis/700.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

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
</div>

<style>
  .main {
    display: flex;
  }
  .content {
    flex: 1;
  }
  .main-content {
    padding: var(--navbar-height) 15px 60px 15px;
  }
  @media (min-width: 768px) {
    .main-content {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
</style>
