<script lang="ts">
  import Play from './icons/Play.svelte';
  export let innerSize: number;
  export let outerSize: number = 56;
  export let onclick: () => void = () => {};
</script>

<button
  on:click={onclick}
  class="playBtn"
  style:width={outerSize + 'px'}
  style:height={outerSize + 'px'}
  ><Play width={innerSize + 'px'} height={innerSize + 'px'} /></button
>

<style>
  .playBtn {
    border: none;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 50%;
    background-color: var(--accent-color);
    transition: all 0.3s;
  }
  .playBtn:hover {
    transform: scale(1.05);
  }
</style>
