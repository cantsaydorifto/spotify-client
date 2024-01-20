import { get, writable } from 'svelte/store';

export const currentSong = writable<{
  trackLink: Song | null;
  songQueue: Song[];
  audio: HTMLAudioElement | null;
  isPaused: boolean;
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
  currentlyPlaying: null
});

export const getCurrentPlayingSong = () => {
  const track = get(currentSong).trackLink;
  return track ? track.name : null;
};

export const clearQueue = () => {
  currentSong.update((current) => {
    return { ...current, songQueue: [], isPaused: true, currentlyPlaying: null, trackLink: null };
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

export const addFetchedSongsToQueue = (trackLink: Song[] | null) => {
  if (!trackLink) return;
  currentSong.update((current) => {
    return { ...current, songQueue: [...trackLink, ...current.songQueue] };
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
    const cur = [...current.songQueue];
    cur.unshift({
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
    });
    return { ...current, songQueue: [...cur] };
  });
  return true;
};

export const playSong = () => {
  currentSong.update((current) => {
    const curQueue = [...current.songQueue];
    if (curQueue.length <= 0) {
      return current;
    }
    const curTrack = curQueue.shift() || null;
    if (!curTrack || !curTrack.needsFetch) {
      // console.log(curTrack);
      return { ...current, trackLink: curTrack || null, isPaused: false, songQueue: [...curQueue] };
    }
    const song = curTrack;
    // console.log(curTrack);
    playNextSong(song);
    return { ...current, songQueue: [...curQueue] };
  });
};

const playNextSong = async (track: Song | null) => {
  const res = await addSongToQueue(track);
  if (!res) {
    const t = get(currentSong).songQueue[0] || null;
    currentSong.update((el) => {
      const curQueue = [...el.songQueue];
      curQueue.shift();
      return { ...el, songQueue: [...curQueue] };
    });
    playNextSong(t);
    return;
  }
  currentSong.update((current) => {
    const curQueue = [...current.songQueue];
    if (curQueue.length > 0 && curQueue[0].link === '') {
      curQueue[0].link = curQueue[0].preview_url;
    }
    return {
      ...current,
      trackLink: curQueue.shift() || null,
      isPaused: false,
      songQueue: [...curQueue]
    };
  });
};
