/**
 * Deterministic per-page copy variance. Given a stable seed (slug, canonical
 * URL, category), return one of N variants — same seed always maps to the
 * same variant, so builds are reproducible, but different pages get different
 * copy. Purpose: eliminate verbatim-boilerplate fingerprints across pages
 * without hand-writing hundreds of unique paragraphs.
 */
export function pickVariant<T>(seed: string, variants: readonly T[]): T {
  if (!variants.length) throw new Error('pickVariant: empty variants list');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash * 31) + seed.charCodeAt(i)) | 0;
  }
  return variants[Math.abs(hash) % variants.length];
}

// -- Affiliate disclosure — rotated site-wide (footer, page-body, review pages).
// Four variants so no verbatim string appears on more than ~25% of pages.
export const AFFILIATE_DISCLOSURE_VARIANTS: readonly string[] = [
  'Some links on this page are affiliate links. If you sign up through them, we may earn a commission at no extra cost to you — that\'s what keeps this site free.',
  'A note on links: if you buy or sign up through certain links on this page, we may earn a small commission. Reviews stay independent regardless.',
  'Full transparency — a few of the links on this page are affiliate. We earn a commission on qualifying purchases, at no additional cost to you.',
  'Heads up: some outbound links are affiliate. We may earn a commission when you sign up through them. It doesn\'t change what we cover or how we rank.',
];

// -- Footer disclosure — separate rotation from body disclosure so the two
// don't collide on any given page.
export const FOOTER_DISCLOSURE_VARIANTS: readonly string[] = [
  'Affiliate Disclosure: Certain outbound links are affiliate. Any commission we earn on qualifying signups doesn\'t change our editorial ranking.',
  'Affiliate note: We may earn a commission on qualifying signups through some outbound links. This helps fund the site; it does not influence what we cover.',
  'Disclosure: Some site links are affiliate. Commissions we earn don\'t affect which tools appear or how they\'re ranked.',
  'Note on affiliate links: We may earn a commission if you sign up through certain outbound links, at no additional cost to you.',
];

// -- Compare template H2 headings, category-specific.
export const COMPARE_EDITORIAL_HEADINGS: Record<string, string> = {
  'brokers-us': 'Broker Head-to-Head',
  'brokers-forex': 'Forex Broker Head-to-Head',
  'brokers': 'Broker Head-to-Head',
  'options-platforms': 'Options-Trading Head-to-Head',
  'futures-platforms': 'Futures-Platform Head-to-Head',
  'charting-platforms': 'Charting Head-to-Head',
  'trading-journals': 'Journal Head-to-Head',
  'stock-screeners': 'Screener Head-to-Head',
  'trading-bots': 'Bot Head-to-Head',
  'trading-indicators': 'Indicator Head-to-Head',
  'order-flow-tools': 'Order-Flow Head-to-Head',
  'news-data-feeds': 'Market-Data Head-to-Head',
  'trading-education': 'Trading-Education Head-to-Head',
  'prop-firms': 'Prop-Firm Head-to-Head',
  'risk-management': 'Risk-Management Head-to-Head',
  'ai-trading-tools': 'AI-Tools Head-to-Head',
  'trading-platforms': 'Trading-Platform Head-to-Head',
};

// -- Compare "Quick Verdict" section heading rotations.
export const QUICK_VERDICT_HEADINGS: readonly string[] = [
  'Quick Verdict',
  'Bottom Line',
  'The Short Version',
  'At-a-Glance',
];

// -- Compare "Explore More" section heading rotations.
export const EXPLORE_MORE_HEADINGS: readonly string[] = [
  'Explore More',
  'Related Pages',
  'See Also',
  'More on This',
];

// -- Compare "Also Compare" section heading rotations.
export const ALSO_COMPARE_HEADINGS: readonly string[] = [
  'Also Compare',
  'Related Comparisons',
  'Nearby Matchups',
  'You Might Also Compare',
];

// -- Review "Similar Tools" section heading rotations.
export const SIMILAR_TOOLS_HEADINGS: readonly string[] = [
  'Similar Tools',
  'Comparable Products',
  'Related Tools',
  'Alternatives Worth Checking',
];

// -- Alternatives page H2 for the list heading, per category.
export const ALTERNATIVES_LIST_HEADINGS: Record<string, string> = {
  'brokers-us': 'Top Broker Alternatives',
  'brokers-forex': 'Top Forex Broker Alternatives',
  'brokers': 'Top Broker Alternatives',
  'options-platforms': 'Top Options-Platform Alternatives',
  'futures-platforms': 'Top Futures-Platform Alternatives',
  'charting-platforms': 'Top Charting Alternatives',
  'trading-journals': 'Top Journal Alternatives',
  'stock-screeners': 'Top Screener Alternatives',
  'trading-bots': 'Top Bot Alternatives',
  'trading-indicators': 'Top Indicator Alternatives',
  'order-flow-tools': 'Top Order-Flow Alternatives',
  'news-data-feeds': 'Top Market-Data Alternatives',
  'trading-education': 'Top Trading-Education Alternatives',
  'prop-firms': 'Top Prop-Firm Alternatives',
  'risk-management': 'Top Risk-Management Alternatives',
  'ai-trading-tools': 'Top AI-Trading-Tool Alternatives',
  'trading-platforms': 'Top Trading-Platform Alternatives',
};

// -- Blog "How this article was produced" replacement paragraph rotations.
// Short, per-page-different, less machine-fingerprint than the original 60-word
// AI-disclosure paragraph. Some readers still want to know the sourcing note,
// so we don't remove it entirely — just vary it and shorten it.
export const ARTICLE_METHOD_NOTES: readonly string[] = [
  'Sources are linked inline. Prices and platform features change — verify time-sensitive details with the provider before acting.',
  'This article uses first-party sources linked in the text. Confirm current pricing and terms directly with each provider before purchasing.',
  'Product details cited here reflect the vendor\'s public documentation at time of writing. Always confirm current pricing before signing up.',
  'Where we cite a fee, feature, or plan, the source is linked. Vendor terms change — check each provider\'s site before you commit.',
];

// -- Compare "How this comparison was produced" replacement rotations.
// Same treatment as the article methodology note — keep the transparency,
// kill the 60-word verbatim paragraph.
export const COMPARE_METHOD_NOTES: readonly string[] = [
  'Numbers, fees, and platform capabilities cited here come from each vendor\'s public documentation. Confirm current pricing before you commit.',
  'This comparison uses first-party sources linked inline. Time-sensitive details (fees, promotions, plan limits) can shift — verify with each provider before signing up.',
  'Data below reflects each vendor\'s official docs at time of writing. Pricing, features, and account terms can change; check the source of truth on each provider\'s site.',
  'Fees, feature availability, and plan details come from each provider\'s current documentation. If you\'re about to act on this, confirm the specific numbers on the vendor\'s site first.',
];

// -- Compare meta-description template shapes. Each takes the same context
// object and returns a different sentence structure. Rotating the SHAPE (not
// just the words) is what breaks the "all pages have the same meta pattern"
// signature that shows up in the SERPs.
export interface CompareMetaContext {
  toolAName: string;
  toolBName: string;
  toolARating: number;
  toolBRating: number;
  toolAPrice: string;
  toolBPrice: string;
  winnerName: string;
  cheaperName: string;
  cheaperPrice: string;
  winnerEdge: string; // e.g. "options depth" or "" if none
  category: string;
}

function trimToLimit(text: string, limit = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit - 3);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[,:;\-\s]+$/, '')}...`;
}

export const COMPARE_META_TEMPLATES: readonly ((ctx: CompareMetaContext) => string)[] = [
  // Shape A — rating + price parenthetical for both, brief winner nod.
  (c) => `${c.toolAName} (${c.toolARating.toFixed(1)}★, ${c.toolAPrice}) vs ${c.toolBName} (${c.toolBRating.toFixed(1)}★, ${c.toolBPrice})${c.winnerEdge ? ` — ${c.winnerName} wins on ${c.winnerEdge}.` : '.'}`,
  // Shape B — plain sentence with cheaper/winner call-outs.
  (c) => c.winnerName === c.cheaperName
    ? `${c.toolAName} vs ${c.toolBName}: ${c.winnerName} leads on rating and cost (${c.cheaperPrice}). Feature-by-feature breakdown inside.`
    : `${c.toolAName} vs ${c.toolBName}: ${c.winnerName} rates higher, ${c.cheaperName} costs less (${c.cheaperPrice}). Feature breakdown inside.`,
  // Shape C — question-oriented CTR hook.
  (c) => `Which is better, ${c.toolAName} or ${c.toolBName}? Fees, features, ratings, and which trader profile each is best for — side by side.`,
  // Shape D — pricing-lead framing.
  (c) => `${c.toolAName} costs ${c.toolAPrice}; ${c.toolBName} costs ${c.toolBPrice}. Compare their feature sets, ratings, and best-fit use cases before you choose.`,
  // Shape E — winner-lead framing.
  (c) => c.winnerEdge
    ? `${c.winnerName} beats the other on ${c.winnerEdge}; the loser wins on cost or scope. Full ${c.toolAName} vs ${c.toolBName} comparison inside.`
    : `${c.toolAName} vs ${c.toolBName}: features, pricing, and ratings compared. See which fits your setup.`,
  // Shape F — practical / plain-English.
  (c) => `Deciding between ${c.toolAName} and ${c.toolBName}? Side-by-side pricing (${c.toolAPrice} vs ${c.toolBPrice}), ratings, and which one suits your trading style.`,
];

export function buildCompareMeta(seed: string, ctx: CompareMetaContext): string {
  const shape = pickVariant(seed + ':meta', COMPARE_META_TEMPLATES);
  return trimToLimit(shape(ctx));
}

// -- FAQ question-set templates for compare pages. Rotating the whole SET
// varies which 3 questions appear + their phrasing. Kills the
// "every compare page has these exact three questions in this order" pattern.
export interface FaqContext {
  toolAName: string;
  toolBName: string;
  toolADescriptionShort: string;
  toolBDescriptionShort: string;
  toolAPricing: string;
  toolBPricing: string;
  cheaperName: string;
  cheaperText: string;
  winnerName: string;
  winnerRating: number;
  loserName: string;
  loserRating: number;
  ratingsEqual: boolean;
  pricingAnswer: string;
}

export const COMPARE_FAQ_TEMPLATES: readonly ((c: FaqContext) => { name: string; text: string }[])[] = [
  // Set A — difference / cheaper / rated (the classic).
  (c) => [
    { name: `What is the difference between ${c.toolAName} and ${c.toolBName}?`,
      text: `${c.toolAName} is ${c.toolADescriptionShort} ${c.toolBName} is ${c.toolBDescriptionShort} The main differences are features, pricing, and audience — see the head-to-head above for the specific decision points.` },
    { name: `Which is cheaper, ${c.toolAName} or ${c.toolBName}?`, text: c.pricingAnswer },
    { name: `Which has a higher rating, ${c.toolAName} or ${c.toolBName}?`,
      text: c.ratingsEqual
        ? `${c.toolAName} and ${c.toolBName} carry the same TradingToolsHub rating of ${c.winnerRating.toFixed(1)}/5. The right pick depends on your workflow, not the overall score.`
        : `${c.winnerName} is rated ${c.winnerRating.toFixed(1)}/5, higher than ${c.loserName} at ${c.loserRating.toFixed(1)}/5. Ratings weigh features, ease of use, value, reliability, and support.` },
  ],
  // Set B — better-for / cheaper / who-should-choose.
  (c) => [
    { name: `Which is better for most traders, ${c.toolAName} or ${c.toolBName}?`,
      text: `${c.toolAName} is ${c.toolADescriptionShort} ${c.toolBName} is ${c.toolBDescriptionShort} There isn't a single winner — the head-to-head breakdown above shows which fits which trader profile.` },
    { name: `Is ${c.cheaperName} the cheaper option?`, text: c.pricingAnswer },
    { name: `Who should choose ${c.winnerName} over ${c.loserName}?`,
      text: c.ratingsEqual
        ? `Both platforms rate at ${c.winnerRating.toFixed(1)}/5. Choose ${c.winnerName} if its feature set matches your workflow better; otherwise ${c.loserName} may be a cleaner fit.`
        : `${c.winnerName} rates higher (${c.winnerRating.toFixed(1)}/5 vs ${c.loserRating.toFixed(1)}/5) and is the stronger pick when features and reliability outweigh price. If cost matters more than feature depth, ${c.loserName} is still worth a look.` },
  ],
  // Set C — pricing-lead + free-tier + fit.
  (c) => [
    { name: `How much does ${c.toolAName} cost compared to ${c.toolBName}?`, text: c.pricingAnswer },
    { name: `Does ${c.toolAName} or ${c.toolBName} have a free plan?`,
      text: `${c.toolAName} pricing is ${c.toolAPricing}; ${c.toolBName} pricing is ${c.toolBPricing}. Check each provider's site for the current free tier limits before signing up.` },
    { name: `Which platform is right for me?`,
      text: `${c.toolAName} is ${c.toolADescriptionShort} ${c.toolBName} is ${c.toolBDescriptionShort} The comparison sections above walk through fit by use case.` },
  ],
  // Set D — feature-lead + ratings + practical.
  (c) => [
    { name: `What are the main feature differences between ${c.toolAName} and ${c.toolBName}?`,
      text: `${c.toolAName} is ${c.toolADescriptionShort} ${c.toolBName} is ${c.toolBDescriptionShort} The feature comparison table on this page lays out every capability side by side.` },
    { name: `Which is rated higher on TradingToolsHub?`,
      text: c.ratingsEqual
        ? `Both are rated ${c.winnerRating.toFixed(1)}/5. Ratings tie, so pick by workflow fit, not by score.`
        : `${c.winnerName} sits at ${c.winnerRating.toFixed(1)}/5, ${c.loserName} at ${c.loserRating.toFixed(1)}/5. The gap comes mostly from ease-of-use, feature depth, and value.` },
    { name: `Should I try ${c.toolAName} or ${c.toolBName} first?`, text: c.pricingAnswer },
  ],
];

export function buildCompareFaq(seed: string, ctx: FaqContext) {
  return pickVariant(seed + ':faq', COMPARE_FAQ_TEMPLATES)(ctx);
}

// -- JSON-LD schema @type rotation for compare pages. The default was
// Article + BreadcrumbList + FAQPage on every page. Rotating the Article
// type between Article / Review / TechArticle removes the "same three schema
// types in the same order" pattern.
export const COMPARE_ARTICLE_TYPES: readonly string[] = [
  'Article',
  'Review',
  'TechArticle',
  'Article',
];

// -- Alternatives meta-description template shapes. 187 pages previously
// shared the same sentence structure ("Best X alternatives for 2026: A, B, C.
// TopRated leads. Cheapest is Y.") — rotating shape breaks the pattern.
export interface AltMetaContext {
  toolName: string;
  altNames: string;
  topRatedName: string;
  topRatedRating: number;
  cheapestName: string;
  cheapestLabel: string;
  altCount: number;
}

export const ALT_META_TEMPLATES: readonly ((c: AltMetaContext) => string)[] = [
  // Shape A — original list + leader + cheapest.
  (c) => `Best ${c.toolName} alternatives for 2026: ${c.altNames}, and more. ${c.topRatedName} leads at ${c.topRatedRating.toFixed(1)}★. Cheapest: ${c.cheapestName} (${c.cheapestLabel}). Side-by-side breakdown.`,
  // Shape B — top-rated lead framing.
  (c) => `${c.altCount} strong alternatives to ${c.toolName}, ranked. ${c.topRatedName} sits at ${c.topRatedRating.toFixed(1)}★; ${c.cheapestName} is the cheapest at ${c.cheapestLabel}. Fees, features, ratings compared.`,
  // Shape C — practical / decision-oriented.
  (c) => `Looking for a ${c.toolName} alternative? The ${c.altCount} strongest options include ${c.altNames}. Compare pricing (from ${c.cheapestLabel}), ratings, and best-fit use cases.`,
  // Shape D — cheapest-lead framing.
  (c) => `${c.cheapestName} is the cheapest ${c.toolName} alternative at ${c.cheapestLabel}; ${c.topRatedName} rates highest at ${c.topRatedRating.toFixed(1)}★. See all ${c.altCount} options compared side-by-side.`,
  // Shape E — question hook.
  (c) => `Is ${c.toolName} not right for you? ${c.altCount} alternatives with side-by-side pricing, ratings, and pros/cons — ${c.topRatedName}, ${c.cheapestName}, and more.`,
];

export function buildAltMeta(seed: string, ctx: AltMetaContext): string {
  const shape = pickVariant(seed + ':altmeta', ALT_META_TEMPLATES);
  return trimToLimit(shape(ctx));
}

// -- Category-specific "Feature Comparison" section heading. The default
// "Feature Comparison" H2 repeated on every compare page — replace with a
// category-native phrasing so H2 fingerprint is broken for this section too.
export const FEATURE_COMPARISON_HEADINGS: Record<string, string> = {
  'brokers-us': 'Fee & Feature Breakdown',
  'brokers-forex': 'Spread, Regulation & Feature Breakdown',
  'brokers': 'Fee & Feature Breakdown',
  'options-platforms': 'Options Feature & Cost Breakdown',
  'futures-platforms': 'Contract & Feature Breakdown',
  'charting-platforms': 'Chart & Indicator Breakdown',
  'trading-journals': 'Workflow & Import Feature Breakdown',
  'stock-screeners': 'Filter & Data Feature Breakdown',
  'trading-bots': 'Bot Strategy & Exchange Breakdown',
  'trading-indicators': 'Indicator Suite Breakdown',
  'order-flow-tools': 'Flow Data & Alert Breakdown',
  'news-data-feeds': 'Data Coverage & Delivery Breakdown',
  'trading-education': 'Curriculum & Access Breakdown',
  'prop-firms': 'Rules, Payout & Fee Breakdown',
  'risk-management': 'Risk Controls & Feature Breakdown',
  'ai-trading-tools': 'AI Feature & Data Breakdown',
  'trading-platforms': 'Platform Feature Breakdown',
};

// -- Section order preset for compare pages. Some categories benefit from
// fees/data table BEFORE the editorial (broker-buyers scan tables); others
// benefit from editorial FIRST (journal-buyers want the fit story). Varying
// the order per category kills the "every compare page has sections in the
// exact same sequence" structural fingerprint.
export type CompareSectionKey =
  | 'quickVerdict'
  | 'headToHead'
  | 'editorial'
  | 'featureComparison'
  | 'prosConsA'
  | 'prosConsB';

const TABLE_FIRST_CATEGORIES = new Set([
  'brokers-us', 'brokers-forex', 'brokers', 'prop-firms',
  'options-platforms', 'futures-platforms', 'news-data-feeds',
]);

export function getCompareSectionOrder(category: string | undefined): CompareSectionKey[] {
  if (category && TABLE_FIRST_CATEGORIES.has(category)) {
    // Fee/data-table categories: verdict → cards → table → editorial → pros/cons.
    return ['quickVerdict', 'headToHead', 'featureComparison', 'editorial', 'prosConsA', 'prosConsB'];
  }
  // Story-first categories: verdict → cards → editorial → table → pros/cons.
  return ['quickVerdict', 'headToHead', 'editorial', 'featureComparison', 'prosConsA', 'prosConsB'];
}
