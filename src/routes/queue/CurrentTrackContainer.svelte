<script lang="ts">
  import { onMount } from 'svelte';
  import { getColor } from './helper';
  import Music from '$lib/components/icons/Music.svelte';
  import { setColor } from '$lib/components/store/currentPlaying';

  export let trackLink: Song;
  $: color = null as string | null;
  onMount(() => {
    if (trackLink.id === 'LOADING') return;
    getColor(trackLink.img).then((res) => {
      if (res) {
        color = res.dominantColor;
        setColor(color);
      }
    });
  });
</script>

<div class="container">
  {#if !trackLink || trackLink.id === 'LOADING'}
    <span>
      <Music width="60" height="60" />
    </span>
  {:else}
    {#if color}
      <div
        class="color-gradient"
        style:background-image="linear-gradient(0deg,transparent,{color})"
      />
    {/if}
    <img src={trackLink.img} alt={trackLink.name} />
  {/if}
  <div class="details">
    <span>Current Track</span>
    <h1 title={trackLink?.name}>{@html trackLink?.name}</h1>
    <div class="albumInfo">
      <!-- <img src={album.artists[0].} alt=""> -->
      <a href={'/artist/' + trackLink?.artist.id}>{trackLink?.artist.name}</a>
    </div>
  </div>
</div>

<style>
  .container {
    position: relative;
    display: flex;
    margin: calc(-1 * var(--navbar-height)) -30px 0 -30px;
    padding: 80px 30px 30px 30px;
    gap: 40px;
  }
  .container > img {
    width: 230px;
    height: 230px;
    transition: transform 0.5s;
    box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
  }
  .container > span {
    width: 230px;
    height: 230px;
    border-radius: 6px;
    background-color: var(--medium-gray);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
  }
  .container > img:hover {
    transform: scale(1.05);
  }
  .color-gradient {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 150%;
    animation: fadeIn 1s ease-in-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .details {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
  }
  .details > span {
    font-size: 0.875rem;
  }
  .details > h1 {
    font-size: 3rem;
    max-height: 150px;
    max-width: 500px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
    margin: 8px 0;
    line-height: normal;
    font-weight: 700;
  }
  .albumInfo {
    font-size: 0.875rem;
  }
  .albumInfo > a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 700;
  }
  .albumInfo > a:hover {
    text-decoration: underline;
  }
  @media only screen and (max-width: 800px) {
    .container {
      margin: calc(-1 * var(--navbar-height)) -15px 0 -15px;
    }
    .details > h1 {
      font-size: 2rem;
    }
  }
  @media only screen and (max-width: 600px) {
    .container {
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .details > span {
      display: none;
    }
    .details > h1 {
      text-align: center;
    }
  }
</style>
