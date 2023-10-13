<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  type ElementType = $$Generic<'button' | 'a'>;
  interface ButtonElements {
    button: HTMLButtonAttributes;
    a: HTMLAnchorAttributes;
  }
  type $$Props = ButtonElements[ElementType] & {
    element: ElementType;
    style: 'solid' | 'outline' | 'danger';
    styleClasses?: string;
  };
  export let element: 'button' | 'a';
  export let style: 'solid' | 'outline' | 'danger';
  export const styleClasses = '';
</script>

<svelte:element this={element} class="button {style} {styleClasses}" {...$$restProps}>
  <slot />
</svelte:element>

<style>
  .button {
    border: none;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 20px;
    cursor: pointer;
    text-decoration: none;
    padding: 7px 15px;
    transition: all 0.3s;
  }
  .solid {
    background-color: var(--accent-color);
    color: black;
    border: 2px solid var(--accent-color);
  }
  .outline {
    background: none;
    color: var(--text-color);
    border: 2px solid;
  }
  .danger {
    background-color: var(--error);
    color: white;
    border: 2px solid var(--error);
  }
  .solid:hover,
  .danger:hover {
    filter: brightness(0.9);
  }
  .outline:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
