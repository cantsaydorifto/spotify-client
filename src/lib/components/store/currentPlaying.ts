import { writable } from 'svelte/store';

export const currentSong = writable<{
  trackLink: {
    name: string;
    artist: string;
    img: string;
    link: string;
  } | null;
  songQueue: {
    name: string;
    artist: string;
    img: string;
    link: string;
  }[];
}>({
  trackLink: null,
  songQueue: []
});

export const clearQueue = () => {
  currentSong.update((current) => {
    current.songQueue = [];
    return current;
  });
};

export const addFetchedSongsToQueue = (
  trackLink:
    | {
        name: string;
        link: string;
        artist: string;
        img: string;
      }[]
    | null
) => {
  if (!trackLink) return;
  currentSong.update((current) => {
    current.songQueue.unshift(...trackLink);
    return current;
  });
};

export const addSongToQueue = async (track: {
  trackNumber: number;
  albumName: string;
  artistName: string;
  albumTotalTracks: number;
  preview_url: string | null;
  name: string;
  albumImage: string;
}) => {
  const songRes = await fetch(
    `/api/song/${track.trackNumber}?query=${encodeURIComponent(
      `${track.albumName} ${track.artistName}`
    )}&count=${track.albumTotalTracks}`
  );
  let [songLink, songName] = ['', ''];
  if (!songRes.ok) {
    console.log('not ok');
    songLink = track.preview_url || '';
    songName = track.name || '';
    console.log(songLink);
  } else {
    const song = await songRes.json();
    songLink = song.song.downloadUrl[song.song.downloadUrl.length - 1].link;
    songName = song.song.name;
    console.log(song);
  }
  currentSong.update((current) => {
    current.songQueue.unshift({
      name: songName,
      artist: track.artistName,
      img: track.albumImage,
      link: songLink
    });
    return current;
  });
};

export const playSong = () => {
  currentSong.update((current) => {
    if (current.songQueue.length <= 0) {
      return current;
    }
    console.log('Song QUEUE: ', [...current.songQueue]);
    current.trackLink = current.songQueue.shift() || null;
    return current;
  });
};
