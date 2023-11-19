import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import interceptFetch from '$lib/interceptor/interceptFetch';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, params }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const res = await fetch('/api/spotify/artists/' + params.id);
  const resTracks = await fetch('/api/spotify/artists/' + params.id + '/top-tracks?market=US');
  const resAlbums = await fetch('/api/spotify/artists/' + params.id + '/albums?limit=50');
  const resRelatedArtists = await fetch('/api/spotify/artists/' + params.id + '/related-artists');
  if (!res.ok) throw error(res.status, 'Artist not found');
  if (!resTracks.ok) throw error(resTracks.status, 'Artist Tracks not found');
  if (!resAlbums.ok) throw error(resAlbums.status, 'Artist Albums not found');
  if (!resRelatedArtists.ok) throw error(resRelatedArtists.status, 'Related Artists not found');
  const artist = (await res.json()) as SingleArtistResponse;
  const artistTracks = (await resTracks.json()) as ArtistsTopTracksResponse;
  const artistAlbumsRes = (await resAlbums.json()) as ArtistsAlbumsResponse;
  const relatedArtists = (await resRelatedArtists.json()) as ArtistsRelatedArtistsResponse;
  let color: string | null = null;
  if (artist.images.length > 0) {
    const colorRes = await fetch('/api/color?image=' + artist.images[0].url);
    if (colorRes.ok) {
      const { dominantColor } = (await colorRes.json()) as { dominantColor: string };
      color = dominantColor;
    }
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
    relatedArtists: relatedArtists.artists,
    color
  };
};
