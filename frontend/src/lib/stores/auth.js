import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/** @type {import('svelte/store').Writable<any | null>} */
export const user = writable(null);
/** @type {import('svelte/store').Writable<string | null>} */
export const token = writable(null);

if (browser) {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  if (storedUser) {
    user.set(JSON.parse(storedUser));
  }
  if (storedToken) {
    token.set(storedToken);
  }
}

/**
 * @param {any} userInfo
 * @param {string} authToken
 */
export function setAuth(userInfo, authToken) {
  user.set(userInfo);
  token.set(authToken);
  if (browser) {
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', authToken);
    document.cookie = `user=${encodeURIComponent(JSON.stringify(userInfo))}; path=/; max-age=3600`; // Expires in 1 hour
    document.cookie = `token=${authToken}; path=/; max-age=3600`; // Expires in 1 hour
  }
}

export function clearAuth() {
  user.set(null);
  token.set(null);
  if (browser) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
