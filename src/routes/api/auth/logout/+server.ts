import { json, redirect } from '@sveltejs/kit';

export async function POST({ cookies, request }) {
  cookies.delete('spotify_refresh_token', { path: '/' });
  cookies.delete('spotify_access_token', { path: '/' });
  if (request.headers.get('fromClientJs') === 'true') {
    return json({ message: 'Logout Successful' });
  }
  throw redirect(303, '/');
}
