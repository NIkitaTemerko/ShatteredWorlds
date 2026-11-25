import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

/** Isolated from Foundry vite.config (root: src, proxy, base). */
export default defineConfig({
  plugins: [svelte()],
});
