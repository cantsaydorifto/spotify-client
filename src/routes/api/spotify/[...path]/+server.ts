import type { RequestHandler } from './$types';
import { BASE_SPOTIFY_API_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, cookies, params, url, setHeaders }) => {
  const accessToken = cookies.get('spotify_access_token');

  const response = await fetch(`${BASE_SPOTIFY_API_URL}/${params.path}${url.search}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const responseJSON = await response.json();

  if (!response.ok) {
    throw error(responseJSON.error.status, responseJSON.error.message);
  }

  const cacheControl = response.headers.get('cache-control');
  if (cacheControl) {
    setHeaders({
      'cache-control': cacheControl
    });
  }
  return json(responseJSON);
};

export const PUT: RequestHandler = async ({ fetch, params, cookies, url }) => {
  const accessToken = cookies.get('spotify_access_token');
  const response = await fetch(`${BASE_SPOTIFY_API_URL}/${params.path}${url.search}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify({ ids: [url.searchParams.get('id') || ''] })
  });
  if (!response.ok) {
    throw error(response.status, 'Error Liking the track');
  }
  return json({
    message: 'Track Saved'
  });
};

export const DELETE: RequestHandler = async ({ fetch, params, cookies, url }) => {
  const accessToken = cookies.get('spotify_access_token');
  console.log('DELETE');
  const response = await fetch(`${BASE_SPOTIFY_API_URL}/${params.path}${url.search}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
    body: JSON.stringify({ ids: [url.searchParams.get('id') || ''] })
  });
  if (!response.ok) {
    throw error(response.status, 'Error Removing the track from library');
  }
  return json({
    message: 'Track Removed From Library'
  });
};
