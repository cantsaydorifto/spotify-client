// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
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
}

export {};
