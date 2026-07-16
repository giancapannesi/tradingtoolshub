# TradingToolsHub Indexing Recovery Plan

Updated: 2026-07-13

## Objective

Recover Google discovery, crawling and indexation without consuming manual URL-submission quota. Manual Search Console submissions remain reserved for DentaFund.

## What has been enhanced

| Recovery block | URLs | Work completed | Discovery state |
| --- | ---: | --- | --- |
| Priority `/best/` pages | 20 | Dedicated static HTML, stronger search intent, corrected prop-firm claims, titles and descriptions | Live, sitemap-listed, internally linked; 20 confirmed-not-indexed URLs sent to IndexNow in two batches of 10 |
| Market-data reviews | 3 | Polygon.io, Alpha Vantage and retired Refinitiv Eikon/LSEG Workspace rebuilt with current pricing and first-party sources | Live, homepage depth 1, 29–35 inbound pages each, RSS-listed, sitemap `lastmod` 2026-07-13 |
| Market-data comparisons | 2 | Alpha Vantage vs Polygon.io and Bloomberg vs LSEG Workspace rebuilt as dedicated static HTML | Live, depth 2, 14–28 inbound pages; material `lastmod` fixed to 2026-07-13 |
| Duplicate consolidation | 1 retired route | Instant-funding page permanently redirected to the no-challenge guide | Live permanent redirect; duplicate removed from sitemap |

## Enhancement queue

### P0 — keep the current recovery cluster internally consistent

1. Correct outdated pricing/status statements in the supporting Alpha Vantage API tutorial, Polygon.io pricing guide and Bloomberg-cost guide.
2. Add explicit links from those supporting articles to the updated reviews and comparisons.
3. Recheck every affected page for title length, canonical, robots, schema, source links and crawl depth.

### P1 — upgrade pages already earning search visibility

1. Bookmap alternatives cluster: `/alternatives/bookmap/`, DeepCharts and Exocharts supporting pages.
2. Bloomberg Terminal review and related high-impression comparisons.
3. OptionsStrat, InsiderFinance, Sierra Chart and Thinkorswim Scanner reviews.
4. High-impression broker comparisons including J.P. Morgan vs Robinhood and Fidelity vs J.P. Morgan.

### P2 — strengthen decision hubs

1. `/best/best-risk-management/`.
2. Trading-journal alternatives cluster.
3. Cluster-level links from `/best/` hubs to the strongest reviews, comparisons and supporting guides.

### Ongoing — futures prop-firm offering review

- Treat futures prop firms as a continuously maintained commercial cluster because challenge fees, account sizes, drawdown rules, payout terms and promotions change frequently.
- Current founder editorial order: **Tradeify first, Lucid Trading second, Alpha Futures third**. This is the working recommendation order, not a substitute for verifying current terms.
- Review these three firms against their official websites every week and review the wider futures-prop-firm set at least monthly.
- Record the source URL and checked date for every material rule, price and payout claim.
- Update rankings only when the evidence changes; do not rotate rankings merely to create freshness.
- Never publish an expired promotion, guessed affiliate URL or unverified rule. Flag material changes for editorial review before deployment.
- After an approved material update, refresh only the affected page dates, internal links and eligible discovery signals.

No broad new publishing resumes while these recovery upgrades are underway. Existing URLs with demonstrated demand take priority.

## Automatic Google discovery path

1. **Material page update:** improve the main content, evidence, title, internal links or structured data.
2. **Truthful sitemap date:** the changed canonical URL receives the date of its significant update. Unchanged URLs do not receive artificial date bumps.
3. **Crawlable internal links:** every priority URL must have ordinary HTML `<a href>` links from relevant pages; target depth is no more than two clicks from the homepage.
4. **RSS surfacing:** recently updated reviews and comparisons are included in `feed.xml` with their real update date. New articles remain part of the same feed when publishing resumes.
5. **Existing GSC sitemap:** `sitemap-index.xml` remains submitted through Search Console. The monitor records Google's download time, submitted/indexed counts, errors and warnings.
6. **Read-only URL Inspection sampling:** the scheduled 480-URL GSC inspection measures indexation across route families. It does not request indexing and does not consume manual submission slots.
7. **IndexNow for eligible engines:** only materially changed URLs that the inspection report confirms are not indexed are sent, in batches no larger than 10. URLs confirmed indexed are excluded. This improves Bing and participating-engine discovery; it is not represented as a Google submission.
8. **Daily recovery alerting:** AgentMail sends only material GSC, sitemap, crawl, RSS or automation changes. Planned deployments are silently baselined.

## Current automatic-discovery evidence

- Live sitemap: 2,120 canonical URLs.
- Live crawl graph: 2,142/2,142 pages reachable, zero orphans, zero broken internal links.
- Robots: Googlebot is allowed.
- RSS: HTTP 200, 50 items including 20 recent articles plus recently updated reviews and comparisons.
- GSC sitemap: submitted, zero reported errors and zero warnings; Google's last recorded download is still 2026-07-11 and its coverage counts remain stale.
- GSC URL Inspection sample: 1/478 successfully inspected URLs indexed on 2026-07-13. This remains the critical recovery metric.

## Measurement gates

| Gate | Metric | Response |
| --- | --- | --- |
| Discovery | Google downloads the updated sitemap after 2026-07-13 | Confirm new submitted coverage and retain truthful dates |
| Crawl | Inspection status changes from unknown/discovered to crawled | Continue cluster links and quality work; do not resubmit unchanged URLs |
| Indexing | Indexed representative sample rises materially above 1/478 | Identify which route families respond and prioritize those patterns |
| Search recovery | 7-day and 28-day impressions/clicks increase | Expand the winning clusters and improve low-CTR snippets |
| No movement | No meaningful crawl/index improvement after repeated evidence points | Audit rendered-content similarity, soft-404 signals, server logs, canonical selection and GSC Page Indexing reasons before expanding content |

## Hard rules

- Do not use Google's Indexing API for ordinary TTH pages; these pages are not eligible.
- Do not consume manual Search Console indexing quota for TTH during DentaFund's priority period.
- Do not submit pages already confirmed indexed.
- Do not fake sitemap freshness or resubmit unchanged sitemaps repeatedly.
- Do not restart the founder-paused publishing queues without explicit direction.
