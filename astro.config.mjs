// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tradingtoolshub.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap({
    filter(page) {
      const url = new URL(page);
      const path = url.pathname;
      if (/^\/blog\/\d+\/$/.test(path)) return false;
      if (path === '/best/best-trading-indicators/' || path === '/best/best-free-tradingview-indicators/') return false;
      return true;
    },
    serialize(item) {
      return item;
    }
  })],
});
