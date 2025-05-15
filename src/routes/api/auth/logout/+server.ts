import { json, redirect } from '@sveltejs/kit';

export async function POST({ cookies, request }) {
  cookies.delete('spotify_refresh_token', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });
  cookies.delete('spotify_access_token', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });
  if (request.headers.get('fromClientJs') === 'true') {
    return json({ message: 'Logout Successful' });
  }
  throw redirect(303, '/');
}
