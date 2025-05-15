import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  console.log(`[${new Date().toISOString()}] ${event.request.method} ${event.url.pathname}`);
  const response = await resolve(event);
  // log response status
  console.log(`Response: ${response.status}`);

  return response;
};
