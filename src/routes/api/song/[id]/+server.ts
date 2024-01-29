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
  primaryArtists: {
    id: string;
    name: string;
    url: string;
    image: string;
    type: string;
    role: string;
  }[];
}

export async function GET({ url, fetch, params }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let searchQuery = url.searchParams.get('query');
  const trackCount = url.searchParams.get('count');
  if (!trackCount) throw error(400, { message: 'Invalid Track Count' });
  if (!searchQuery) throw error(400, { message: 'Invalid Search Parameter' });
  searchQuery = searchQuery.replace('•', '·');
  const res1 = await fetch(
    `${SAAVN_API_URL}/search/albums?query=${encodeURIComponent(searchQuery)}`
  );
  const res1Json = (await res1.json()) as SearchResponse;
  if (!res1.ok) {
    throw error(400, { message: res1Json.message });
  }
  if (res1Json.data.results.length === 0) {
    throw error(400, { message: 'Not Found' });
  }
  const results: Results[] = [];
  for (let i = 0; i < res1Json.data.results.length; i++) {
    if (results.length > 0) {
      if (Number(results[0].explicitContent) === 1) break;
      if (
        res1Json.data.results[i].primaryArtists[0].id === results[0].primaryArtists[0].id &&
        res1Json.data.results[i].name === results[0].name &&
        Number(res1Json.data.results[i].explicitContent) === 1
      ) {
        results.unshift(res1Json.data.results[i]);
        break;
      }
    }
    if (Number(res1Json.data.results[i].songCount) === Number(trackCount) && results.length === 0) {
      results.push(res1Json.data.results[i]);
    }
  }
  if (results.length === 0) throw error(400, { message: 'Not Found' });
  const albumUrl = results[0].url;
  const res = await fetch(`${SAAVN_API_URL}/albums?link=${albumUrl}`);
  const data = (await res.json()) as SaavnApiAlbumResponse;
  if (!res.ok || !data.data.name) {
    throw error(400, { message: data.message || 'Internal Error' });
  }
  const song = data.data.songs[Number(params.id) - 1];
  return json({ song });
}
