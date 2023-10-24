import { writable } from 'svelte/store';

export const currentSong = writable<{
  trackLink: {
    name: string;
    artist: string;
    img: string;
    link: string;
  } | null;
}>({
  trackLink: null
});
