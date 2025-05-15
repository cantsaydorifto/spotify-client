import { BASE_SPOTIFY_API_URL } from '$env/static/private';

export async function load({ cookies, fetch, url }) {
  const accessToken = cookies.get('spotify_access_token');
  // const refreshToken = cookies.get('spotify_refresh_token');
  console.log('APPELS');
  if (!accessToken) {
    console.log('no access token - attempting refresh');
    const res = await fetch('/api/auth/refresh');
    if (!res.ok) {
      console.log('FALIED AUTH');
      return {
        user: null
      };
    }
    console.log('SUCCESSFUL REFRESH!!!!');
  }
  const newAccessToken = cookies.get('spotify_access_token');
  const response = await fetch(`${BASE_SPOTIFY_API_URL}/me`, {
    headers: {
      Authorization: 'Bearer ' + (newAccessToken || 'token')
    }
  });
  if (response.ok) {
    const userData: UserProfile = await response.json();
    // console.log('userData');
    console.log('USER: ', {
      user: userData
    });
    return {
      user: userData
    };
  }

  console.log('USER: ', null);
  return {
    user: null
  };
}

interface UserProfile {
  display_name: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  //   images: [];
  type: string;
  uri: string;
  //   followers: { href: string[] | null; total: number };
  country: string;
  product: string;
  explicit_content: { filter_enabled: boolean; filter_locked: boolean };
  email: string;
}
