import {
  addFetchedSongsToQueue,
  clearQueue,
  playSong,
  setCurrentlyPlaying
} from '$lib/components/store/currentPlaying';
import { error } from '@sveltejs/kit';

export async function getColor(imageSrc: string) {
  const colorRes = await fetch('/api/color?image=' + imageSrc);
  return colorRes ? (colorRes.json() as Promise<{ dominantColor: string }>) : Promise.resolve(null);
}

export function startPlaylistPlayback(
  tracks: TrackObjectFull[],
  playlist: { name: string; id: string }
) {
  const tracksToQueue: Song[] | null = tracks
    ? tracks.map((el) => ({
        name: el.name,
        id: el.id,
        artist: { name: el.artists[0].name, id: el.artists[0].id },
        img: el.album ? el.album.images[0].url : '',
        link: '',
        album: {
          name: el.album ? el.album.name : '',
          totalTracks: el.album ? el.album.total_tracks : 0,
          id: el.album ? el.album.id : ''
        },
        trackNumber: el.track_number,
        preview_url: el.preview_url || '',
        needsFetch: true,
        duration_ms: el.duration_ms
      }))
    : null;
  clearQueue();
  setCurrentlyPlaying({
    name: playlist.name,
    id: playlist.id,
    type: 'PLAYLIST'
  });
  addFetchedSongsToQueue(tracksToQueue, 0);
  playSong();
}

export async function loadMoreTracks(
  pagination: { trackOffset: number; hasMoreTracks: boolean },
  playlistId: string
) {
  if (!pagination.hasMoreTracks) return null;
  const res = await fetch(
    `/api/spotify/playlists/${playlistId}/tracks?offset=${pagination.trackOffset}&limit=50`
  );
  const playlistTracks = (await res.json()) as PlaylistTrackResponse;
  pagination.trackOffset += 50;
  pagination.hasMoreTracks = playlistTracks.total > pagination.trackOffset;
  playlistTracks.items = playlistTracks.items.filter(
    (el) => !!el.track && el.track.type === 'track'
  );

  const playlistSongIds = playlistTracks.items.map((el) => el.track!.id);
  const likedByUserRes = await fetch(
    `/api/spotify/me/tracks/contains?ids=${playlistSongIds.filter((el) => !!el).join(',')}`
  );
  const likedByUser = (await likedByUserRes.json()) as boolean[];

  if (likedByUser.length !== playlistTracks.items.length)
    throw error(500, 'Playlist Songs and Liked Songs Length Dont match');

  return {
    playlistTracks,
    likedByUser
  };
}

export function getTrackDuration(items: PlaylistTrackObject[]) {
  let duration = 0;
  items.forEach((el) => {
    duration += el.track?.duration_ms || 0;
  });
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration / 1000) % 60);
  return {
    minutes: minutes !== 0 ? `${minutes} min` : '',
    seconds: seconds !== 0 ? `${seconds} sec` : ''
  };
}
