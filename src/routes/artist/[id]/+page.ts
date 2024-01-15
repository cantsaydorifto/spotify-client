import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import interceptFetch from '$lib/interceptor/interceptFetch';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, params }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const [artistRes, tracksRes, albumsRes, relatedArtistsRes] = await Promise.all([
    fetch('/api/spotify/artists/' + params.id),
    fetch('/api/spotify/artists/' + params.id + '/top-tracks?market=US'),
    fetch('/api/spotify/artists/' + params.id + '/albums?limit=50'),
    fetch('/api/spotify/artists/' + params.id + '/related-artists')
  ]);

  if (!artistRes.ok) throw error(artistRes.status, 'Artist not found');
  if (!tracksRes.ok) throw error(tracksRes.status, 'Artist Tracks not found');
  if (!albumsRes.ok) throw error(albumsRes.status, 'Artist Albums not found');
  if (!relatedArtistsRes.ok) throw error(relatedArtistsRes.status, 'Related Artists not found');

  const [artist, artistTracks, artistAlbumsRes, relatedArtists] = (await Promise.all([
    artistRes.json(),
    tracksRes.json(),
    albumsRes.json(),
    relatedArtistsRes.json()
  ])) as [
    SingleArtistResponse,
    ArtistsTopTracksResponse,
    ArtistsAlbumsResponse,
    ArtistsRelatedArtistsResponse
  ];

  let color: string | null = null;
  const [artistPlaylistsRes, colorRes] = await Promise.all([
    fetch(`/api/spotify/search?market=US&q=${encodeURIComponent(artist.name)}&type=playlist`),
    artist.images.length > 0
      ? fetch('/api/color?image=' + artist.images[0].url)
      : Promise.resolve(null)
  ]);

  if (!artistPlaylistsRes.ok)
    throw error(artistPlaylistsRes.status, 'Could Not Search Artist Playlist');

  const [{ playlists: artistPlaylists }, colorData] = await Promise.all([
    artistPlaylistsRes.json() as SearchResponse,
    colorRes ? (colorRes.json() as Promise<{ dominantColor: string }>) : Promise.resolve(null)
  ]);

  if (colorData && colorRes && colorRes.ok) {
    color = colorData.dominantColor;
  }

  const artistAlbums = artistAlbumsRes.items.filter((album) => album.album_group === 'album');
  const artistSingles = artistAlbumsRes.items.filter((album) => album.album_group === 'single');
  const artistAppearsOn = artistAlbumsRes.items.filter(
    (album) => album.album_group === 'appears_on'
  );
  return {
    artist,
    artistTracks: artistTracks.tracks,
    artistAlbums,
    artistAppearsOn,
    artistSingles,
    artistPlaylists: artistPlaylists ? artistPlaylists.items : [],
    relatedArtists: relatedArtists.artists,
    color
  };
};
