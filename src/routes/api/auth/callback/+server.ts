import { error, json, redirect } from '@sveltejs/kit';
import { BASE_URL, CLIENT_ID } from '$env/static/private';

export async function GET({ url, cookies, fetch }) {
  const code = url.searchParams.get('code') || null;
  const state = url.searchParams.get('state') || null;
  const storedState = cookies.get('spotify_auth_state') || null;
  const storedCodeVerifier = cookies.get('spotify_auth_challengeVerifier') || null;

  if (!state || state !== storedState) {
    throw error(400, { message: 'States dont match' });
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code || '',
    redirect_uri: `${BASE_URL}/api/auth/callback`,
    client_id: CLIENT_ID,
    code_verifier: storedCodeVerifier || ''
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  });
  const resJson = await response.json();
  if (!response.ok) {
    throw error(400, { message: resJson.error_description || 'Error' });
  }
  console.log(resJson);
  cookies.delete('spotify_auth_state');
  cookies.delete('spotify_auth_challengeVerifier');
  cookies.set('spotify_refresh_token', resJson.refresh_token, {
    path: '/'
  });
  cookies.set('spotify_access_token', resJson.access_token, {
    path: '/'
  });
  throw redirect(303, '/');
}
