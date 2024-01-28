export function numberToCommaString(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export async function getArtistAlbums(artistId: string): Promise<{
  artistAlbums: AlbumObjectSimplified[];
  artistSingles: AlbumObjectSimplified[];
  artistAppearsOn: AlbumObjectSimplified[];
}> {
  const albumRes = await fetch('/api/spotify/artists/' + artistId + '/albums?limit=50');
  const artistAlbumsRes = (await (albumRes.ok
    ? albumRes.json()
    : Promise.resolve([]))) as ArtistsAlbumsResponse;

  const artistAlbums = artistAlbumsRes.items.filter((album) => album.album_group === 'album');
  const artistSingles = artistAlbumsRes.items.filter((album) => album.album_group === 'single');
  const artistAppearsOn = artistAlbumsRes.items.filter(
    (album) => album.album_group === 'appears_on'
  );

  return { artistAlbums, artistSingles, artistAppearsOn };
}

export async function getRelatedArtists(artistId: string): Promise<{
  relatedArtists: ArtistObjectFull[];
}> {
  const relatedArtistsRes = await fetch('/api/spotify/artists/' + artistId + '/related-artists');

  const relatedArtists = (await (relatedArtistsRes.ok
    ? relatedArtistsRes.json()
    : Promise.resolve([]))) as ArtistsRelatedArtistsResponse;

  return { relatedArtists: relatedArtists.artists };
}

export async function getArtistPlaylists(artistName: string): Promise<PlaylistObjectSimplified[]> {
  const artistPlaylistsRes = await fetch(
    `/api/spotify/search?market=US&q=${encodeURIComponent(artistName)}&type=playlist`
  );
  if (!artistPlaylistsRes.ok) return [];
  const { playlists: artistPlaylists } = (await artistPlaylistsRes.json()) as SearchResponse;
  return artistPlaylists ? artistPlaylists.items : [];
}

export async function getArtistRecommendedTracks(
  artistId: string,
  artistTopSongIds: string[]
): Promise<{ recommendedTracks: TrackObjectFull[]; hasLikedRecommendations: boolean[] }> {
  const recommendedObjectRes = await fetch(
    `/api/spotify/recommendations?seed_artists=${artistId}&seed_tracks=${artistTopSongIds
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
