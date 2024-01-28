export async function getSaavnAlbumTracks(album: {
  name: string;
  id: string;
  artist: string;
  totalTracks: number;
}) {
  const saavnAlbumTracks: {
    name: string;
    album: string;
    link: string;
  }[] = [];
  const res = await fetch(
    '/api/album?query=' +
      `${encodeURIComponent(`${album.name} ${album.artist}`)}&count=${album.totalTracks}`
  );
  const resJson = await (res.ok
    ? (res.json() as Promise<{ album: SaavnApiAlbumResponse }>)
    : Promise.resolve(null));

  if (resJson) {
    saavnAlbumTracks.push(
      ...resJson.album.data.songs.map((el) => ({
        name: el.name,
        album: el.album.name,
        artist: el.primaryArtists,
        link: el.downloadUrl[el.downloadUrl.length - 1].link
      }))
    );
  }
  return saavnAlbumTracks
    .map((el) => ({
      ...el,
      album: {
        name: album.name,
        id: album.id
      }
    }))
    .slice(0, 50);
}

export async function getAlbumRecommendedTracks(
  artistId: string,
  albumSongIds: string[]
): Promise<{ recommendedTracks: TrackObjectFull[]; hasLikedRecommendations: boolean[] }> {
  const recommendedObjectRes = await fetch(
    `/api/spotify/recommendations?seed_artists=${artistId}&seed_tracks=${albumSongIds
      .slice(0, 4)
      .join(',')}`
  );
  let recommendedObject: RecommendationsObject = { seeds: [], tracks: [] };
  if (recommendedObjectRes.ok) {
    recommendedObject = (await recommendedObjectRes.json()) as RecommendationsObject;
  }

  const hasLikedRecommendationsRes = await fetch(
    `/api/spotify/me/tracks/contains?ids=${recommendedObject.tracks.map((el) => el.id).join(',')}`
  );

  const hasLikedRecommendations = await (hasLikedRecommendationsRes.ok
    ? (hasLikedRecommendationsRes.json() as Promise<boolean[]>)
    : Promise.resolve([]));
  return {
    hasLikedRecommendations,
    recommendedTracks: convertRecommendedTracksToTrackObjectFull(recommendedObject)
  };
}

export async function getColor(imgSrc: string) {
  const colorRes = await fetch('/api/color?image=' + imgSrc);
  const colorData = await (colorRes.ok
    ? (colorRes.json() as Promise<{ dominantColor: string }>)
    : Promise.resolve(null));
  return colorData ? colorData.dominantColor : null;
}

function convertRecommendedTracksToTrackObjectFull(
  recommendationsObject: RecommendationsObject
): TrackObjectFull[] {
  return recommendationsObject.tracks.map((recommendationTrack) => {
    return {
      ...recommendationTrack,
      album: {
        ...recommendationTrack.album,
        album_type: 'album'
      }
    };
  });
}

export function getTrackDuration(items: TrackObjectSimplified[]) {
  let duration = 0;
  items.forEach((el) => {
    duration += el.duration_ms;
  });
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration / 1000) % 60);
  return {
    minutes: minutes !== 0 ? `${minutes} min` : '',
    seconds: seconds !== 0 ? `${seconds} sec` : ''
  };
}
