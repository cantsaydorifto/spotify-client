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
  color: string | null;
}>({
  trackLink: null,
  songQueue: [],
  audio: null,
  isPaused: false,
  currentlyPlaying: null,
  curTrackPtr: -1,
  color: null
});

export function setColor(color: string) {
  currentSong.update((cur) => ({ ...cur, color }));
}

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

export const playNext = (trackLink: Song) => {
  const curState = get(currentSong);
  if (curState.songQueue.length === 0) {
    return;
  }
  currentSong.update((current) => ({
    ...current,
    songQueue: [
      ...current.songQueue.slice(0, curState.curTrackPtr + 1),
      trackLink,
      ...current.songQueue.slice(curState.curTrackPtr + 1)
    ]
  }));
};

export const addToQueueEnd = (trackLink: Song) => {
  const curState = get(currentSong);
  if (curState.songQueue.length === 0) {
    return;
  }
  currentSong.update((current) => ({
    ...current,
    songQueue: [...current.songQueue, trackLink]
  }));
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
      preview_url: track.preview_url || '',
      duration_ms: track.duration_ms
    };
    return { ...current, songQueue: [...cur] };
  });
  return true;
};

export const playSong = () => {
  const curState = get(currentSong);
  if (curState.curTrackPtr + 1 >= curState.songQueue.length) {
    clearQueue();
    return curState;
  }
  setLoading();
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
  const curState = get(currentSong);
  if (curState.curTrackPtr - 1 < 0) {
    return curState;
  }
  setLoading();
  currentSong.update((current) => {
    const ptr = [current.curTrackPtr - 1];
    const curQueue = [...current.songQueue];
    if (ptr[0] < 0) {
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
  if (!track && ptr[0] < 0) {
    clearQueue();
    return;
  }
  // console.log({ track, ptr: ptr[0] });
  // console.log({ curPtr: ptr[0], queue: curState.songQueue });
  const res = await addSongToQueue(track, ptr[0]);
  if (!res) {
    ptr[0] -= 1;
    // console.log(ptr);
    const t = ptr[0] >= 0 ? curState.songQueue[ptr[0]] : null;
    // console.log('T==>', t);
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
  if (!track && ptr[0] >= curState.songQueue.length) {
    clearQueue();
    return;
  }
  // console.log({ track, ptr: ptr[0] });
  // console.log({ curPtr: ptr[0], queue: curState.songQueue });
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

export function setLoading() {
  currentSong.update((current) => {
    return {
      ...current,
      trackLink: {
        album: { id: 'LOADING-ALBUM', name: 'Loading Album...', totalTracks: -1 },
        artist: { id: 'LAODING-ARTIST', name: 'Loading Artist...' },
        id: 'LOADING',
        img: '',
        link: '',
        name: 'Loading Track...',
        preview_url: '',
        trackNumber: -1,
        needsFetch: false,
        duration_ms: 0
      }
    };
  });
}

export async function startRadio(track: TrackObjectFull | RecommendationTrackObject) {
  let recommendedObject: RecommendationsObject = { seeds: [], tracks: [] };
  setLoading();
  const recommendedObjectRes = await fetch(`/api/spotify/recommendations?seed_tracks=${track.id}`);
  if (recommendedObjectRes.ok) {
    recommendedObject = (await recommendedObjectRes.json()) as RecommendationsObject;
  }
  const tracksToQueue: Song[] = [
    {
      id: track.id,
      album: {
        name: track.album.name,
        id: track.album.id,
        totalTracks: track.album.total_tracks
      },
      trackNumber: track.track_number,
      preview_url: track.preview_url || '',
      name: track.name,
      link: '',
      artist: {
        id: track.album.artists[0].id,
        name: track.album.artists[0].name
      },
      needsFetch: true,
      img: track.album.images[0].url,
      duration_ms: track.duration_ms
    },
    ...recommendedObject.tracks.map((el) => ({
      id: el.id,
      album: {
        name: el.album.name,
        id: el.album.id,
        totalTracks: el.album.total_tracks
      },
      trackNumber: el.track_number,
      preview_url: el.preview_url || '',
      name: el.name,
      link: '',
      artist: {
        id: el.album.artists[0].id,
        name: el.album.artists[0].name
      },
      needsFetch: true,
      img: el.album.images[0].url,
      duration_ms: el.duration_ms
    }))
  ];
  clearQueue();
  setCurrentlyPlaying({
    name: track.name,
    id: track.id,
    type: 'SINGLE'
  });
  addFetchedSongsToQueue(tracksToQueue, 0);
  playSong();
}

export function playSvnSong(track: SaavnSong) {
  const tracksToQueue: Song[] = [
    {
      id: track.id,
      album: {
        name: track.album.name,
        id: track.album.id,
        totalTracks: 1
      },
      trackNumber: 1,
      preview_url: '',
      name: track.name,
      link: track.downloadUrl[track.downloadUrl.length - 1].link,
      artist: {
        id: track.primaryArtistsId,
        name: track.primaryArtists
      },
      needsFetch: false,
      img: track.image[track.image.length - 1].link,
      duration_ms: Number(track.duration) * 1000
    }
  ];
  clearQueue();
  setCurrentlyPlaying({
    name: track.name,
    id: track.id,
    type: 'SINGLE'
  });
  addFetchedSongsToQueue(tracksToQueue, 0);
  playSong();
}
