<script lang="ts">
  import { onMount } from 'svelte';
  import { playSong } from './store/currentPlaying';

  let volumeSlider: HTMLInputElement;
  let currentVolumeBar: HTMLDivElement;
  export let audio: HTMLAudioElement | null;
  onMount(() => {
    if (!audio) return;
    audio.addEventListener('timeupdate', (event) => {
      const el = event.target as HTMLAudioElement;
      volumeSlider.max = `${audio!.duration}`;
      volumeSlider.value = `${el.currentTime}`;
      // currentTimeElement.innerText = msToTime(el.currentTime * 1000);
      // durationTimeElement.innerText = msToTime(el.duration * 1000);
      if (currentVolumeBar) {
        currentVolumeBar.style.left = `calc(-${
          100 - (Number(volumeSlider.value) / audio!.duration) * 100
        }% + 12px - ${Number(volumeSlider.value) / (audio!.duration / 12)}px)`;
      }
    });
    audio.addEventListener('error', () => playSong()); // preview_url is null or starts with null
    audio.addEventListener('ended', () => playSong());

    volumeSlider.addEventListener('input', (event) => {
      const inp = event.target as HTMLInputElement;
      currentVolumeBar.style.left = `calc(-${
        100 - (Number(inp.value) / audio!.duration) * 100
      }% + 12px - ${Number(inp.value) / (audio!.duration / 12)}px)`;
      audio!.currentTime = Number(inp.value);
    });
  });
</script>

<div class="sliderContainer">
  {#if audio && audio.currentTime > 0}<div
      bind:this={currentVolumeBar}
      class="current-volume-bar"
    />{/if}
  <input
    class="volume-slider"
    bind:this={volumeSlider}
    min="0"
    max="100"
    value="0"
    type="range"
    name="duration"
  />
</div>

<style>
  .sliderContainer {
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    height: 20px;
    width: 100%;
    /* background-color: red; */
  }
  @media only screen and (max-width: 900px) {
    .sliderContainer {
      position: absolute;
      top: -8px;
      left: 0;
    }
  }
  .current-volume-bar {
    position: absolute;
    width: calc(100% - 12px);
    height: 4px;
    /* border-radius: 12px; */
    background: var(--accent-color);
    top: 50%;
    left: calc(-100% + 12px);
    transform: translateY(-50%);
    pointer-events: none;
  }
  input[type='range'] {
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    appearance: none;
    width: 100%;
    background: transparent; /* Otherwise white in Chrome */
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  input[type='range']:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }

  input[type='range']::-ms-track {
    width: 100%;
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  /* Special styling for WebKit/Blink */
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    margin-top: -4px;
    border: none;
    background: #ffffff;
    cursor: pointer;
  }

  /* All the same stuff for Firefox */
  input[type='range']::-moz-range-thumb {
    height: 12px;
    width: 12px;
    border: none;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
  }

  /* All the same stuff for IE */
  input[type='range']::-ms-thumb {
    height: 12px;
    width: 12px;
    border: none;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
  }
  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: var(--border);
    border-radius: 1.3px;
  }

  input[type='range']::-moz-range-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: var(--border);
    border-radius: 1.3px;
  }

  input[type='range']::-ms-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }
  input[type='range']::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type='range']:focus::-ms-fill-lower {
    background: #3071a9;
  }
  input[type='range']::-ms-fill-upper {
    background: #3071a9;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
</style>
