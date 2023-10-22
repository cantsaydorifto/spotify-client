import type { RequestHandler } from './$types';
import { BASE_SPOTIFY_API_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, cookies, params, url }) => {
  const accessToken = cookies.get('spotify_access_token');

  const response = await fetch(`${BASE_SPOTIFY_API_URL}/${params.path}${url.search}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    throw error(responseJSON.error.status, responseJSON.error.message);
  }
  return json(responseJSON);
};
