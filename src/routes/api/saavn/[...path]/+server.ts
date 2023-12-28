import type { RequestHandler } from './$types';
import { SAAVN_API_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, params, url }) => {
  const response = await fetch(`${SAAVN_API_URL}/${params.path}${url.search}`);
  const responseJSON = await response.json();
  if (!response.ok) {
    // console.log(responseJSON);
    throw error(400, responseJSON.message);
  }
  return json(responseJSON);
};
