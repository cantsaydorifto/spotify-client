import {
  addFetchedSongsToQueue,
  clearQueue,
  playSong,
  setCurrentlyPlaying
} from '$lib/store/currentPlaying';

export function startQuickPicksPlayback(tracks: TrackObjectFull[]) {
  const tracksToQueue: Song[] = tracks.map((track) => ({
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
  }));
  clearQueue();
  setCurrentlyPlaying({
    name: tracks[0].name,
    id: tracks[0].id,
    type: 'SINGLE'
  });
  addFetchedSongsToQueue(tracksToQueue, 0);
  playSong();
}
