import { CLIENT_ID } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies, fetch }) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: cookies.get('spotify_refresh_token') || ''
    })
  });
  // console.log('Inside GET');
  const resJson = await response.json();
  if (!response.ok) {
    // console.log('Inside response.ok block');
    // console.log(resJson);
    // console.log({
    //   refresh: cookies.get('spotify_refresh_token'),
    //   access: cookies.get('spotify_access_token')
    // });
    cookies.delete('spotify_refresh_token', { path: '/' });
    cookies.delete('spotify_access_token', { path: '/' });
    throw error(401, { message: resJson.error_description || 'Error' });
  }
  cookies.set('spotify_refresh_token', resJson.refresh_token, { path: '/' });
  cookies.set('spotify_access_token', resJson.access_token, { path: '/' });
  console.log('-------------------------');
  // console.log(resJson);
  return json({
    message: 'Tokens Refreshed'
  });
}
