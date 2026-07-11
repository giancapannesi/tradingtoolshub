import {
  getAllTools,
  getBlogPosts,
  getCategories,
  getComparisons,
  getListicles,
} from './data';

const tools = getAllTools();
const comparisons = getComparisons();
const toolSlugs = new Map(tools.map(tool => [tool.slug.toLowerCase(), tool.slug]));
const comparisonSlugs = new Set(comparisons.map(comparison => comparison.slug));
const categorySlugs = new Set(getCategories().map(category => category.slug));
const toolAliases = new Map<string, string>([
  ['atast', 'atas'],
  ['funded-trader-plus', 'funded-trading-plus'],
  ['fundednext', 'funded-next'],
  ['sierrachart', 'sierra-chart'],
  ['stock-rovers', 'stock-rover'],
  ['tastyworks', 'tastytrade'],
  ['think-or-swim', 'thinkorswim'],
  ['topstep-trader', 'topstep'],
  ['topsteptrader', 'topstep'],
]);
const pathAliases = new Map<string, string>([
  ['/blog/tradingview-setup-guide-for-beginners-from-signup-to-first-chart/', '/blog/tradingview-tutorial-for-beginners-setup-charts-and-indicators/'],
  ['/blog/tradingview-setup-guide-2026/', '/blog/tradingview-tutorial-for-beginners-setup-charts-and-indicators/'],
  ['/blog/how-to-pass-blue-guardian-challenge-step-by-step-guide-2026/', '/blog/how-to-pass-blue-guardian-challenge/'],
  ['/blog/blue-guardian-pricing-guide-2026-all-plans-costs-hidden-fees/', '/blog/blue-guardian-pricing-guide-2026/'],
  ['/blog/bookmap-pricing-guide-2026-all-plans-costs-hidden-fees/', '/blog/bookmap-pricing-guide-2026/'],
  ['/blog/how-to-pass-bulenox-challenge-step-by-step-guide-2026/', '/blog/how-to-pass-bulenox-challenge/'],
  ['/blog/bulenox-pricing-guide-2026-all-plans-costs-hidden-fees/', '/blog/bulenox-pricing-guide-2026/'],
  ['/blog/etoro-broker-review-guide-2026/', '/blog/etoro-review-2026-social-trading-features-fees-and-honest-verdict/'],
  ['/blog/jp-morgan-self-directed-investing-pricing-guide-2026-all-plans-costs-hidden-fees/', '/blog/jp-morgan-pricing-guide-2026/'],
  ['/blog/how-to-pass-maverick-trading-challenge-step-by-step-guide-2026/', '/blog/how-to-pass-maverick-trading-challenge/'],
  ['/blog/maverick-trading-pricing-guide-2026-all-plans-costs-hidden-fees/', '/blog/maverick-trading-pricing-guide-2026/'],
  ['/blog/maverick-trading-rules-explained-drawdown-targets-payouts-2026/', '/blog/maverick-trading-rules-explained/'],
  ['/blog/mzpack-pricing-guide-2026-all-plans-costs-hidden-fees/', '/blog/mzpack-pricing-guide-2026/'],
  ['/blog/ninjatrader-setup-guide-installation-to-first-trade/', '/blog/ninjatrader-setup-guide-2026/'],
  ['/blog/thinkorswim-pricing-guide-2026-all-plans-costs-hidden-fees/', '/blog/thinkorswim-pricing-guide-2026/'],
  ['/blog/thinkorswim-setup-guide-2026/', '/blog/thinkorswim-setup-guide-the-complete-walkthrough/'],
]);

const validPaths = new Set<string>([
  '/', '/about/', '/affiliate-disclosure/', '/blog/', '/featured/', '/guides/',
  '/methodology/', '/privacy/', '/prop-firms/', '/prop-firms/institutional/',
  '/prop-firms/trader-career-path/', '/reviews/', '/specials/', '/terms/',
  ...tools.flatMap(tool => [`/review/${tool.slug}/`, `/alternatives/${tool.slug}/`]),
  ...comparisons.map(comparison => `/compare/${comparison.slug}/`),
  ...getListicles().map(listicle => `/best/${listicle.slug}/`),
  ...getCategories().map(category => `/categories/${category.slug}/`),
  ...getBlogPosts().map(post => `/blog/${post.slug}/`),
  '/guides/earn2trade-consistency-rule/', '/guides/earn2trade-gauntlet-mini/',
  '/guides/earn2trade-livesim-vs-live/', '/guides/earn2trade-platforms/',
  '/guides/earn2trade-withdrawal-guide/', '/guides/trader-career-path-rules/',
]);

function normalizePath(rawHref: string) {
  if (!rawHref.startsWith('/') || rawHref.startsWith('//')) return rawHref;
  const [pathAndQuery, hash = ''] = rawHref.split('#', 2);
  const [rawPath, query = ''] = pathAndQuery.split('?', 2);
  const path = rawPath.endsWith('/') ? rawPath : `${rawPath}/`;
  const suffix = `${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;

  if (validPaths.has(path)) return `${path}${suffix}`;

  const aliasedPath = pathAliases.get(path.toLowerCase());
  if (aliasedPath && validPaths.has(aliasedPath)) return `${aliasedPath}${suffix}`;

  const segments = path.toLowerCase().split('/').filter(Boolean);
  let candidate: string | undefined;

  const canonicalToolSlug = (slug: string) => {
    const aliased = toolAliases.get(slug) || slug;
    return toolSlugs.get(aliased);
  };

  if (segments.length === 2 && ['review', 'reviews', 'tools', 'tool'].includes(segments[0])) {
    const slug = canonicalToolSlug(segments[1]);
    if (slug) candidate = `/review/${slug}/`;
  }
  if (!candidate && segments.length === 2 && ['comparison', 'comparisons'].includes(segments[0])) {
    candidate = `/compare/${segments[1]}/`;
  }
  if (!candidate && segments.length === 2 && ['prop-firms', 'brokers', 'brokers-us', 'brokers-forex'].includes(segments[0])) {
    const slug = toolSlugs.get(segments[1]);
    if (slug) candidate = `/review/${slug}/`;
  }
  if (!candidate && segments.length === 1 && categorySlugs.has(segments[0])) {
    candidate = `/categories/${segments[0]}/`;
  }
  if (!candidate && segments.length === 1 && segments[0].endsWith('-review')) {
    const slug = toolSlugs.get(segments[0].slice(0, -7));
    if (slug) candidate = `/review/${slug}/`;
  }
  if (!candidate && segments[0] === 'compare' && segments[1]?.includes('-vs-')) {
    const [left, right] = segments[1].split('-vs-', 2);
    const reversed = `${right}-vs-${left}`;
    if (comparisonSlugs.has(reversed)) candidate = `/compare/${reversed}/`;
  }

  if (candidate && validPaths.has(candidate)) return `${candidate}${suffix}`;
  return null;
}

export function repairInternalLinks(html: string) {
  const absoluteRepaired = html.replace(
    /href=(['"])https:\/\/(?:www\.)?tradingtoolshub\.com(\/[^'"]*)\1/gi,
    (attribute, quote, href) => {
      const normalized = normalizePath(href);
      if (normalized) return `href=${quote}${normalized}${quote}`;
      const escaped = href.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return `data-unresolved-internal-link="${escaped}"`;
    },
  );

  return absoluteRepaired.replace(
    /href=(['"])(\/[^'"]*)\1/gi,
    (attribute, quote, href) => {
      const normalized = normalizePath(href);
      if (normalized === href) return attribute;
      if (normalized) return `href=${quote}${normalized}${quote}`;
      const escaped = href.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return `data-unresolved-internal-link="${escaped}"`;
    },
  );
}
