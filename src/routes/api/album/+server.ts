import { SAAVN_API_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

interface SearchResponse {
  status: string;
  message: string;
  data: {
    results: Results[];
  };
}

interface Results {
  url: string;
  id: string;
  name: string;
  year: string;
  type: string;
  playCount: string;
  language: string;
  explicitContent: string;
  songCount: string;
}

export async function GET({ url, fetch }) {
  let searchQuery = url.searchParams.get('query');
  const trackCount = url.searchParams.get('count');
  const releaseYear = url.searchParams.get('year');
  if (!trackCount) throw error(400, { message: 'Invalid Track Count' });
  if (!searchQuery) throw error(400, { message: 'Invalid Search Parameter' });
  if (!releaseYear) throw error(400, { message: 'Invalid Year Parameter' });
  searchQuery = searchQuery.replace('•', '·');
  const res1 = await fetch(`${SAAVN_API_URL}/search/albums?query=${searchQuery}`);
  const res1Json = (await res1.json()) as SearchResponse;

  if (!res1.ok) {
    throw error(400, { message: res1Json.message });
  }
  if (res1Json.data.results.length === 0) {
    throw error(400, { message: 'Not Found' });
  }
  res1Json.data.results.forEach((el) => {
    Number(el.songCount) === Number(trackCount);
  });
  const results: Results[] = [];
  for (let i = 0; i < res1Json.data.results.length; i++) {
    if (
      Number(res1Json.data.results[i].songCount) === Number(trackCount) &&
      res1Json.data.results[i].year === releaseYear
    ) {
      results.push(res1Json.data.results[i]);
      break;
    }
  }
  if (results.length === 0) throw error(400, { message: 'Not Found' });
  const albumUrl = results[0].url;
  const res = await fetch(`${SAAVN_API_URL}/albums?link=${albumUrl}`);
  const data = (await res.json()) as SaavnApiAlbumResponse;
  if (!res.ok) {
    throw error(400, { message: data.message || 'Internal Error' });
  }
  return json({ album: data });
}
