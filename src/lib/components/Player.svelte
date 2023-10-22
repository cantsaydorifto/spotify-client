<script lang="ts">
  export let track: {
    name: string;
    album: string;
    link: string;
  };
  let audio: HTMLAudioElement;
  let paused = true;
</script>

<div class="player">
  <audio src={track.link} controls bind:paused preload="none" />
</div>

<style>
</style>
