import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ cookies }) {
  const token = cookies.get('token');

  if (!token) {
    throw redirect(303, '/login');
  }
}
