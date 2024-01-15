import { get, writable } from 'svelte/store';

export const currentSong = writable<{
  trackLink: Song | null;
  songQueue: Song[];
}>({
  trackLink: null,
  songQueue: []
});

export const getCurrentPlayingSong = () => {
  const track = get(currentSong).trackLink;
  return track ? track.name : null;
};

export const clearQueue = () => {
  currentSong.update((current) => {
    current.songQueue = [];
    return current;
  });
};

export const addFetchedSongsToQueue = (trackLink: Song[] | null) => {
  if (!trackLink) return;
  currentSong.update((current) => {
    current.songQueue.unshift(...trackLink);
    return current;
  });
};

export const addSongToQueue = async (track: Song | null) => {
  if (!track) {
    return false;
  }
  const songRes = await fetch(
    `/api/song/${track.trackNumber}?query=${encodeURIComponent(
      `${track.album.name} ${track.artist.name}`
    )}&count=${track.album.totalTracks}`
  );
  let [songLink, songName, songId] = ['', '', ''];
  songId = track.id;
  if (!songRes.ok) {
    // console.log('not ok');
    songLink = track.preview_url || '';
    songName = track.name || '';
  } else {
    const song = await songRes.json();
    songLink = song.song.downloadUrl[song.song.downloadUrl.length - 1].link;
    songName = song.song.name;
  }
  if (songLink.startsWith('null') || songLink === '') {
    return false;
  }
  currentSong.update((current) => {
    current.songQueue.unshift({
      name: songName,
      id: songId,
      artist: {
        id: track.artist.id,
        name: track.artist.name
      },
      img: track.img,
      link: songLink,
      album: {
        name: track.album.name,
        totalTracks: track.album.totalTracks
      },
      trackNumber: track.trackNumber,
      preview_url: track.preview_url || ''
    });
    return current;
  });
  return true;
};

export const playSong = () => {
  currentSong.update((current) => {
    // console.log([...current.songQueue]);
    if (current.songQueue.length <= 0) {
      return current;
    }
    const curTrack = current.songQueue.shift() || null;
    if (!curTrack || !curTrack.needsFetch) {
      // console.log(curTrack);
      current.trackLink = curTrack || null;
      return current;
    }
    const song = curTrack;
    // console.log(curTrack);
    playNextSong(song);
    return current;
  });
};

const playNextSong = async (track: Song | null) => {
  const res = await addSongToQueue(track);
  if (!res) {
    const t = get(currentSong).songQueue[0] || null;
    currentSong.update((el) => {
      el.songQueue.shift();
      return el;
    });
    playNextSong(t);
    return;
  }
  currentSong.update((current) => {
    if (current.songQueue.length > 0 && current.songQueue[0].link === '') {
      current.songQueue[0].link = current.songQueue[0].preview_url;
    }
    current.trackLink = current.songQueue.shift() || null;
    return current;
  });
};

interface Song {
  name: string;
  id: string;
  artist: {
    name: string;
    id: string;
  };
  img: string;
  link: string;
  album: {
    name: string;
    totalTracks: number;
  };
  trackNumber: number;
  preview_url: string;
  needsFetch?: boolean;
}
