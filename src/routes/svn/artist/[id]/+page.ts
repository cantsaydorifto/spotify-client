import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch('/api/saavn/artists?id=' + params.id);
  if (!res.ok) throw error(res.status, 'Artist not found');
  const resJson = (await res.json()) as SaavnApiArtistInfoResponse;
  const artist = resJson.data;
  const resArtistSong = await fetch('/api/saavn/artists/' + params.id + '/songs');
  const resArtistSongJson = (await resArtistSong.json()) as SaavnApiArtistSongResponse;
  const resArtistAlbums = await fetch('/api/saavn/artists/' + params.id + '/albums');
  const resArtistAlbumsJson = (await resArtistAlbums.json()) as SaavnApiArtistAlbumResponse;
  const tracks = resArtistSongJson.data.results;
  const albums = resArtistAlbumsJson.data.results;
  let color: string | null = null;
  if (artist.image.length > 0) {
    const colorRes = await fetch('/api/color?image=' + artist.image[0].link);
    if (colorRes.ok) {
      const { dominantColor } = (await colorRes.json()) as { dominantColor: string };
      color = dominantColor;
    }
  }
  return {
    artist,
    color,
    albums,
    tracks: tracks.map((el) => convertSaavnSongToTrackObjectFull(el))
  };
};

function convertSaavnSongToTrackObjectFull(
  saavnSong: SaavnSong
): TrackObjectFull & { link?: string } {
  return {
    artists: convertArtistsStringToObjectArray(
      saavnSong.primaryArtists,
      saavnSong.primaryArtistsId
    ),
    popularity: 50,
    external_ids: {},
    album: {
      album_type: 'album',
      id: saavnSong.album.id,
      name: saavnSong.album.name,
      artists: convertArtistsStringToObjectArray(
        saavnSong.primaryArtists,
        saavnSong.primaryArtistsId
      ),
      images: saavnSong.image.map((el) => ({ url: el.link })),
      release_date: saavnSong.releaseDate,
      release_date_precision: 'day',
      total_tracks: 1,
      type: 'album',
      uri: '',
      href: '',
      external_urls: { spotify: '' }
    },
    disc_number: 1,
    duration_ms: saavnSong.duration * 1000,
    explicit: !!saavnSong.explicitContent,
    external_urls: { spotify: '' },
    href: '',
    id: saavnSong.id,
    name: saavnSong.name,
    preview_url: null,
    track_number: 1,
    type: 'track',
    uri: '',
    link: saavnSong.downloadUrl[saavnSong.downloadUrl.length - 1].link
  };
}

function convertArtistsStringToObjectArray(artists: string, artistsId: string) {
  const artistNames = artists.split(', ');
  const artistIds = artistsId.split(', ');

  return artistNames.map((name, index) => ({
    name,
    href: artistIds[index],
    id: artistIds[index],
    external_urls: { spotify: '' },
    type: 'artist' as const,
    uri: `/svn/artist/${artistIds[index]}`
  }));
}
