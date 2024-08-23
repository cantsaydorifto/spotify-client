// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  interface Window {
    refreshPromise: Promise<Response> | null;
  }
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface Platform {}
    interface PageData {
      user: CurrentUsersProfileResponse | null;
    }
  }
  interface CurrentUsersProfileResponse extends UserObjectPrivate {}
  interface UserObjectPrivate extends UserObjectPublic {
    birthdate: string;
    country: string;
    email: string;
    product: string;
  }
  interface UserObjectPublic {
    display_name?: string | undefined;
    external_urls: {
      spotify: string;
    };
    followers?:
      | {
          href: null;
          total: number;
        }
      | undefined;
    href: string;
    id: string;
    images?: ImageObject[] | undefined;
    type: 'user';
    uri: string;
  }
  interface ImageObject {
    height?: number | undefined;
    url: string;
    width?: number | undefined;
  }
  interface ListOfNewReleasesResponse {
    message?: string | undefined;
    albums: PagingObject<AlbumObjectSimplified>;
  }
  interface ListOfFeaturedPlaylistsResponse {
    message?: string | undefined;
    playlists: PagingObject<PlaylistObjectSimplified>;
  }
  interface ListOfUsersPlaylistsResponse extends PagingObject<PlaylistObjectSimplified> {}
  interface PagingObject<T> {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  }
  interface PlaylistObjectSimplified extends PlaylistBaseObject {
    tracks: {
      href: string;
      total: number;
    };
  }
  interface PlaylistBaseObject extends ContextObject {
    collaborative: boolean;
    description: string | null;
    id: string;
    images: ImageObject[];
    name: string;
    owner: UserObjectPublic;
    public: boolean | null;
    snapshot_id: string;
    type: 'playlist';
  }

  interface AlbumObjectSimplified extends ContextObject {
    album_group?: 'album' | 'single' | 'compilation' | 'appears_on' | undefined;
    album_type: 'album' | 'single' | 'compilation';
    artists: ArtistObjectSimplified[];
    available_markets?: string[] | undefined;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: 'year' | 'month' | 'day';
    restrictions?:
      | {
          reason: string;
        }
      | undefined;
    type: 'album';
    total_tracks: number;
  }
  interface ArtistObjectSimplified extends ContextObject {
    name: string;
    id: string;
    type: 'artist';
  }

  interface ContextObject {
    type: 'artist' | 'playlist' | 'album' | 'show' | 'episode';
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  }
  interface MultipleCategoriesResponse {
    categories: PagingObject<CategoryObject>;
  }
  interface CategoryObject {
    href: string;
    icons: ImageObject[];
    id: string;
    name: string;
  }
  interface CategoryPlaylistsResponse {
    playlists: PagingObject<PlaylistObjectSimplified>;
  }
  interface SingleAlbumResponse extends AlbumObjectFull {}
  interface SingleArtistResponse extends ArtistObjectFull {}

  interface AlbumObjectFull extends AlbumObjectSimplified {
    copyrights: {
      text: string;
      type: 'C' | 'P';
    }[];
    external_ids: {
      isrc?: string | undefined;
      ean?: string | undefined;
      upc?: string | undefined;
    };
    genres: string[];
    label: string;
    popularity: number;
    tracks: PagingObject<TrackObjectSimplified>;
  }
  interface TrackObjectSimplified {
    artists: ArtistObjectSimplified[];
    available_markets?: string[] | undefined;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_playable?: boolean | undefined;
    linked_from?:
      | {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          type: 'track';
          uri: string;
        }
      | undefined;
    restrictions?:
      | {
          reason: string;
        }
      | undefined;
    name: string;
    preview_url: string | null;
    track_number: number;
    type: 'track';
    uri: string;
  }
  interface ArtistObjectFull extends ArtistObjectSimplified {
    followers: {
      href: null;
      total: number;
    };
    genres: string[];
    images: ImageObject[];
    popularity: number;
  }
  interface ArtistsAlbumsResponse extends PagingObject<AlbumObjectSimplified> {}
  interface ArtistsTopTracksResponse {
    tracks: TrackObjectFull[];
  }
  interface ArtistsRelatedArtistsResponse {
    artists: ArtistObjectFull[];
  }
  interface AlbumSearchResponse {
    albums: PagingObject<AlbumObjectSimplified>;
  }
  interface ArtistSearchResponse {
    artists: PagingObject<ArtistObjectFull>;
  }
  interface PlaylistSearchResponse {
    playlists: PagingObject<PlaylistObjectSimplified>;
  }
  interface TrackSearchResponse {
    tracks: PagingObject<TrackObjectFull>;
  }
  interface SearchResponse
    extends Partial<ArtistSearchResponse>,
      Partial<AlbumSearchResponse>,
      Partial<TrackSearchResponse>,
      Partial<PlaylistSearchResponse> {}
  interface RecommendationsObject {
    seeds: RecommendationsSeedObject[];
    tracks: RecommendationTrackObject[];
  }
  interface RecommendationsSeedObject {
    afterFilteringSize: number;
    afterRelinkingSize: number;
    href: string;
    id: string;
    initialPoolSize: number;
    type: 'artist' | 'track' | 'genre';
  }
  interface RecommendationTrackObject extends Omit<TrackObjectFull, 'album'> {
    album: RecommendationAlbumObject;
  }
  interface RecommendationAlbumObject extends Omit<AlbumObjectSimplified, 'album_type'> {
    /**
     * The type of the album: one of “ALBUM”, “SINGLE”, or “COMPILATION”.
     * Note that this differs from the types returned by all other spotify APIs by being in all caps.
     */
    album_type: 'ALBUM' | 'SINGLE' | 'COMPILATION';
  }
  interface UsersSavedTracksResponse extends PagingObject<SavedTrackObject> {}
  interface SavedTrackObject {
    added_at: string;
    track: TrackObjectFull;
  }
  interface SaavnApiAlbumResponse {
    status: string;
    message: string | null;
    data: SaavnAlbumData;
  }
  interface SaavnApiSongResponse {
    status: string;
    message: string | null;
    data: SaavnSong[];
  }
  interface SaavnApiPlaylistResponse {
    status: string;
    message: string | null;
    data: SaavnPlaylistData;
  }
  interface SaavnApiLyricsResponse {
    status: string;
    message: string | null;
    data: {
      lyrics: string[];
      videoId: string;
    } | null;
  }
  interface SaavnApiArtistInfoResponse {
    status: string;
    message: string | null;
    data: SaavnArtistData;
  }
  interface SaavnApiArtistSongResponse {
    status: string;
    message: string | null;
    data: {
      total: number;
      lastPage: boolean;
      results: SaavnSong[];
    };
  }
  interface SaavnApiArtistAlbumResponse {
    status: string;
    message: string | null;
    data: {
      total: number;
      lastPage: boolean;
      results: SaavnHomepageALbumData[];
    };
  }
  interface SaavnApiSearchAllResponse {
    status: string;
    message: string | null;
    data: {
      songs: { results: SaavnSearchSong[] };
      albums: { results: SaavnSearchAlbums[] };
      artists: { results: SaavnSearchArtists[] };
      playlists: { results: SaavnSearchPlaylists[] };
      topQuery: { position: number; results: { type: string }[] };
    };
  }
  interface SaavnSearchPlaylists {
    id: string;
    title: string;
    image: SaavnAlbumImage[];
    url: string;
    type: string;
    language: string;
    description: string;
    position: number;
  }
  interface SaavnSearchArtists {
    id: string;
    title: string;
    image: SaavnAlbumImage[];
    url: string;
    type: string;
    description: string;
    position: number;
  }
  interface SaavnSearchAlbum {
    id: string;
    title: string;
    image: SaavnAlbumImage[];
    artist: string;
    url: string;
    type: string;
    description: string;
    position: number;
    year: string;
    songIds: string;
    language: string;
  }
  interface SaavnSearchSong {
    id: string;
    title: string;
    image: SaavnAlbumImage[];
    album: string;
    url: string;
    type: string;
    description: string;
    position: number;
    primaryArtists: string;
    singers: string;
    language: string;
  }
  interface SaavnArtistData {
    id: string;
    name: string;
    url: string;
    image: SaavnAlbumImage[];
    followerCount: string;
    fanCount: string;
    isVerified: boolean;
    dominantLanguage: string;
    dominantType: string;
    bio: string[];
    dob: string;
    fb: string;
    twitter: string;
    wiki: string;
    availableLanguages: string[];
    isRadioPresent: boolean;
  }
  interface SaavnAlbumData {
    id: string;
    name: string;
    year: string;
    releaseDate: string;
    songCount: string;
    url: string;
    primaryArtistsId: string;
    primaryArtists: string;
    featuredArtists: string[];
    artists: string[];
    image: SaavnAlbumImage[];
    songs: SaavnSong[];
  }
  interface SaavnPlaylistData {
    id: string;
    userId: string;
    name: string;
    followerCount: string;
    songCount: string;
    fanCount: string;
    username: string;
    firstname: string;
    lastname: string;
    shares: string;
    image: SaavnAlbumImage[];
    songs: SaavnSong[];
    url: string;
  }
  interface SaavnAlbumImage {
    quality: string;
    link: string;
  }

  interface SaavnSong {
    id: string;
    name: string;
    album: {
      id: string;
      name: string;
      url: string;
    };
    year: string;
    releaseDate: string;
    duration: number;
    label: string;
    primaryArtists: string;
    primaryArtistsId: string;
    featuredArtists: string;
    featuredArtistsId: string;
    explicitContent: number;
    playCount: string;
    language: string;
    hasLyrics: string;
    url: string;
    copyright: string;
    image: SaavnAlbumImage[];
    downloadUrl: SaavnDownloadUrl[];
  }

  interface SaavnDownloadUrl {
    quality: string;
    link: string;
  }
  interface SinglePlaylistResponse extends PlaylistObjectFull {}
  interface PlaylistObjectFull extends PlaylistBaseObject {
    followers: {
      href: null;
      total: number;
    };
    tracks: PagingObject<PlaylistTrackObject>;
  }
  interface PlaylistTrackResponse extends PagingObject<PlaylistTrackObject> {}
  interface PlaylistTrackObject {
    added_at: string;
    added_by: UserObjectPublic;
    is_local: boolean;
    track: TrackObjectFull | null;
  }
  interface TrackObjectFull extends TrackObjectSimplified {
    album: AlbumObjectSimplified;
    external_ids: ExternalIdObject;
    popularity: number;
    is_local?: boolean | undefined;
  }
  interface SaavnHomepageALbumData {
    id: string;
    name: string;
    year: string;
    type: string;
    playCount: number;
    language: string;
    explicitContent: string;
    url: string;
    primaryArtists: SaavnHomepageArtist[];
    artists: SaavnHomepageArtist[];
    image: SaavnAlbumImage[];
  }

  interface SaavnHomepageArtist {
    id: string;
    name: string;
    url: string;
    type: string;
    role: string;
    image: SaavnAlbumImage[];
  }

  interface SaavnHomepagePlaylistData {
    id: string;
    userId: string;
    title: string;
    subtitle: string;
    type: string;
    image: SaavnAlbumImage[];
    url: string;
    songCount: string;
    firstname: string;
    followerCount: string;
    lastUpdated: string;
    explicitContent: string;
  }
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
      id: string;
      totalTracks: number;
    };
    trackNumber: number;
    preview_url: string;
    duration_ms: number;
    needsFetch?: boolean;
  }
}

export {};
