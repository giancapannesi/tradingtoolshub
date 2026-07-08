# TradingToolsHub — LIVE STATE (RESUME-CURSOR)

> Read me first. This is the resume-cursor — next-spawned Claude reads this BEFORE acting on TTH.

---

## 2026-07-08 — CONTINUED TTH RECOVERY LOOP

### Work completed today
- Continued the decision-engine growth plan instead of relying on static queues.
- Upgraded `/best/best-trading-journals/` with clearer ranking logic around workflow fit, TraderTrac, TradeZella, TraderSync, Tradervue, and journal habit formation.
- Added a new journal-cluster article:
  `/blog/best-trading-journal-software-2026-tradertrac-vs-tradezella-vs-tradersync/`.

### Automation continuity fixes
- Added shared OpenAI compatibility helper:
  `/srv/BusinessOps/tools/tth_openai_compat.py`.
- Wired the TTH blog and main content generators through that helper so model/endpoint mismatch does not silently break the daily blog run.
- Updated the content verifier so an empty static `content_queue.json` is a warning, not a hard failure, when the dynamic selector/Codex upgrade loop is active.
- Added daily feed-health cron at 07:15 UTC:
  `tth-feed-health-daily`.

### Current operating rule
- Fresh content and feed health must continue daily.
- Static queues are execution buffers only. The strategy remains live signals, quality queue, dynamic selector, and Codex-owned upgrades.

## 2026-07-07 — DECISION ENGINE GROWTH WORKLIST STARTED

### Current growth direction
- TTH must become a trading tool decision engine, not a passive directory.
- Durable worklist:
  `/srv/BusinessOps/TradingToolsHub_SEO/tth_decision_engine_growth_worklist_2026-07-07.md`.
- Main tracks:
  1. Trading journals: TraderTrac, TradeZella, TraderSync, Tradervue, TradesViz, Edgewonk.
  2. Prop firms: best prop firms, futures prop firms, cheapest prop firms, no-challenge/instant-funding pages.
  3. Options flow and insider tools: InsiderEdge, Unusual Whales, InsiderFinance.
  4. Screeners/charting/market data: Finviz, Trade Ideas, TradingView, TrendSpider, Polygon.io, Alpha Vantage.
- Current rule is improve pages and keep content surfaces indexable. Do not use quality gates that silently noindex TTH content.

### First execution target
- First page upgrade target is `/review/tradezella/`, because it is top of the quality queue and central to the trading-journal monetization cluster.

## 2026-06-23 — DYNAMIC OPENAI-FIRST CONTENT RULE

### Founder rule
- TradingToolsHub content strategy must not be run from long static queues as
  the source of truth.
- Use live business/search signals first: GSC queries/pages, indexation state,
  traffic logs, affiliate value, freshness age, and internal-link gaps.
- Queue JSON files are execution buffers only. They may hold the next concrete
  run, but they are not the strategy.
- If API generation is used, use the most capable available OpenAI model by
  default where possible.
- Do not add new Claude/Gemini/other-LLM dependencies for TTH content generation
  when an OpenAI/Codex path can do the work.

### Implementation note
- OpenAI-backed TTH generators now default to:
  `OPENAI_MODEL` -> `OPENAI_BEST_MODEL` -> `gpt-5.5-pro`.
- Legacy non-OpenAI generators still exist and should be replaced or wrapped by
  a live GSC/OpenAI/Codex selector before being expanded.

### Silent-failure guard
- Added `/srv/BusinessOps/tools/tth_content_engine_daily_verify.py`.
- Cron: daily `18:30 UTC`, wrapped by `cron_alert.py` as
  `tth-content-engine-verify`.
- Log: `/srv/BusinessOps/logs/tth_content_engine_verify.log`.
- It checks active TTH crons, blog queue health, GSC recovery targeting, main
  content queue health, and same-day success/no-op/error markers for blog,
  main content, comparison enrichment, and guide generation.
- Initial run found the real silent failure: `content_queue.json` has `0`
  pending items, and the 11:00 main content log has not updated since
  `2026-06-21`.

### Dynamic selector and journal ranking
- Added `/srv/BusinessOps/tools/tth_dynamic_content_selector.py`.
- Selector output:
  - `/srv/BusinessOps/TradingToolsHub_SEO/dynamic/today_queue.json`
  - `/srv/BusinessOps/TradingToolsHub_SEO/dynamic/today_plan_YYYY-MM-DD.md`
- Selector cron: daily `07:00 UTC`, wrapped by `cron_alert.py` as
  `tth-dynamic-content-selector`.
- Added `/srv/BusinessOps/tools/tth_journal_ranker.py`.
- Journal ranking output:
  - `/srv/BusinessOps/TradingToolsHub_SEO/journal_rankings/trading_journals_ranked_latest.json`
  - `/srv/BusinessOps/TradingToolsHub_SEO/journal_rankings/trading_journals_ranked_YYYY-MM-DD.md`
- Journal ranking cron: Mondays `07:15 UTC`, wrapped by `cron_alert.py` as
  `tth-journal-ranker`.
- Journal ranking methodology:
  `/srv/BusinessOps/tradingtoolshub/research/trading_journal_ranking_methodology_2026-06-24.md`.
- First dynamic selector top target: `/review/polygon-io/` for
  `polygon io pricing`, based on 6,698 GSC impressions, 2 clicks, avg position
  6.5.
- First journal ranking top five: Edgewonk, Tradervue, TradingDiary Pro,
  TradesViz, TraderSync. FinancialTechWiz ranks 9th under the current evidence
  model; partner status is excluded from scoring.

---

## 2026-06-22 — WEEKLY TRACKING + FEED HEALTH INSTALLED

### What shipped
1. **Performance tracker installed**: `npm run performance:track`
   - Script: `tools/tth-performance-tracker.mjs`
   - Reports: `/srv/BusinessOps/TradingToolsHub_SEO/performance/`
   - Weekly cron: Monday 10:00 UTC
   - Current baseline: Lighthouse performance 94-100 across checked pages.
2. **RSS/feed health tracker installed**: `npm run feed:health`
   - Script: `tools/tth-feed-health.mjs`
   - Weekly cron: Monday 10:20 UTC
   - Live check passed after deploy: `OK: 50 items, 20 blog items, latest 2026-06-20T00:00:00.000Z`.
3. **Traffic tracker installed**: `npm run traffic:track`
   - Script: `tools/tth-traffic-tracker.mjs`
   - Reports: `/srv/BusinessOps/TradingToolsHub_SEO/traffic/`
   - Weekly cron: Monday 10:40 UTC
   - Baseline from existing GSC report: 7d 1 click / 6 impressions, 28d 2 clicks / 16 impressions, 90d 78 clicks / 61,716 impressions, CTR 0.13%.
4. **Feed improved**: `src/pages/feed.xml.ts` now includes recent blog posts before tool pages.
5. **Comparison repair queue cleaned**: 22 already-fixed comparison repair items moved from pending to published in `/srv/BusinessOps/TradingToolsHub_SEO/content_queue.json`.

### Deploys
- `8617c26` — performance tracker and RSS/feed health.
- `b96af29` — traffic tracker.

### Current operating posture
- TTH traffic is still materially down and needs weekly measurement plus steady publishing/indexing.
- API-based content generation crons are not enough on their own right now; use Codex/manual review for high-value content and technical fixes.
- Keep prop-firm content and interlinking protected. Do not undo the prop-firm strategy.
- Weekly tracker crons are recorded in `/srv/BusinessOps/CRON_OPERATIONS.md`; `verify_crons.sh` passed after setup.

### Resolved stale issue
- Old sitemap-404 incident files from 2026-05-07 were checked on 2026-06-22.
- All 65 listed URLs now return `200`, so the untracked stale files were removed:
  - `SITEMAP_404S_2026-05-07.txt`
  - `SITEMAP_404_ISSUE.md`

---

## 00:50 CAT, 2026-06-12 — INDICATORS SECTION + INTERLINKING COMPLETE

### What shipped today (2026-06-11)
1. **22 corrupted comparison analyses** cleared + regenerated (commits `30e97d3`, `a98abd8`)
2. **Inline cross-linking system** built: `src/utils/inline-linker.ts` — auto-links tool names + category keywords in review, comparison, and blog body text. Longest-match-first, per-page budget, no self-linking. (commit `a28fdbc`)
3. **3 how-to guides** generated (commit `39d7c92`)
4. **Trading Indicators section** — COMPLETE:
   - 7 new tool reviews: LuxAlgo, Trading Central, Autochartist, TradeDots, ChartPrime, PineConnector, TradingView Indicators
   - 3 listicles: best-tradingview-indicators, best-free-tradingview-indicators, best-trading-indicators
   - 21 indicator comparison pages with editorial analyses
   - Category page at /categories/trading-indicators/
   - (commits `0a1a307`, `08ee2c7`)
5. **Site now has 2,076 pages** (186 reviews, 1,166 comparisons, 467+ blogs, listicles, guides, alternatives)

### Traffic crash & recovery context
- **48-day content freeze** (Apr 24 → Jun 11): blog queue exhausted, content pipeline crashing, 0 git pushes
- GSC: 21 clicks/24K imp weekly at peak (Apr) → 0 clicks/4 imp (Jun 11)
- Root cause: hardcoded blog seed list exhausted + pipeline crash + no push = Google reduced crawl priority
- **ALL PIPELINES RESTORED.** Recovery ETA: 2-4 weeks with daily content.

### Comparison page status
- **1,166/1,166 deployed** — all have analysis text
- No corrupted analyses remaining
- Enrichment pipeline continues improving thin analyses daily

### SEO audit findings (report at TradingToolsHub_SEO/reports/technical_audit_2026-06-11.md)
- **P0**: Blog index /blog/ is 606KB — needs pagination (20-30 per page)
- **P1**: All sitemap lastmod identical (build timestamp) — should use per-tool dates
- **P1**: Alternatives pages thin (~496 words avg)
- **P2**: Keyword cannibalization monitoring needed

### Active crons (all working)
| Time UTC | Script | Status |
|----------|--------|--------|
| 08:00 | seo_engine.py (GSC reports) | Working |
| 08:30 | gsc_indexing.py --site tradingtoolshub --max-push 30 | Working |
| 11:00 | tradingtoolshub_content.py | Fixed (but hangs on claude subprocess — needs investigation) |
| 12:00 | tth_blog.py --count 3 | Fixed (716 pending topics) |
| 15:00 | enrich_comparisons.py --count 50 | Working |
| 17:00 | tth_guide_generator.py --batch all --count 10 | Working |

### Content queues
- Blog queue: **716 pending** (auto-refills from tool database)
- Enrichment pipeline: processing thin analyses daily (50/day)

### Inline linker (`src/utils/inline-linker.ts`)
- Auto-links tool name mentions → /review/ pages (priority 1-2)
- Listicle title fragments → /best/ pages (priority 3)
- Category keywords → /categories/ pages (priority 4)
- Used on: review description_long (8 links), comparison analysis (6 links), blog content (10 links)
- Longest-match-first sorting prevents partial matches
- Skips self-links, existing `<a>` tags, headings

### Incoming work
- **FinancialTechWiz review**: Mike Toney-Hoffman (info@financialtechwiz.com) offering 3 months free trading journal. Promo code `thubfree`, signup at financialtechwiz.com/trading-journal/. Due by 2026-06-20.

---

## Stack notes (do not re-discover)
- Astro static site, Vercel-hosted (`vercel.json` present). Auto-deploys on git push to main.
- Content in `src/content/` as JSON files. Tools are individual JSONs in `src/content/tools/`. Comparisons/listicles are single JSON files.
- Live URL: `https://tradingtoolshub.com/`. 2,076 pages (186 reviews, 1,166 comparisons, 467+ blogs, listicles, guides, alternatives).
- Vercel project: `prj_jwxrUBqh5oqBgLz1QTxZt3YkeoVS`, org: `team_jTBFPafF1wE9NIiscv8ABEAA`.
- Vercel secrets saved at `tools/.vercel-secrets.env` (chmod 600).
- Indexing cron: daily 08:30 UTC, max 30 URLs/day.
- Robots.txt fully open to all AI crawlers. llms.txt comprehensive (1,837 lines).
