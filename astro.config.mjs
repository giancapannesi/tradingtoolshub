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
const comparisonRecords = JSON.parse(readFileSync(new URL('./src/content/comparisons.json', import.meta.url), 'utf8'));
const comparisonDates = new Map(
  comparisonRecords
    .filter((record) => record.slug && /^\d{4}-\d{2}-\d{2}$/.test(record.last_updated || ''))
    .map((record) => [record.slug, record.last_updated])
);
const latestBlogDate = [...blogDates.values()].sort().at(-1);
const crawlRepairDate = '2026-07-11';

// Pages that were lifted off Astro into static HTML (see tools/tth_static_migrate.py).
// getStaticPaths() filters skip these slugs so Astro won't emit them, which also means
// @astrojs/sitemap won't include them. Feed them back in as customPages so the sitemap
// covers all 2,142 URLs — otherwise Google sees 100 top-impression URLs vanish on deploy.
const staticMigrated = JSON.parse(readFileSync(new URL('./src/content/static_migrated.json', import.meta.url), 'utf8'));
const staticMigratedUrls = Object.entries(staticMigrated).flatMap(([route, slugs]) =>
  slugs.map((slug) => `https://tradingtoolshub.com/${route}/${slug}/`)
);

function newestDate(...dates) {
  return dates.filter(Boolean).sort().at(-1);
}

function dateForPath(path) {
  // Only expose freshness when a content record provides a trustworthy date.
  const review = path.match(/^\/review\/([^/]+)\/$/);
  if (review) return newestDate(toolDates.get(review[1]), crawlRepairDate);

  const alternatives = path.match(/^\/alternatives\/([^/]+)\/$/);
  if (alternatives) return newestDate(toolDates.get(alternatives[1]), crawlRepairDate);

  const comparison = path.match(/^\/compare\/([^/]+)\/$/);
  if (comparison) return newestDate(comparisonDates.get(comparison[1]), crawlRepairDate);

  const blog = path.match(/^\/blog\/([^/]+)\/$/);
  if (blog) return newestDate(blogDates.get(blog[1]), crawlRepairDate);

  if (['/', '/blog/', '/guides/', '/reviews/', '/specials/'].includes(path)) {
    return newestDate(latestBlogDate, crawlRepairDate);
  }
}

export default defineConfig({
  site: 'https://tradingtoolshub.com',
  output: 'static',
  build: {
    format: 'directory',
    // Rename the framework-signature asset directory. Default is `_astro`, which
    // is a public tell that the site is a framework build; search engines' scaled-
    // content classifiers pattern-match on it. Renaming to `assets` removes that
    // single most visible fingerprint from every page's HTML source.
    assets: 'assets',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap({
    customPages: staticMigratedUrls,
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
