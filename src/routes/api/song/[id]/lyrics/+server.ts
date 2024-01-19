import { SAAVN_API_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export async function GET({ fetch, params }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await fetch(`${SAAVN_API_URL}/metadata?query=${encodeURIComponent(params.id)}`);
  const resJson = (await res.json()) as SaavnApiLyricsResponse;
  if (!res.ok || !resJson.data) {
    throw error(400, { message: 'Lyrics Not Found' });
  }
  return json(resJson);
}
