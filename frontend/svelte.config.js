// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import postcss from 'postcss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess({
		postcss: true
	}),

	kit: {
		adapter: adapter()
	}
};

export default config;
