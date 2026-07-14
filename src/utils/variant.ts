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
