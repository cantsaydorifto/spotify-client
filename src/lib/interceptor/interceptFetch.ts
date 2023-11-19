import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export default async function interceptFetch(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
  path: string
) {
  const req = fetch(path);
  if (!browser) return req;
  const res = await req;
  if (!res.ok && res.status === 401) {
    if (!window.refreshPromise) {
      window.refreshPromise = fetch('/api/auth/refresh').finally(() => {
        window.refreshPromise = null;
      });
    }
    const refRes = await window.refreshPromise;
    if (!refRes.ok) throw error(401, 'Session expired');
    return fetch(path);
  }
  return res;
}
