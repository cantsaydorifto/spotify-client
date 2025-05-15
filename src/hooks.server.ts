import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  console.log(`[${new Date().toISOString()}] ${event.request.method} ${event.url.pathname}`);
  const response = await resolve(event);
  console.log(`Response: ${response.status}`);

  // Optional: log response status

  return response;
};
