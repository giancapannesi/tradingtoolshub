/**
 * Inline linker — auto-links tool mentions and category keywords to internal pages.
 * Runs at build time in Astro templates. Longest-match-first, per-page budget,
 * no self-linking, no double-linking.
 */

import { getAllTools, getListicles, getBlogPosts } from './data';

interface LinkMapping {
  phrase: string;
  url: string;
  priority: number; // lower = linked first
}

let _mappings: LinkMapping[] | null = null;

function buildMappings(): LinkMapping[] {
  if (_mappings) return _mappings;

  const tools = getAllTools();
  const listicles = getListicles();
  const blogPosts = getBlogPosts();
  const mappings: LinkMapping[] = [];

  // Tool name → review page (priority 1)
  for (const t of tools) {
    mappings.push({ phrase: t.name, url: `/review/${t.slug}/`, priority: 1 });
    // Also match common short names (e.g. "TradingView" from "TradingView by TradingView Inc")
    const shortName = t.name.split(' (')[0].split(' by ')[0].trim();
    if (shortName !== t.name && shortName.length >= 4) {
      mappings.push({ phrase: shortName, url: `/review/${t.slug}/`, priority: 2 });
    }
  }

  // Listicle titles → best pages (priority 3)
  for (const l of listicles) {
    mappings.push({ phrase: l.title.replace(/ in \d{4}.*$/, '').replace(/ — .*$/, ''), url: `/best/${l.slug}/`, priority: 3 });
  }

  // Article title phrases → blog pages (priority 4)
  for (const post of blogPosts) {
    const titlePhrase = post.title
      .replace(/\b(2026|2025)\b/g, '')
      .replace(/:.*$/, '')
      .replace(/ — .*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (titlePhrase.length >= 16 && titlePhrase.split(/\s+/).length >= 3) {
      mappings.push({ phrase: titlePhrase, url: `/blog/${post.slug}/`, priority: 4 });
    }
  }

  // Category keywords → category pages (priority 5)
  const categoryPhrases: Record<string, string> = {
    'prop firms': '/prop-firms/',
    'prop trading firms': '/prop-firms/',
    'trading bots': '/categories/trading-bots/',
    'charting platforms': '/categories/charting-platforms/',
    'order flow tools': '/categories/order-flow-tools/',
    'trading journals': '/categories/trading-journals/',
    'futures platforms': '/categories/futures-platforms/',
    'options platforms': '/categories/options-platforms/',
    'forex brokers': '/categories/brokers-forex/',
    'stock brokers': '/categories/brokers-us/',
    'risk management': '/categories/risk-management/',
    'trading education': '/categories/trading-education/',
    'news and data feeds': '/categories/news-data-feeds/',
    'backtesting platforms': '/categories/backtesting/',
    'crypto exchanges': '/categories/crypto-exchanges/',
  };
  for (const [phrase, url] of Object.entries(categoryPhrases)) {
    mappings.push({ phrase, url, priority: 4 });
  }

  // Sort: longest phrase first (prevents partial matches), then by priority
  mappings.sort((a, b) => b.phrase.length - a.phrase.length || a.priority - b.priority);

  _mappings = mappings;
  return mappings;
}

/**
 * Inject internal links into HTML content.
 * @param html - The HTML string to process
 * @param currentSlug - Current page's tool slug (to prevent self-linking)
 * @param maxLinks - Maximum links to inject per call (default 8)
 */
export function injectLinks(html: string, currentSlug: string, maxLinks: number = 8): string {
  const mappings = buildMappings();
  const usedUrls = new Set<string>();
  const usedPhrases = new Set<string>();
  let linkCount = 0;

  // Don't link inside existing <a> tags, <h2>/<h3> tags, or HTML attributes
  // Split on HTML tags to only process text nodes
  const parts = html.split(/(<[^>]+>)/);
  let insideLink = false;
  let insideHeading = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Track tag state
    if (part.startsWith('<')) {
      if (part.match(/^<a[\s>]/i)) insideLink = true;
      if (part.match(/^<\/a>/i)) insideLink = false;
      if (part.match(/^<h[1-3][\s>]/i)) insideHeading = true;
      if (part.match(/^<\/h[1-3]>/i)) insideHeading = false;
      continue;
    }

    // Skip text inside links or headings
    if (insideLink || insideHeading) continue;
    if (linkCount >= maxLinks) break;

    // Try each mapping against this text node
    for (const mapping of mappings) {
      if (linkCount >= maxLinks) break;
      if (usedUrls.has(mapping.url)) continue;
      if (usedPhrases.has(mapping.phrase.toLowerCase())) continue;

      // Skip self-links
      if (mapping.url.includes(currentSlug)) continue;

      // Case-insensitive word-boundary match
      const escaped = mapping.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      const match = parts[i].match(regex);

      if (match) {
        const linked = `<a href="${mapping.url}" class="text-primary hover:text-primary-hover transition-colors">${match[0]}</a>`;
        parts[i] = parts[i].replace(regex, linked);
        usedUrls.add(mapping.url);
        usedPhrases.add(mapping.phrase.toLowerCase());
        linkCount++;
        break; // Move to next text node after one replacement per node
      }
    }
  }

  return parts.join('');
}
