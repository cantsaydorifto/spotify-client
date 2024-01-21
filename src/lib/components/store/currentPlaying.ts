import { get, writable } from 'svelte/store';

export const currentSong = writable<{
  trackLink: Song | null;
  songQueue: Song[];
  audio: HTMLAudioElement | null;
  isPaused: boolean;
  curTrackPtr: number;
  currentlyPlaying: {
    type: 'PLAYLIST' | 'ALBUM' | 'SINGLE';
    id: string;
    name: string;
  } | null;
}>({
  trackLink: null,
  songQueue: [],
  audio: null,
  isPaused: false,
  currentlyPlaying: null,
  curTrackPtr: -1
});

export const getCurrentPlayingSong = () => {
  const track = get(currentSong).trackLink;
  return track ? track.name : null;
};

export const clearQueue = () => {
  currentSong.update((current) => {
    return {
      ...current,
      songQueue: [],
      isPaused: true,
      currentlyPlaying: null,
      trackLink: null,
      curTrackPtr: -1
    };
  });
};

export const setCurrentlyPlaying = (
  track: {
    name: string;
    id: string;
    type: 'ALBUM' | 'PLAYLIST' | 'SINGLE';
  } | null
) => {
  currentSong.update((current) => {
    if (!track) return { ...current, currentlyPlaying: null };
    return { ...current, currentlyPlaying: { ...track } };
  });
};

export const togglePlay = () => {
  currentSong.update((current) => {
    if (!current.audio) return current;
    if (current.isPaused) {
      current.audio.play();
    } else {
      current.audio.pause();
    }
    return { ...current, isPaused: !current.isPaused };
  });
};

export const addFetchedSongsToQueue = (trackLink: Song[] | null, idx: number) => {
  if (!trackLink) return;
  currentSong.update((current) => {
    return { ...current, songQueue: [...current.songQueue, ...trackLink], curTrackPtr: idx - 1 };
  });
};

export const addSongToQueue = async (track: Song | null, ptr: number) => {
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
    const cur = [...current.songQueue];
    cur[ptr] = {
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
        totalTracks: track.album.totalTracks,
        id: track.album.id
      },
      trackNumber: track.trackNumber,
      preview_url: track.preview_url || ''
    };
    return { ...current, songQueue: [...cur] };
  });
  return true;
};

export const playSong = () => {
  currentSong.update((current) => {
    const ptr = [current.curTrackPtr + 1];
    const curQueue = [...current.songQueue];
    if (ptr[0] >= curQueue.length) {
      return current;
    }
    const curTrack = curQueue[ptr[0]];
    if (!curTrack.needsFetch) {
      return {
        ...current,
        trackLink: curTrack || null,
        isPaused: false,
        songQueue: [...curQueue],
        curTrackPtr: ptr[0]
      };
    }
    const song = curTrack;
    // console.log(curTrack);
    playNextSong(song, ptr);
    return { ...current, songQueue: [...curQueue] };
  });
};

export const playSongPrevious = () => {
  currentSong.update((current) => {
    const ptr = [current.curTrackPtr - 1];
    const curQueue = [...current.songQueue];
    if (ptr[0] <= 0) {
      return current;
    }
    const curTrack = curQueue[ptr[0]];
    // console.log(curTrack);
    if (!curTrack.needsFetch) {
      return {
        ...current,
        trackLink: curTrack || null,
        isPaused: false,
        songQueue: [...curQueue],
        curTrackPtr: ptr[0]
      };
    }
    const song = curTrack;
    // console.log(curTrack);
    playPrevSong(song, ptr);
    return { ...current, songQueue: [...curQueue] };
  });
};

const playPrevSong = async (track: Song | null, ptr: number[]) => {
  const curState = get(currentSong);
  if (!track && ptr[0] < 0) return;
  // console.log({ track, ptr: ptr[0] });
  console.log({ curPtr: ptr[0], queue: curState.songQueue });
  const res = await addSongToQueue(track, ptr[0]);
  if (!res) {
    ptr[0] -= 1;
    // console.log(ptr);
    const t = ptr[0] >= 0 ? curState.songQueue[ptr[0]] : null;
    console.log('T==>', t);
    playPrevSong(t, ptr);
    return;
  }
  currentSong.update((current) => {
    const curQueue = [...current.songQueue];
    if (ptr[0] >= 0 && curQueue[ptr[0]].link === '') {
      curQueue[ptr[0]].link = curQueue[ptr[0]].preview_url;
    }
    return {
      ...current,
      trackLink: curQueue[ptr[0]],
      isPaused: false,
      songQueue: [...curQueue],
      curTrackPtr: ptr[0]
    };
  });
};

const playNextSong = async (track: Song | null, ptr: number[]) => {
  const curState = get(currentSong);
  if (!track && ptr[0] >= curState.songQueue.length) return;
  // console.log({ track, ptr: ptr[0] });
  console.log({ curPtr: ptr[0], queue: curState.songQueue });
  const res = await addSongToQueue(track, ptr[0]);
  if (!res) {
    ptr[0] += 1;
    // console.log(ptr);
    const t = ptr[0] < curState.songQueue.length ? curState.songQueue[ptr[0]] : null;
    playNextSong(t, ptr);
    return;
  }
  currentSong.update((current) => {
    const curQueue = [...current.songQueue];
    if (ptr[0] < curQueue.length && curQueue[ptr[0]].link === '') {
      curQueue[ptr[0]].link = curQueue[ptr[0]].preview_url;
    }
    return {
      ...current,
      trackLink: curQueue[ptr[0]],
      isPaused: false,
      songQueue: [...curQueue],
      curTrackPtr: ptr[0]
    };
  });
};
