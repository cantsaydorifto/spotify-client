import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import interceptFetch from '$lib/interceptor/interceptFetch';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, params }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const [artistRes, tracksRes] = await Promise.all([
    fetch('/api/spotify/artists/' + params.id),
    fetch('/api/spotify/artists/' + params.id + '/top-tracks?market=US')
  ]);

  if (!artistRes.ok) throw error(artistRes.status, 'Artist not found');
  if (!tracksRes.ok) throw error(tracksRes.status, 'Artist Tracks not found');

  const [artist, artistTracks] = (await Promise.all([artistRes.json(), tracksRes.json()])) as [
    SingleArtistResponse,
    ArtistsTopTracksResponse
  ];

  let color: string | null = null;
  const artistTopSongIds = artistTracks.tracks.map((el) => el.id);
  const [colorRes, hasLikedRes] = await Promise.all([
    artist.images.length > 0
      ? fetch('/api/color?image=' + artist.images[0].url)
      : Promise.resolve(null),
    fetch(`/api/spotify/me/tracks/contains?ids=${artistTopSongIds.join(',')}`)
  ]);

  // if (!hasLikedRes.ok) {
  // throw error(hasLikedRes.status, 'Could not find liked songs');
  // }

  const [colorData, hasliked] = await Promise.all([
    colorRes ? (colorRes.json() as Promise<{ dominantColor: string }>) : Promise.resolve(null),
    hasLikedRes.ok
      ? (hasLikedRes.json() as Promise<boolean[]>)
      : Promise.resolve(new Array(artistTracks.tracks.length).fill(false))
  ]);

  if (hasliked.length !== artistTracks.tracks.length)
    throw error(500, 'Artist Songs and Liked Songs Length Dont match');

  if (colorData && colorRes && colorRes.ok) {
    color = colorData.dominantColor;
  }

  return {
    artist,
    artistTracks: artistTracks.tracks,
    color,
    hasliked
  };
};
