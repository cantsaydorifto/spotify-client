import { writable } from 'svelte/store';

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

export const currentSong = writable<{
  trackLink: Song | null;
  songQueue: Song[];
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

export const addFetchedSongsToQueue = (trackLink: Song[] | null) => {
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
  artistId: string;
  songId: string;
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
  let [songLink, songName, songId] = ['', '', ''];
  songId = track.songId;
  if (!songRes.ok) {
    console.log('not ok');
    songLink = track.preview_url || '';
    songName = track.name || '';
  } else {
    const song = await songRes.json();
    songLink = song.song.downloadUrl[song.song.downloadUrl.length - 1].link;
    songName = song.song.name;
  }
  if (songLink.startsWith('null')) {
    return;
  }
  currentSong.update((current) => {
    current.songQueue.unshift({
      name: songName,
      id: songId,
      artist: {
        id: track.artistId,
        name: track.artistName
      },
      img: track.albumImage,
      link: songLink,
      album: {
        name: track.albumName,
        totalTracks: track.albumTotalTracks
      },
      trackNumber: track.trackNumber,
      preview_url: track.preview_url || ''
    });
    return current;
  });
};

export const playSong = () => {
  currentSong.update((current) => {
    if (current.songQueue.length <= 0) {
      return current;
    }
    const curTrack = current.songQueue.shift() || null;
    if (!curTrack || !curTrack.needsFetch || current.songQueue.length < 0) {
      return current;
    }
    const song = curTrack;
    playNextSong({
      albumImage: song.img,
      albumName: song.album.name,
      albumTotalTracks: song.album.totalTracks,
      artist: song.artist,
      name: song.name,
      songId: song.id,
      preview_url: song.preview_url,
      trackNumber: song.trackNumber
    });
    return current;
  });
};

const playNextSong = async ({
  albumImage,
  albumName,
  albumTotalTracks,
  artist,
  name,
  songId,
  preview_url,
  trackNumber
}: {
  albumImage: string;
  albumName: string;
  albumTotalTracks: number;
  artist: {
    name: string;
    id: string;
  };
  name: string;
  songId: string;
  preview_url: string;
  trackNumber: number;
}) => {
  await addSongToQueue({
    songId,
    albumImage,
    albumName,
    albumTotalTracks,
    artistName: artist.name,
    artistId: artist.id,
    name,
    preview_url,
    trackNumber
  });
  currentSong.update((current) => {
    if (current.songQueue.length > 0 && current.songQueue[0].link === '') {
      current.songQueue[0].link = current.songQueue[0].preview_url;
    }
    current.trackLink = current.songQueue.shift() || null;
    console.log(current.trackLink);
    return current;
  });
};
