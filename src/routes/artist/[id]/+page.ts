import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import interceptFetch from '$lib/interceptor/interceptFetch';

export const load: PageLoad = async ({ fetch: fetchWithNoInterceptor, params, setHeaders }) => {
  const fetch = (path: string) => interceptFetch(fetchWithNoInterceptor, path);
  const [artistRes, tracksRes] = await Promise.all([
    fetch('/api/spotify/artists/' + params.id),
    fetch('/api/spotify/artists/' + params.id + '/top-tracks?market=US')
  ]);

  setHeaders({
    'cache-control': 'max-age=600'
  });

  if (!artistRes.ok) throw error(artistRes.status, 'Artist not found');
  if (!tracksRes.ok) throw error(tracksRes.status, 'Artist Tracks not found');

  const [artist, artistTracks] = (await Promise.all([artistRes.json(), tracksRes.json()])) as [
    SingleArtistResponse,
    ArtistsTopTracksResponse
  ];

  const artistTopSongIds = artistTracks.tracks.map((el) => el.id);
  const [colorRes, hasLikedRes] = await Promise.all([
    artist.images.length > 0
      ? fetch('/api/color?image=' + artist.images[2].url)
      : Promise.resolve(null),
    fetch(`/api/spotify/me/tracks/contains?ids=${artistTopSongIds.join(',')}`)
  ]);

  // if (!hasLikedRes.ok) {
  // throw error(hasLikedRes.status, 'Could not find liked songs');
  // }
  // if (hasliked.length !== artistTracks.tracks.length)
  //   throw error(500, 'Artist Songs and Liked Songs Length Dont match');

  // if (colorData && colorRes && colorRes.ok) {
  //   color = colorData.dominantColor;
  // }
  console.log('ARTIST REQ');

  return {
    artist,
    artistTracks: artistTracks.tracks,
    color: colorRes ? await (colorRes.json() as Promise<{ dominantColor: string }>) : null,
    hasliked: hasLikedRes.ok
      ? await (hasLikedRes.json() as Promise<boolean[]>)
      : new Array<boolean>(artistTracks.tracks.length).fill(false)
  };
};
