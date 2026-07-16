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
const categoryAliases = new Map<string, string>([
  ['order-flow-tools', 'charting-platforms'],
  ['backtesting', 'trading-bots'],
  ['forex-brokers', 'brokers-forex'],
  ['stock-brokers', 'brokers-us'],
  ['screeners', 'stock-screeners'],
  ['options-analysis', 'options-platforms'],
]);
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
  ['the-5ers', 'the5ers'],
  ['jigsaw', 'jigsaw-trading'],
  ['ig', 'ig-markets'],
  ['apex', 'apex-trader-funding'],
  ['ninja-trader', 'ninjatrader'],
  ['public-com-review', 'public-com'],
  ['fundednext-futures-review', 'funded-next-futures'],
  ['top-one-futures-review', 'top-one-futures'],
]);
const pathAliases = new Map<string, string>([
  ['/review/koyfin/', '/review/koyfin-pro/'],
  ['/alternatives/koyfin/', '/alternatives/koyfin-pro/'],
  ['/blog/koyfin-pricing-guide-2026/', '/blog/koyfin-pro-pricing-guide-2026/'],
  ['/blog/koyfin-setup-guide-2026/', '/blog/koyfin-pro-setup-guide-2026/'],
  ['/blog/koyfin-tips-and-tricks/', '/blog/koyfin-pro-tips-and-tricks/'],
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
  '/best/prop-firm-deals/', '/guides/prop-firm-drawdown-activation-consistency/',
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

  // Static downloads and linked screenshots are not HTML routes.
  if (/\.(?:avif|gif|jpe?g|png|svg|webp|pdf|xml|txt)$/i.test(rawPath)) {
    return rawHref;
  }

  if (validPaths.has(path)) return `${path}${suffix}`;

  const aliasedPath = pathAliases.get(path.toLowerCase());
  if (aliasedPath && validPaths.has(aliasedPath)) return `${aliasedPath}${suffix}`;

  const segments = path.toLowerCase().split('/').filter(Boolean);
  let candidate: string | undefined;

  const canonicalToolSlug = (slug: string) => {
    const aliased = toolAliases.get(slug) || slug;
    return toolSlugs.get(aliased);
  };

  const category = segments[0] === 'categories' && segments[1]
    ? categoryAliases.get(segments[1])
    : undefined;
  if (category) candidate = `/categories/${category}/`;

  if (!candidate && segments[0] === 'categories' && segments[1] === 'crypto-exchanges') {
    candidate = '/reviews/';
  }

  if (!candidate && segments.length === 1 && ['compare', 'comparison', 'comparisons'].includes(segments[0])) {
    candidate = '/reviews/';
  }

  if (!candidate && segments.length === 1 && ['broker', 'brokers', 'tools', 'tool'].includes(segments[0])) {
    candidate = '/reviews/';
  }

  if (segments.length === 2 && ['review', 'reviews', 'tools', 'tool'].includes(segments[0])) {
    const slug = canonicalToolSlug(segments[1]);
    if (slug) candidate = `/review/${slug}/`;
  }
  if (!candidate && segments.length === 2 && ['comparison', 'comparisons'].includes(segments[0])) {
    const comparisonPath = `/compare/${segments[1]}/`;
    if (validPaths.has(comparisonPath)) candidate = comparisonPath;
  }
  if (!candidate && segments.length === 2 && ['prop-firms', 'brokers', 'brokers-us', 'brokers-forex'].includes(segments[0])) {
    const slug = canonicalToolSlug(segments[1]);
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

  if (!candidate && ['compare', 'comparison', 'comparisons'].includes(segments[0])) {
    candidate = '/reviews/';
  }

  if (!candidate && ['prop-firm-comparison', 'prop-firms-comparison', 'prop-firm-comparisons', 'prop-firm-pricing-comparison'].includes(segments[0])) {
    candidate = '/best/best-prop-firms/';
  }

  if (!candidate && segments[0] === 'prop-firms' && ['comparison', 'compare', 'pricing-comparison'].includes(segments[1])) {
    candidate = '/best/best-prop-firms/';
  }

  if (!candidate && segments[0] === 'prop-firms') {
    const nestedTool = [...segments].reverse().map(canonicalToolSlug).find(Boolean);
    const comparisonPath = segments[1] ? `/compare/${segments[1]}/` : '';
    candidate = nestedTool
      ? `/review/${nestedTool}/`
      : (comparisonPath && validPaths.has(comparisonPath)
        ? comparisonPath
        : '/best/best-prop-firms/');
  }

  if (!candidate && ['review', 'reviews', 'tools', 'tool', 'stock-screeners'].includes(segments[0])) {
    const nestedTool = [...segments].reverse().map(canonicalToolSlug).find(Boolean);
    candidate = nestedTool ? `/review/${nestedTool}/` : '/reviews/';
  }

  const legacyCategoryByPrefix = new Map<string, string>([
    ['trading-bots', 'trading-bots'],
    ['trading-platforms', 'charting-platforms'],
    ['platforms', 'charting-platforms'],
    ['futures-platforms', 'futures-platforms'],
    ['trading-journals', 'trading-journals'],
    ['brokers', 'brokers-us'],
    ['brokers-us', 'brokers-us'],
    ['brokers-forex', 'brokers-forex'],
    ['forex-brokers', 'brokers-forex'],
    ['stock-brokers', 'brokers-us'],
    ['trading-tools', 'news-data-feeds'],
  ]);
  if (!candidate && legacyCategoryByPrefix.has(segments[0])) {
    const nestedTool = [...segments].reverse().map(canonicalToolSlug).find(Boolean);
    candidate = nestedTool
      ? `/review/${nestedTool}/`
      : `/categories/${legacyCategoryByPrefix.get(segments[0])}/`;
  }

  if (!candidate && segments[0] === 'tradertrac') {
    const nestedTool = [...segments].reverse().map(canonicalToolSlug).find(Boolean);
    candidate = nestedTool ? `/review/${nestedTool}/` : '/reviews/';
  }

  if (!candidate && segments[0] === 'en') {
    const nestedTool = [...segments].reverse().map(canonicalToolSlug).find(Boolean);
    candidate = nestedTool ? `/review/${nestedTool}/` : '/reviews/';
  }

  if (!candidate && ['broker', 'broker-comparison', 'broker-comparison-tool', 'brokers-comparison', 'forex-brokers-comparison'].includes(segments[0])) {
    const nestedTool = [...segments].reverse().map(canonicalToolSlug).find(Boolean);
    candidate = nestedTool ? `/review/${nestedTool}/` : '/reviews/';
  }

  if (!candidate && segments[0] === 'products' && segments[1] === 'trading-journals') {
    const nestedTool = [...segments].reverse().map(canonicalToolSlug).find(Boolean);
    candidate = nestedTool ? `/review/${nestedTool}/` : '/categories/trading-journals/';
  }

  const legacyRootAliases = new Map<string, string>([
    ['alternatives', '/reviews/'],
    ['how-to-save', '/specials/'],
    ['trading-prop-firms', '/best/best-prop-firms/'],
    ['crypto-bot-comparison', '/best/best-trading-bots/'],
    ['3commas-vs', '/review/3commas/'],
    ['flowalgo-vs-lightspeed', '/review/flowalgo/'],
    ['flowalgoverus', '/review/flowalgo/'],
    ['unusual-whales-vs-flowalgo', '/review/unusual-whales/'],
    ['phidias-vs-competitors', '/review/phidias-propfirm/'],
    ['sablotrade-vs-competitors', '/review/sabio-trade/'],
    ['sabl trading-review', '/review/sabio-trade/'],
  ]);
  if (!candidate && legacyRootAliases.has(segments[0])) {
    candidate = legacyRootAliases.get(segments[0]);
  }

  if (!candidate && segments.length === 1) {
    const directTool = canonicalToolSlug(segments[0]);
    if (directTool) candidate = `/review/${directTool}/`;
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
