import { redirect } from '@sveltejs/kit';
import { BASE_URL, CLIENT_ID } from '$env/static/private';
import { createChallengeAndVerifier } from './codeVerifier';

const scope =
  'ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private';

export async function GET({ cookies }) {
  const { codeChallenge, codeVerifier } = createChallengeAndVerifier();
  const state = generateRandomString(16);
  cookies.set('spotify_auth_state', state);
  cookies.set('spotify_auth_challengeVerifier', codeVerifier);
  const args = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: `${BASE_URL}/api/auth/callback`,
    state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
  });

  throw redirect(307, `https://accounts.spotify.com/authorize?${args}`);
}

function generateRandomString(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
