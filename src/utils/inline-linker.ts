/**
 * Inline linker — auto-links tool mentions and category keywords to internal pages.
 * Runs at build time in Astro templates. Longest-match-first, per-page budget,
 * no self-linking, no double-linking.
 */

import { getAllTools, getComparisons, getListicles } from './data';

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

  // Category keywords → category pages (priority 4)
  const categoryPhrases: Record<string, string> = {
    'prop firms': '/prop-firms/',
    'prop trading firms': '/prop-firms/',
    'trading bots': '/category/trading-bots/',
    'charting platforms': '/category/charting-platforms/',
    'order flow tools': '/category/order-flow-tools/',
    'trading journals': '/category/trading-journals/',
    'futures platforms': '/category/futures-platforms/',
    'options platforms': '/category/options-platforms/',
    'forex brokers': '/category/brokers-forex/',
    'stock brokers': '/category/brokers-us/',
    'risk management': '/category/risk-management/',
    'trading education': '/category/trading-education/',
    'news and data feeds': '/category/news-data-feeds/',
    'backtesting platforms': '/category/backtesting/',
    'crypto exchanges': '/category/crypto-exchanges/',
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
