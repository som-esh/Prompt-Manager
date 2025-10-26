import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const token = event.cookies.get('token');

  if (event.url.pathname.startsWith('/prompts') || event.url.pathname.startsWith('/reports')) {
    if (!token) {
      throw redirect(303, '/login');
    }
  }

  const response = await resolve(event);
  return response;
}
