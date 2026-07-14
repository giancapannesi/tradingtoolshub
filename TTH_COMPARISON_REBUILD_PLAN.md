# TradingToolsHub — Comparison Page Rebuild Plan

Created: 2026-07-13
Owner: Gian
Purpose: Convert every `/compare/[slug]/` page from shared-template output to dedicated editorial HTML so Google stops treating the comparison base as scaled AI content.

---

## The problem this solves

- 1,179 comparison pages currently render from one `[slug].astro` template that injects the same ~200 words of boilerplate (disclaimer, "Data-Assisted Analysis" H2, Quick Verdict card, Explore More, Also Compare, Affiliate Disclosure) on every page.
- Editorial content is a JSON `analysis` field written by AI in a formulaic 3-paragraph shape.
- 2 out of 1,179 comparisons currently have dedicated editorial HTML (Alpha Vantage vs Polygon.io; Bloomberg Terminal vs Reuters Eikon).
- This is the biggest structural fingerprint on the site and the core reason the late-April 2026 mass-deindexing wave hit us.

## The approach

1. **Dedicated editorial HTML for every comparison**, stored at `src/content/compare-html/<slug>.html` — a body fragment, not a full page. When present, the template injects it in place of the JSON `analysis`.
2. **Category-tailored editorial structure**: different section order and headings per comparison category (brokers-us, options-platforms, trading-journals, etc.). Different structural skeleton per category = the second fingerprint fix.
3. **Prioritized by real GSC 16-month impressions**, descending. No alphabetical order, no arbitrary clustering. Traffic potential decides the queue.
4. **Small template edit alongside**: `compare/[slug].astro` swaps the verbatim "Data-Assisted Analysis" H2 for a category-specific heading ("Options-Trading Head-to-Head", "Broker Head-to-Head", etc.), varying the shared section header across the comparison base.
5. **Contextual internal linking** inside every dedicated HTML: link to each tool's `/review/` and `/alternatives/` pages inline (not only in the template's bottom "Explore More" box), plus 1–2 in-category cross-comparison links.
6. **Keep the template as fallback**. Any comparison without dedicated HTML still renders. The template file is not deleted until 100% coverage is reached.

## Category editorial patterns

Each category gets a distinct section order and heading set. Illustrative (not prescriptive — the writer varies within):

- **brokers-us**: Fee drilldown → Order routing / PFOF → Account minimums → Platform depth → Hidden costs → Which trader profile each is for → Verdict.
- **brokers-forex**: Spread reality → Regulation & entity → Execution & latency → Instruments coverage → Withdrawal friction → Verdict.
- **options-platforms**: Options-cost drilldown → Options analytics depth → Scripting / backtesting → Charting & breadth → Learning curve reality → Broker-parent trade-offs → Verdict.
- **charting-platforms**: Chart quality → Indicator library → Drawing tools → Data breadth → Integrations & alerts → Cross-device sync → Verdict.
- **trading-journals**: Import workflow → Data ownership → Automation & broker sync → Analytics depth → Price ladder → Best for which trader → Verdict.
- **stock-screeners**: Data freshness → Filter depth → Alert quality → Backtest availability → Mobile UX → Verdict.
- **trading-bots**: Exchange coverage → Bot types & strategies → Backtesting realism → Fee structure → Custody & security → Verdict.
- **prop-firms**: Payout speed → Rule pain-points → Scaling plan reality → Drawdown mechanics → Evaluation ROI → Real-user complaints → Verdict.
- **news-data-feeds**: Data breadth (asset classes, historical depth) → Delivery model (REST, WebSocket, flat files) → Latency & entitlements → Pricing tiers → Redistribution & commercial-use rights → Verdict.
- **order-flow-tools**: Data quality → Alert UX → Historical replay → Institutional-vs-retail flow separation → Integrations → Verdict.
- **trading-education**: Curriculum depth → Practical trade-along vs theory → Community & mentorship → Refund/cancellation → Cost realism → Verdict.
- **futures-platforms**: Contract coverage → Data & latency → Charting → Broker integrations → Margin rates → Verdict.
- **cross-category**: Custom hook explaining why the comparison exists (traders search it despite category mismatch) → each side's category-native strengths → who each is for → Verdict.

Every dedicated HTML file **must**:
- Start with a `<p><strong>Verdict:</strong> ...</p>` opinionated one-liner.
- Use H3s only (never H1 or H2 — those belong to the Astro template above).
- Contain **≥2 inline `<a>` links** to at least one of: each tool's `/review/`, `/alternatives/`, or a strong same-category `/compare/` peer.
- End with a closing paragraph pointing readers to the full reviews for current pricing.
- Reference specific numbers (fees, contract sizes, tiers, dates) — not hand-wavy "affordable" language.
- Not invent unverified data. If a fact isn't in the tool JSON, either check the vendor's site (link in tool JSON) or leave the fact out.

## Prioritization

Real 16-month GSC impressions determine the queue. Full ranked list: `/tmp/tth_compare_ranked.json` in-session; regenerate via `TradingToolsHub_SEO/gsc_reports/gsc_report_YYYY-MM-DD.json` + `src/content/comparisons.json`.

| Tier | Impression range | Page count | Batches |
|---|---|---:|---|
| S | ≥ 200 imp | 16 | 1–2 (part of) |
| A | 100–199 imp | 25 | 2–5 (rest) |
| B | 50–99 imp | 59 | 6–10 (top of) |
| C | 10–49 imp | 254 | 11–35 |
| D | 1–9 imp | 462 | 36–80 |
| Z | 0 imp | 363 | last (long tail — cluster-linking value only) |
| **Total** | | **1,179** | ~80 batches |

## Top-100 batch table (Batches 1–10)

Each batch is 10 pages. Ship as one branch/PR per batch.

| Batch | Aggregate 16m imp | Slugs |
|---|---:|---|
| **1 (this PR)** | **5,556** | power-etrade-vs-thinkorswim-options, jp-morgan-vs-robinhood, etrade-vs-robinhood, fidelity-vs-jp-morgan, etrade-vs-jp-morgan, 3commas-vs-pionex, fidelity-vs-robinhood, charles-schwab-vs-td-ameritrade, insiderfinance-vs-optionsstrat, bloomberg-terminal-vs-polygon-io |
| 2 | 2,154 | charles-schwab-vs-jp-morgan, tradingview-vs-trendspider, public-com-vs-robinhood, insiderfinance-vs-unusual-whales, charles-schwab-vs-robinhood, fidelity-vs-interactive-brokers, metatrader-5-vs-ninjatrader, bookmap-vs-tradingview, etrade-vs-webull, robinhood-vs-webull |
| 3 | 1,459 | etrade-vs-tastytrade, tradingview-vs-tradovate, flowalgo-vs-optionsstrat, metatrader-5-vs-quantconnect, apex-trader-funding-vs-topstep, lightspeed-vs-tradestation, fidelity-vs-sofi-invest, charles-schwab-vs-firstrade, ally-invest-vs-robinhood, polygon-io-vs-tradingeconomics |
| 4 | 1,130 | etrade-vs-interactive-brokers, ftmo-vs-topstep, robinhood-vs-tastytrade, optionsstrat-vs-thinkorswim-options, etrade-vs-tradestation, moomoo-vs-robinhood, jp-morgan-vs-td-ameritrade, bookmap-vs-motivewave, fidelity-vs-td-ameritrade, ic-markets-vs-pepperstone |
| 5 | 904 | ally-invest-vs-td-ameritrade, exness-vs-forex-com, chartlog-vs-journalytix, cryptohopper-vs-pionex, sierra-chart-vs-tradovate, interactive-brokers-vs-m1-finance, interactive-brokers-vs-td-ameritrade, tastytrade-vs-tradestation, option-alpha-vs-thinkorswim-options, charles-schwab-vs-m1-finance |
| 6 | 792 | robinhood-vs-td-ameritrade, amp-futures-vs-quantower, tastytrade-vs-webull, charles-schwab-vs-fidelity, motivewave-vs-tradingview, bookmap-vs-sierra-chart, bookmap-vs-thinkorswim, interactive-brokers-vs-tradestation, benzinga-pro-vs-scanz, reuters-eikon-vs-tipranks |
| 7 | 705 | charles-schwab-vs-sofi-invest, m1-finance-vs-sofi-invest, charles-schwab-vs-etrade, motivewave-vs-tradovate, interactive-brokers-vs-sofi-invest, koyfin-pro-vs-sierra-chart, charles-schwab-vs-interactive-brokers, firstrade-vs-interactive-brokers, ally-invest-vs-m1-finance, iex-cloud-vs-quandl |
| 8 | 642 | tradersync-vs-tradezella, sierra-chart-vs-tradingview, tc2000-vs-thinkorswim, smb-capital-vs-warrior-trading, etrade-vs-fidelity, moomoo-vs-tastytrade, thinkorswim-scanner-vs-trade-ideas, apex-trader-funding-vs-funded-next, moomoo-vs-webull, etoro-vs-xm |
| 9 | 575 | scanz-vs-trade-ideas, tradesviz-vs-tradezella, avatrade-vs-etoro, bear-bull-traders-vs-smb-capital, option-alpha-vs-optionsstrat, koyfin-vs-seeking-alpha, bookmap-vs-tradovate, jp-morgan-vs-tradestation, ally-invest-vs-etrade, ally-invest-vs-fidelity |
| 10 | 509 | ally-invest-vs-interactive-brokers, option-alpha-vs-power-etrade, jp-morgan-vs-m1-finance, fxpro-vs-ic-markets, apex-trader-funding-vs-phidias-propfirm, bear-bull-traders-vs-investopedia-academy, robinhood-vs-tradestation, sierra-chart-vs-trendspider, sofi-invest-vs-td-ameritrade, bloomberg-terminal-vs-seeking-alpha |

Total top-100 impressions: **14,426** (33% of the site's 16-month impression share sits on these 100 pages).

## Internal linking rules

- **Every dedicated HTML** links inline to each tool's `/review/` **and** its `/alternatives/` page (4 anchor targets minimum per page).
- **1–2 in-category peer comparison links** inside the editorial where they naturally fit ("if you're weighing X, also see [Y-vs-Z]").
- **Category hub pages** (`/categories/[slug]/`) should link OUT to the strongest 3–5 comparisons in the category. Audit `src/pages/categories/[slug].astro` after Batch 5.
- **Inline linker** (`src/utils/inline-linker.ts`) already maps tool names → `/review/` and category keywords → `/categories/`. Audit the map after Batch 3 to extend with newly-editorialised comparison anchors.
- **No footer-only linking** — the "Explore More" and "Also Compare" template boxes remain, but dedicated HTML must not rely on them alone. Contextual inline links carry the equity.

## Fingerprint-reduction template edits (this PR only)

1. Replace the fixed `<h2>Data-Assisted Analysis</h2>` in `src/pages/compare/[slug].astro` with a category-specific heading (map in template frontmatter). Same-category pairs get the category heading; cross-category pairs get `Cross-Category Comparison`.
2. Nothing else in the template changes this pass. The template stays as fallback for the remaining ~1,169 pages.

Future template PRs (out of scope here):
- Rename `/_astro/` asset dir via `build.assets` in `astro.config.mjs`.
- Vary the "How this comparison was produced" disclaimer copy (or scope it to a helper that rotates 3–5 variants).
- Rotate the "Explore More" / "Also Compare" section wording.

## Hard rules

- Never delete `src/pages/compare/[slug].astro`. It remains fallback until 100% coverage.
- Never invent fees, spreads, contract counts, dates, or "as of" claims. Numbers come from the tool JSON or the vendor site. If unknown → omit.
- Never rewrite a page that has been indexed within the last 7 days (per CLAUDE.md content policy — Google needs measurement time).
- Never resubmit a comparison URL to manual indexing unless it was materially rebuilt that week (per TTH_INDEXING_RECOVERY_PLAN.md — 10/week TTH quota, upgraded pages only).
- Do not restart the paused publishing queues (per TTH_QUEUE_PAUSE_2026-07-13.md). This project runs alongside the queue pause, not against it.
- Ship as branch/PR per batch (`agent/compare-rebuild-batch-NN`). Founder is the final gate.

## Progress log

| Batch | Status | Merged | Notes |
|---|---|---|---|
| 1 | In progress (this PR) | — | Exemplar shipped first; remaining 9 after founder review of pattern |
| 2 | Queued | — | |
| 3+ | Queued | — | |

## Resume-cursor for the next session

If disconnected mid-project, the next Claude picks up here:

- **Where to resume**: check `git log --oneline -10` for the last `agent/compare-rebuild-batch-NN` commit. If not merged, continue that batch. If merged, start the next batch from the table above.
- **How to regenerate the ranked worklist**: run the Python block in the "prioritization" section of this doc against the newest `TradingToolsHub_SEO/gsc_reports/gsc_report_*.json` and `src/content/comparisons.json`. Output goes to `/tmp/tth_compare_ranked.json` (never commit).
- **Category editorial patterns**: read this doc's "Category editorial patterns" section — that's the spec for every new HTML file.
- **Template edit state**: check `src/pages/compare/[slug].astro` for the `editorialHeading` map — if present, the fingerprint edit shipped; if not, add it in the next PR.
- **Founder standing rules**: `CLAUDE.md`, `TTH_NOW.md`, `TTH_INDEXING_RECOVERY_PLAN.md`, `TTH_QUEUE_PAUSE_2026-07-13.md`. Read all four before touching code.
