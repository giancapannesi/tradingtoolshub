// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const contentRoot = new URL('./src/content/', import.meta.url);

function readDatedCollection(folder) {
  const directory = new URL(`${folder}/`, contentRoot);
  const dates = new Map();

  for (const filename of readdirSync(directory).filter((name) => name.endsWith('.json'))) {
    const record = JSON.parse(readFileSync(join(directory.pathname, filename), 'utf8'));
    const date = record.last_updated || record.published_date;
    if (record.slug && /^\d{4}-\d{2}-\d{2}$/.test(date || '')) {
      dates.set(record.slug, date);
    }
  }

  return dates;
}

const toolDates = readDatedCollection('tools');
const blogDates = readDatedCollection('blog');
const latestBlogDate = [...blogDates.values()].sort().at(-1);

function dateForPath(path) {
  const review = path.match(/^\/review\/([^/]+)\/$/);
  if (review) return toolDates.get(review[1]);

  const alternatives = path.match(/^\/alternatives\/([^/]+)\/$/);
  if (alternatives) return toolDates.get(alternatives[1]);

  const blog = path.match(/^\/blog\/([^/]+)\/$/);
  if (blog) return blogDates.get(blog[1]);

  if (path === '/blog/' || path === '/') return latestBlogDate;
}

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
      const date = dateForPath(new URL(item.url).pathname);
      if (date) item.lastmod = new Date(`${date}T00:00:00Z`);
      return item;
    }
  })],
});
