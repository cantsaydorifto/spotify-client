import { BASE_SPOTIFY_API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, url }) {
  const accessToken = cookies.get('spotify_access_token');
  const refreshToken = cookies.get('spotify_refresh_token');
  if (!accessToken) {
    return {
      user: null
    };
  }
  const response = await fetch(`${BASE_SPOTIFY_API_URL}/me`, {
    headers: {
      Authorization: 'Bearer ' + (accessToken || 'token')
    }
  });
  if (response.ok) {
    const userData: UserProfile = await response.json();
    console.log('userData');
    return {
      user: userData
    };
  }
  console.log('refreshing token outside block');
  if (response.status === 401 && refreshToken) {
    console.log('refreshing token');
    const res = await fetch('/api/auth/refresh');
    if (res.ok) {
      throw redirect(307, url.pathname);
    }
  }
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
