import { redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, url }) {
  const accessToken = cookies.get('spotify_access_token');
  const refreshToken = cookies.get('spotify_refresh_token');
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + (accessToken || 'token')
    }
  });
  if (response.ok) {
    const userData: UserProfile = await response.json();
    console.log(userData);
    return {
      user: userData
    };
  }
  if (response.status === 401 && refreshToken) {
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
