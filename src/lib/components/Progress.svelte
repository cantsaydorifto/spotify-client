<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  export let loading = false;

  let visible = false;
  let width = 0;
  let interval: ReturnType<typeof setInterval>;
  const start = () => {
    width = 0;
    visible = true;
    interval = setInterval(() => {
      if (width < 90) {
        width += (100 - width) * 0.05;
      }
    }, 100);
  };

  const stop = () => {
    width = 100;
    setTimeout(() => {
      visible = false;
      setTimeout(() => {
        width = 0;
      }, 300);
    }, 300);
    clearInterval(interval);
  };

  $: if (loading) {
    start();
  } else {
    stop();
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="progress-container" style="opacity: {visible ? 1 : 0}">
  <div class="progress-bar" style="width: {width}%"></div>
</div>

<style>
  .progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: transparent;
    z-index: 9999;
    transition: opacity 0.3s ease;
  }

  .progress-bar {
    height: 100%;
    background-color: #29d;
    transition: width 0.2s ease;
  }
</style>
