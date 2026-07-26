# TTH — Backlink Target Pages

Priority list of pages we want backlinks TO. Use this when negotiating reciprocal links, drafting outreach, or when a partner asks "which page should I link to?"

Ranked by (revenue potential × current ranking momentum × acquisition ease). Data as of 2026-07-25 based on GSC pull 2026-07-17 (7-day window: 2026-07-07 to 2026-07-14) + 90-day historical winners (from `research/gsc_content_recovery_plan_2026-06-23.md`).

---

## Tier 1 — Money hubs (highest revenue value, weakest current authority)

| # | URL | Live pos | Weekly imp | Affiliate value | Why priority |
|---|-----|---------:|-----------:|-----------------|--------------|
| 1 | https://tradingtoolshub.com/prop-firms/ | 2.4 | 13 | $10–$300/referral × 32 firms | Highest revenue lever on the site |
| 2 | https://tradingtoolshub.com/best/best-prop-firms/ | (was 59.5) | — | Same as #1 | 1,474 imp/90d historic; one good link may push page 1 |
| 3 | https://tradingtoolshub.com/categories/brokers-us/ | 2.4 | 13 | $5–$200 CPA | Broker affiliates |
| 4 | https://tradingtoolshub.com/categories/charting-platforms/ | 2.4 | 13 | $10–$1,500 (TradingView annual) | Charting affiliates |
| 5 | https://tradingtoolshub.com/categories/trading-journals/ | 2.4 | 13 | 20–40% recurring | Journal affiliates |

## Tier 2 — Restore former GSC winners (proven ranking, need re-index post-May collapse)

| # | URL | Historic pos | Historic imp/90d | Recovery play |
|---|-----|-------------:|-----------------:|---------------|
| 6 | https://tradingtoolshub.com/review/polygon-io/ | 6.5 | 6,698 | Biggest single loss from May collapse |
| 7 | https://tradingtoolshub.com/blog/best-free-options-flow-tools-in-2026/ | 6.9 | 393 | The roundup Marcos wants his BSM calc in |
| 8 | https://tradingtoolshub.com/review/alpha-vantage/ | 10.1 | 342 | Pair with #6 for market-data-API cluster |
| 9 | https://tradingtoolshub.com/blog/topstep-rules-explained/ | 13.2 | 246 | Prop firm ranking cluster |
| 10 | https://tradingtoolshub.com/blog/funding-pips-pricing-guide-2026/ | 9.5 | 173 | Prop firm ranking cluster |

## Tier 3 — Currently ranking pos 2-3, small push = clicks

| # | URL | Live pos | Note |
|---|-----|---------:|------|
| 11 | https://tradingtoolshub.com/blog/funded-trading-plus-rules-explained/ | 2 | Ranking but zero-click; CTR/title issue as well |
| 12 | https://tradingtoolshub.com/blog/how-to-pass-ftmo-challenge/ | 3 | Same cluster as #9, #10 |
| 13 | https://tradingtoolshub.com/blog/maverick-trading-pricing-guide-2026/ | 6.2 | Maverick cluster: pair with #14 |
| 14 | https://tradingtoolshub.com/blog/maverick-trading-rules-explained/ | 7.6 | Maverick cluster |

---

## Usage rules

- When a partner asks where to link, pick the target that MOST fits their content topic — don't push the highest-tier target regardless.
- Prop firm partners → #1, #2, #9, #10, #11
- Broker/data partners → #3, #6, #8
- Charting/tool partners → #4
- Journal/analytics partners → #5
- Options / market-data partners → #6, #7, #8
- Always give the FULL https URL (never "TradingToolsHub" generic)
- Rebuild this file when a new GSC pull lands or when the site structure changes materially. Delete any URL from this list that has been renamed or removed.

## Source data
- GSC pull: `/srv/BusinessOps/TradingToolsHub_SEO/gsc_reports/gsc_report_2026-07-17.json`
- Historical winners: `/srv/BusinessOps/tradingtoolshub/research/gsc_content_recovery_plan_2026-06-23.md`
- Affiliate revenue map: `/srv/BusinessOps/tradingtoolshub/AFFILIATE_MASTER_GUIDE.md`
- Sitemap: `/srv/BusinessOps/tradingtoolshub/dist/sitemap-0.xml` (2,120 URLs total; 1,179 comparisons + 496 blog + 186 reviews + 186 alternatives + 40 best + 13 categories)
