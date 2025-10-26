import { redirect, error } from '@sveltejs/kit';

export const prerender = true;

export async function load({ url, fetch, cookies }) {
  const token = cookies.get('token');

  if (!token) {
    throw redirect(307, '/login');
  }


  const page = parseInt(url.searchParams.get('page') || '1');
  const perPage = parseInt(url.searchParams.get('perPage') || '10');
  const search = url.searchParams.get('search') || '';
  const sort = url.searchParams.get('sort') || 'name';
  const order = url.searchParams.get('order') || 'asc';

  const apiUrl = new URL('http://localhost:3000/products');
  apiUrl.searchParams.append('page', page);
  apiUrl.searchParams.append('perPage', perPage);
  if (search) apiUrl.searchParams.append('search', search);
  if (sort) apiUrl.searchParams.append('sort', sort);
  if (order) apiUrl.searchParams.append('order', order);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw error(response.status, await response.text());
  }

  const data = await response.json();

  return { productsData: data };
}
