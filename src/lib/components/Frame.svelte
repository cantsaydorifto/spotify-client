<script lang="ts">
  let frameContainerRef: HTMLDivElement | null;
  let lRef: HTMLButtonElement | null;
  let rRef: HTMLButtonElement | null;
  let frameRef: HTMLDivElement | null;
  const handleFirstClick = (function () {
    let moved = 0;
    return function (right: boolean) {
      let totalMovement = 0;
      if (!frameRef || !frameContainerRef || !lRef || !rRef) return;
      const width = frameRef.clientWidth;
      const FRAME_WIDTH = frameContainerRef.clientWidth;
      const availableL = moved;
      const availableR = width - FRAME_WIDTH - moved;
      const toMove = FRAME_WIDTH > 600 ? 400 : 200;
      if (right) {
        toMove > availableR ? (totalMovement = availableR) : (totalMovement = toMove);
      } else {
        toMove > availableL ? (totalMovement = availableL) : (totalMovement = toMove);
      }

      frameRef.style.transform = `translateX(${
        right ? -1 * moved - totalMovement : -1 * moved + totalMovement
      }px)`;

      right ? (moved += totalMovement) : (moved -= totalMovement);
      if (moved === 0) {
        lRef.style.opacity = '0.3';
        lRef.style.cursor = 'default';
      } else {
        lRef.style.opacity = '1';
        lRef.style.cursor = 'pointer';
      }
      if (moved === width - FRAME_WIDTH) {
        rRef.style.opacity = '0.3';
        rRef.style.cursor = 'default';
      } else {
        rRef.style.opacity = '1';
        rRef.style.cursor = 'pointer';
      }
    };
  })();
</script>

<button
  style="opacity: 0.3;cursor:default;"
  bind:this={lRef}
  on:click={() => handleFirstClick(false)}
>
  <svg viewBox="0 0 20 20" height="18" width="18" fill="white">
    <path
      d="M12.793 19.707l-9-9a1 1 0 010-1.414l9-9 1.414 1.414L5.914 10l8.293 8.293-1.414 1.414z"
    />
  </svg>
</button>
<button bind:this={rRef} on:click={() => handleFirstClick(true)}>
  <svg viewBox="0 0 20 20" height="18" width="18" fill="white">
    <path
      d="M7.207 19.707l-1.414-1.414L14.086 10 5.793 1.707 7.207.293l9 9a1 1 0 010 1.414l-9 9z"
    />
  </svg>
</button>
<div bind:this={frameContainerRef} class="frameContainer">
  <div bind:this={frameRef} class="frame">
    <slot />
  </div>
</div>

<style>
  .frameContainer {
    position: relative;
    overflow: hidden;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 10px 0;
  }

  button {
    position: absolute;
    border: none;
    background-color: rgba(35, 32, 32, 0.986);
    cursor: pointer;
    border-radius: 50%;
    padding: 3px;
  }

  button:nth-child(1) {
    right: 60px;
    top: 16px;
  }

  button:nth-child(2) {
    right: 20px;
    top: 16px;
  }

  .frame {
    display: flex;
    transition: all 1s;
    width: fit-content;
    gap: 30px;
  }
  @media only screen and (max-width: 600px) {
    button:nth-child(1) {
      right: 40px;
    }

    button:nth-child(2) {
      right: 0;
    }
    .frame {
      gap: 25px;
    }
  }
</style>
