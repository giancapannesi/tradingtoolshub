# TradingToolsHub — LIVE STATE (RESUME-CURSOR)

> Read me first. This is the resume-cursor — next-spawned Claude reads this BEFORE acting on TTH.

---

## 2026-07-21 — BATCH 001 STATIC REVIEW RECOVERY

### Phase-one status

- Active branch: `agent/static-html-batch-01`.
- Broad content publishing/generation remains paused during TTH quality recovery. RSS/feed serving is fine; do not disable `/feed.xml`.
- Batch 001 contains 20 review pages. All 20 now have isolated static review pages rather than relying on the quarantined shared-outline output.
- First nine review pages were committed, pushed and deployed to production in `bb595eded544f8fd3519bb410a61842fdfd4a642`: `/review/tradeify/`, `/review/lucid-trading/`, `/review/alpha-futures/`, `/review/edgewonk/`, `/review/trademetria/`, `/review/tradersync/`, `/review/funded-trading-plus/`, `/review/city-traders-imperium/`, `/review/fxify/`.
- Remaining eleven completed in phase one: `/review/tradovate/`, `/review/coinrule/`, `/review/kinfo/`, `/review/bitsgap/`, `/review/3commas/`, `/review/option-alpha/`, `/review/interactive-brokers/`, `/review/insiderfinance/`, `/review/ic-markets/`, `/review/funded-next-futures/`, `/review/fidelity/`.
- Final page-content commit: `1a56f717bbf7d5529891a766fb26dc30e02129f9`.
- Production deploy completed and live-verified 2026-07-21; exact deployment IDs are recorded in the external recovery memory, not in this in-repo cursor.
- Final local build after restoring all 20 static review slugs passed with 2,026 pages.
- Verification completed locally: all 20 phase-one review pages exist in `public` and `dist`, all 20 public/dist hashes match, and all 20 are in `dist/sitemap-0.xml`.
- Verification completed live: all 20 phase-one review URLs return HTTP 200 on `https://tradingtoolshub.com`, and all 20 appear in the live `sitemap-0.xml`.
- Recovery memory ledger/action log: `/srv/BusinessOps/TradingToolsHub_SEO/TradingToolsHub Recovery/`.

### Rules carried forward

- Do not restart broad TTH feed/content generation without founder approval. Quality recovery means improve pages, internal links, titles, metas and schema.
- Do not use static queues as strategy. Use live GSC/traffic/business evidence and Codex/OpenAI-first workflows.
- Do not overwrite founder-protected or previously reviewed pages through bulk automation.
- Do not touch keyring.
- Next work after phase-one release is Batch 002 quality recovery and monitoring, not volume publishing.

---

## 2026-07-21 — STAGE 2 QUALITY RECOVERY STARTED

### Stage-two status

- Stage 2 began after Batch 001 production verification from a clean branch.
- First Stage 2 recovery set: `/review/polygon-io/`, `/best/best-stock-screeners/`, `/best/best-risk-management/`, and `/best/prop-firm-deals/`.
- `/review/polygon-io/` was deepened with implementation/buying checks and regenerated as a locked static page.
- `/best/best-stock-screeners/` was expanded with workflow-based screener recommendations, decision tables, internal links to Finviz, InsiderEdge, TradingView, TraderTrac and TradeZella, and tightened title/meta.
- `/best/best-risk-management/` received a new editorial body covering pre-trade sizing, journal-based risk review, prop-firm risk and advisor portfolio risk, then was regenerated as a locked static page.
- `/best/prop-firm-deals/` was expanded from a thin tracker into a rules-first deal evaluation page; Lucid Trading and Alpha Futures were added as verification-pending offer rows, and the title was shortened.
- Final local acceptance checks passed for the four Stage 2 URLs: title/meta/H1/canonical, sitemap inclusion, minimum content depth, and public/dist hash parity for the three locked static pages.

### Stage-two carry-forward

- Stage 2 has continued through seven sets. Latest released set: `/alternatives/ally-invest/`, `/alternatives/jp-morgan/`, `/alternatives/td-ameritrade/`, and `/alternatives/stockcharts/` rebuilt as locked static alternatives pages with official source links, deployed in Vercel production deployment `dpl_qZbdvc3VQeyi1yJr6TrxCfaP1NeR`, and live-verified on `tradingtoolshub.com`.
- Stage 2 eighth set is released: `/best/best-prop-firms-futures/`, `/review/chartlog/`, `/review/journalytix/`, and `/review/marketsmith/` rebuilt as locked static pages with official source links, stale URL corrections, deployed in Vercel production deployment `dpl_EaJ3ypaUeAC82kXC5zPNBChhTuXd`, and live-verified on `tradingtoolshub.com`.
- Stage 2 fifteenth set is released: `/best/best-ai-trading-tools/`, `/best/best-options-flow-tools/`, `/best/best-charting-software-day-trading/`, and `/best/best-insider-trading-tools/` rebuilt as locked static best pages with official source links and signal/workflow guidance, deployed in Vercel production deployment `dpl_AmLmSqRaENdVkdLshSxiGo3wRWSp`, and live-verified on `tradingtoolshub.com`.
- Continue Stage 2 with high-value pages from the recovery plan, especially the remaining thin alternatives, stale comparison pages, `/best/best-prop-firms-futures/`, and internal-link reinforcement.
- Keep broad content generation paused. Continue quality recovery, build checks, live verification and memory updates.

---

## 2026-07-13 — RECOVERY PLAN CHECKPOINT

### Current production evidence

- `main` and `origin/main`: `9235673` (PR #12), deployed successfully to Vercel production.
- Live/local build: 2,142 pages; live sitemap: 2,120 URLs. The intentional one-page reduction consolidates `/best/instant-funding-prop-firms/` into `/best/no-challenge-prop-firms/` with a live permanent redirect.
- Crawl graph: 2,142/2,142 reachable, zero orphans and zero broken internal-link targets.
- RSS: HTTP 200, 50 items / 20 blog items, latest publication 2026-07-13.
- Comparison enrichment: 1,179/1,179 complete (100%).
- All 20 selected `/best/` pages return HTTP 200 and render dedicated static HTML editorial bodies, correct canonicals, and no `noindex`.
- Priority smoke and RSS health checks pass.
- Founder intentionally paused seven TTH publishing/selection queues on 2026-07-13 while repairs are active. GSC export, URL inspection, recovery monitoring, priority smoke, feed health, quality/metadata/schema audits, and traffic/performance tracking remain active.
- The monitor distinguishes `paused_by_founder` from missing automation and treats RSS publication age as expected while all primary publishers are deliberately paused. The new state was silently baselined; no AgentMail alert was sent.

### Current GSC recovery evidence

- Corrected July 13 route-family sample: 478 successful inspections out of 480, 1 indexed (homepage), 477 not indexed, 2 API errors; measured index rate 0.2%.
- July 13 GSC performance: 7-day 1 click / 23 impressions; 28-day 3 clicks / 46 impressions; 90-day 46 clicks / 43,651 impressions.
- The GSC sitemap entry has zero reported errors/warnings, but still shows Google's stale 1,745 submitted / 0 indexed count from its July 11 download.
- Current severity remains critical because indexation has not recovered. This is not a site-health or monitor crash.
- A manual `--no-alert --no-telegram` monitor run used the July 13 reports, sent no duplicate email, and intentionally exited 2 for the critical indexation condition.

### Growth-plan progress

- Completed: TradeZella review upgrade; best-trading-journals hub upgrade; supporting journal comparison article; crawl/internal-link/sitemap repairs; all comparison enrichment; daily publishing/indexing/monitor continuity.
- Completed on 2026-07-13: PR #11 (`5b01287`) upgraded `/best/best-prop-firms/` with a futures-first order, nine decision notes, nine official sources, a 62-character rendered title, and a 139-character meta description. Full 2,143-page build, priority smoke test, Vercel preview, production deploy, live HTTP 200, RSS, and sitemap checks passed.
- Completed on 2026-07-13: PR #12 (`9235673`) converted the 20 strongest `/best/` recovery targets to dedicated static HTML editorial bodies, corrected prop-firm claims/order/sources, and consolidated the duplicate instant-funding page. Full build, live production, sitemap, RSS, canonical, indexability, and redirect checks passed.
- URL Inspection confirmed all 20 selected URLs were not indexed. They were submitted to IndexNow in exactly two batches of 10; both returned HTTP 200. Never resubmit any URL later confirmed indexed.
- Next manual recovery block completed locally: `/review/polygon-io/`, `/review/alpha-vantage/`, `/review/reuters-eikon/`, `/compare/alpha-vantage-vs-polygon-io/`, and `/compare/bloomberg-terminal-vs-reuters-eikon/` now use dedicated static HTML editorial bodies. Pricing was rechecked against first-party sources; Eikon is correctly identified as retired and replaced by quote-based LSEG Workspace. Full 2,142-page build, title/meta, schema, crawl, priority smoke, and RSS checks pass.
- Still pending: best-risk-management, trading-journal alternatives upgrades, and stronger cluster-level internal links.

---

## 2026-07-11 — INDEXATION RECOVERY, MONITORING, AND DEBUG HANDOFF

Full durable record:
`/root/.claude/projects/-srv-BusinessOps/memory/tth_session_2026_07_11.md`

### Live production state

- `main` and `origin/main`: `169a6a3` (PR #9).
- Live build: 2,137 pages; sitemap: 2,115 URLs; RSS: 50 items / 20 blog items, latest 2026-07-11.
- Crawl graph: 2,137/2,137 reachable, zero orphan pages, zero broken links.
- Publishing, guide, RSS, full GSC export, 480-URL inspection, and recovery-monitor crons are active.
- Current saved index sample remains critical at 1/480 indexed. Next corrected stratified run is scheduled 08:30 UTC.
- Only dirty repo file is pre-existing user-owned `public/llms.txt`; preserve it.

### Hard operating rules

- Never stop TTH publishing or RSS unless the founder explicitly commands it. Current explicit exception: the seven TTH publishing/selection queues are intentionally paused during active repair; do not restart them without founder direction.
- Alert only on material changes through AgentMail; silently baseline planned deployments.
- Do not use Google's Indexing API for ordinary TTH pages. It is not eligible; use GSC inspection, sitemap/internal links/RSS, and IndexNow for participating engines.
- Do not silently noindex quality problems. Improve/interlink pages and preserve the futures prop-firm strategy.
- Do not generate more site changes while waiting for the next GSC evidence point merely to appear busy.

### Unpublished branch

- `agent/consolidate-koyfin-entity`, commit `8f9c06f`, exists remotely but has no PR and was never merged/deployed.
- Do not deploy it without explicit founder approval.

### Debug result

- All changed Python scripts compile and behavioral tests pass.
- All 59 expected crons are present; feed health passes.
- Stale `dist/` from the unpublished branch was found and corrected by rebuilding from `main`; local output is back to 2,137 pages.
- Monitor exit code `2` is currently expected because indexation is still critical, not because the monitor crashed.

### IndexNow submission rule

- Exclude every URL that URL Inspection confirms is already indexed.
- Submit confirmed-not-indexed URLs and newly published blog/guide URLs in POST batches of at most 10.
- `indexnow.py` automatically chunks larger eligible sets; mocked 23-URL test passed as 10/10/3.
- Do not submit existing comparison pages merely because they were enriched.

### PR #10 title fixes

- Production is now `f46e62d` after shortening seven supplied blog `meta_title` values; live titles are 48–62 characters without ellipses and H1s are unchanged.
- `/privacy/` is currently HTTP 200 across canonical/no-slash/www/HTTP/Bingbot checks; the webmaster 4xx report is stale.
- Four supplied URLs confirmed not indexed were submitted as a four-URL IndexNow batch (HTTP 200). Three URLs with inconclusive API 401 evidence were excluded.

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

---

## 2026-07-21 — Stage 2 Second Set Ready

- Stage 2 first set is already production verified: `/review/polygon-io/`, `/best/best-stock-screeners/`, `/best/best-risk-management/`, `/best/prop-firm-deals/`.
- Second set prepared for release: `/review/finviz/`, `/review/tradingview/`, `/best/best-trading-journals/`, `/alternatives/tradertrac/`.
- Work performed: added source-backed hand-written Finviz and TradingView review bodies, expanded the trading-journal hub, added hand-written TraderTrac alternatives guidance, corrected stale Finviz trial language, added first-party source links, shortened/cleaned metadata, and locked all four pages as static public HTML.
- Final locked build passed with 2,020 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance passed for title/meta/H1/canonical/sitemap checks and public/dist hash parity on all four pages.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Third Set Ready

- Third set prepared for release: `/compare/tradertrac-vs-tradezella/`, `/compare/tradersync-vs-tradertrac/`, `/compare/edgewonk-vs-tradertrac/`, `/compare/financialtechwiz-vs-tradertrac/`.
- Work performed: added hand-written comparison bodies focused on TraderTrac buyer intent, competitor positioning, journaling workflow fit, broker-import context, review discipline, and internal links into the trading-journal cluster.
- Static migration updated so the four reviewed comparison pages are served from locked public HTML instead of dynamic generated comparison copy.
- Final locked build passed with 2,016 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance passed for title/meta/H1/canonical/sitemap checks and public/dist hash parity on all four pages.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Fourth Set Ready

- Fourth set prepared for release: `/categories/trading-journals/`, `/categories/stock-screeners/`, `/categories/charting-platforms/`, `/categories/prop-firms/`.
- Work performed: added hand-written category hub sections with buyer-intent guidance, workflow-based decision criteria, inline links to recovered reviews/listicles/comparisons, and clearer ownership for high-value topic clusters.
- Category pages now support optional editorial HTML from `src/content/category-html/`, and the four reviewed category hubs are locked in `public/categories/`.
- Static migration updated so these four category hubs are served from locked public HTML instead of dynamic category output.
- Final locked build passed with 2,012 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance passed for title/meta/H1/canonical/sitemap checks and public/dist hash parity on all four pages.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Fifth Set Ready

- Fifth set prepared for release: `/prop-firms/`, `/review/tradingeconomics/`, `/review/charles-schwab/`, `/review/etrade/`.
- Work performed: upgraded the prop-firm landing page with rules-first editorial guidance and internal links; added hand-written Trading Economics, Charles Schwab and E*TRADE review bodies backed by official source pages; locked the three review pages as static public HTML.
- Static migration updated so the three reviewed broker/data pages are served from locked public HTML instead of dynamic review output.
- Final locked build passed with 2,009 generated pages after moving these three review routes out of dynamic generation.
- Focused acceptance passed for title/meta/H1/canonical/sitemap/content-depth checks and public/dist hash parity on all review pages.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Sixth Set Ready

- Sixth set prepared for release: `/alternatives/charles-schwab/`, `/alternatives/etrade/`, `/alternatives/fidelity/`, `/alternatives/interactive-brokers/`.
- Work performed: added hand-written broker alternatives guidance with use-case tables, switch/stay logic, decision checklists and internal links into the broker review/comparison cluster.
- Static migration updated so these four alternatives pages are served from locked public HTML instead of thin dynamic alternatives output.
- Final locked build passed with 2,005 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance passed for title/meta/H1/canonical/sitemap/content-depth checks and public/dist hash parity on all four pages.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Ninth Set Released

- Ninth set released to production: `/compare/journalytix-vs-kinfo/`, `/compare/journalytix-vs-tradersync/`, `/compare/tradesviz-vs-tradingdiary-pro/`, `/compare/chartlog-vs-journalytix/`.
- Work performed: rebuilt four journal comparison pages with hand-written workflow guidance, source links, decision tables, pricing notes and internal links into the trading-journal cluster.
- Data corrections: Kinfo pricing updated to official Free, Pro $24.90/mo and Pro+ $44.90/mo; TradesViz updated to current Basic free, Pro $19.99/mo and Platinum $39.99/mo positioning.
- Static migration updated so all four comparison pages are served from locked public HTML.
- Final locked build passed with 1,994 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance and live verification passed for title/meta/H1/canonical/sitemap/content-depth/editorial-marker checks and public/dist parity.
- Content commit `391f382` was pushed; Vercel production deployment `dpl_HG6xQe3MVEnPnet53fX6vacgxBYo` is ready and aliased to `https://tradingtoolshub.com`.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Tenth Set Released

- Tenth set released to production: `/alternatives/tradezella/`, `/alternatives/tradersync/`, `/alternatives/tradesviz/`, `/alternatives/edgewonk/`.
- Work performed: rebuilt four journal alternatives pages with hand-written decision guidance, current pricing/feature context, source links, TraderTrac positioning and internal links into the trading-journal cluster.
- Data corrections: TradeZella pricing updated to Essential $35/mo, Pro $59/mo and Ultra $99/mo; TraderSync pricing updated to Pro $29.95/mo, Premium $49.95/mo and Elite $79.95/mo; TradesViz Platinum corrected to $29.99/mo; Edgewonk pricing and feature notes updated from official source checks.
- Static migration updated so all four alternatives pages are served from locked public HTML.
- Final locked build passed with 1,990 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance and live verification passed for title/meta/H1/canonical/sitemap/content-depth/editorial-marker checks and public/dist parity.
- Content commit `3a653df` was pushed; Vercel production deployment `dpl_EfMC99eZDrsWFJoB9o9nEUuKuruk` is ready and aliased to `https://tradingtoolshub.com`.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Eleventh Set Released

- Eleventh set released to production: `/categories/brokers-us/`, `/categories/options-platforms/`, `/categories/futures-platforms/`, `/categories/trading-education/`.
- Work performed: rebuilt four category hubs with hand-written buyer workflow guidance, decision tables, official source context and internal links into broker/options/futures/education clusters.
- Static migration updated so all four category hubs are served from locked public HTML.
- Final locked local build passed with 1,986 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance and live verification passed for title/meta/H1/canonical/sitemap/content-depth/editorial-marker checks and public/dist parity.
- Content commit `e5fba51` was pushed; Vercel production deployment `dpl_4oJP96ptefQqHsyVYNmNvyKdwLCS` is ready and aliased to `https://tradingtoolshub.com`.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Twelfth Set Released

- Twelfth set released to production: `/categories/brokers-forex/`, `/categories/trading-bots/`, `/categories/news-data-feeds/`, `/categories/trading-indicators/`.
- Work performed: rebuilt four remaining category hubs with hand-written buyer workflow guidance, risk/cost cautions, decision tables, official source context and internal links into forex broker, trading bot, market-data/news and indicator clusters.
- Static migration updated so all four category hubs are served from locked public HTML.
- Final locked local build passed with 1,982 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance and live verification passed for title/meta/H1/canonical/sitemap/content-depth/editorial-marker checks and public/dist parity.
- Content commit `cb84ffd` was pushed; Vercel production deployment `dpl_63BBxQmzb7aDchkrjWZEB81CPPQ2` is ready and aliased to `https://tradingtoolshub.com`.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Thirteenth Set Released

- Thirteenth set released to production: `/best/best-trading-bots/`, `/best/best-news-data-feeds/`, `/best/best-trading-indicators/`, `/categories/risk-management/`.
- Work performed: rebuilt three best pages and the risk-management category hub with hand-written workflow guidance, source-backed cautions, decision tables, internal links and refreshed metadata.
- Static migration updated so all four routes are served from locked public HTML.
- Sitemap correction: removed the old suppression for `/best/best-trading-indicators/` after the upgraded page passed sitemap/canonical/content checks.
- Final locked local build passed with 1,978 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance and live verification passed for title/meta/H1/canonical/sitemap/content-depth/editorial-marker checks and public/dist parity.
- Content commit `69f843e` was pushed; Vercel production deployment `dpl_B3SQe5Ce8hKcoWeUwr4QnpJeigv4` is ready and aliased to `https://tradingtoolshub.com`.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Fourteenth Set Released

- Fourteenth set released to production: `/best/best-free-trading-bots/`, `/best/best-free-news-data-feeds/`, `/best/best-tradingview-indicators/`, `/best/best-free-tradingview-indicators/`.
- Work performed: rebuilt four best pages with hand-written free-tool limitation guidance, TradingView indicator/repaint cautions, official source context, workflow-fit decision tables and internal links into bot/data/indicator clusters.
- Static migration updated so all four routes are served from locked public HTML.
- Sitemap correction: removed the old suppression for `/best/best-free-tradingview-indicators/` after the upgraded page passed sitemap/canonical/content checks.
- Final locked local build passed with 1,974 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance and live verification passed for title/meta/H1/canonical/sitemap/content-depth/editorial-marker checks and public/dist parity.
- Content commit `96a56ff` was pushed; Vercel production deployment `dpl_AhVETxhgisyn8YwR6c7gUPXRprR1` is ready and aliased to `https://tradingtoolshub.com`.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Fifteenth Set Released

- Fifteenth set released to production: `/best/best-ai-trading-tools/`, `/best/best-options-flow-tools/`, `/best/best-charting-software-day-trading/`, `/best/best-insider-trading-tools/`.
- Work performed: rebuilt four best pages with hand-written workflow guidance for AI tools, options-flow interpretation, day-trading chart stacks and insider/Congress signal tools.
- Static migration updated so all four routes are served from locked public HTML.
- Final locked local build passed with 1,970 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance and live verification passed for title/meta/H1/canonical/sitemap/content-depth/editorial-marker checks and public/dist parity.
- Content commit `8715f62` was pushed; Vercel production deployment `dpl_AmLmSqRaENdVkdLshSxiGo3wRWSp` is ready and aliased to `https://tradingtoolshub.com`.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.

## 2026-07-21 — Stage 2 Sixteenth Set Released

- Sixteenth set released to production: `/best/best-trading-education/`, `/best/best-free-trading-education/`, `/best/best-free-stock-screeners/`, `/best/best-free-charting-platforms/`.
- Work performed: rebuilt four best pages with hand-written education, free education, free screener and free charting platform guidance; added source-backed decision tables, workflow cautions, internal links and refreshed metadata.
- Static migration updated so all four routes are served from locked public HTML.
- Final locked local build passed with 1,966 generated pages after moving these four routes out of dynamic generation.
- Focused acceptance and live verification passed for title/meta/H1/canonical/sitemap/content-depth/editorial-marker checks and public/dist parity.
- Content commit `3eb09f6` was pushed; Vercel production deployment `dpl_Aj4CmKBQdC5QRQrPtqGRx1ZZsqTL` is ready and aliased to `https://tradingtoolshub.com`.
- Broad content publishing remains paused until founder approval; RSS/feed serving remains allowed.
