# Trading Journal Ranking Methodology

Date: 2026-06-24

## Purpose

TradingToolsHub needs a fair, repeatable way to rank trading journals. The ranking must be defensible if a vendor, affiliate partner, competitor, or reader asks why a product placed above or below another product.

The rule is simple: partner or affiliate status is recorded for disclosure, but it is not part of the score.

## Scoring Weights

| Criterion | Weight | What it measures |
| --- | ---: | --- |
| Import automation | 20% | Broker sync, CSV/import quality, documented integration coverage |
| Analytics depth | 20% | Performance analytics, AI analysis, risk tools, replay/backtesting, psychology/mistake tracking |
| Ease of use | 15% | UI friction, mobile/cloud access, onboarding, whether a trader will actually use it daily |
| Pricing value | 15% | Free tier, entry price, long-term value, one-time/lifetime options |
| Market coverage | 10% | Stocks, options, futures, forex, crypto, international/multi-asset support |
| Trust and reliability | 10% | Platform age, support/reliability rating, third-party review evidence, user-base maturity |
| Evidence quality | 10% | Screenshots, verified feature lists, recent review update, partner-provided product evidence |

## Evidence Rules

1. Structured tool JSON is the scoring source of truth.
2. Affiliate URL, affiliate program, commission, or partnership status is excluded from all component scores.
3. Screenshots can improve evidence quality, but they do not automatically improve feature scores unless the feature is visible or documented.
4. Missing data should not be guessed. Missing markets, integrations, or pricing should score conservatively until verified.
5. A newer product can rank well if the evidence supports it, but it should not outrank mature competitors on trust without third-party or usage evidence.

## Current Result

The first automated ranking run is stored at:

- `/srv/BusinessOps/TradingToolsHub_SEO/journal_rankings/trading_journals_ranked_latest.json`
- `/srv/BusinessOps/TradingToolsHub_SEO/journal_rankings/trading_journals_ranked_2026-06-24.md`

Current top journals under this model:

1. TraderTrac
2. Edgewonk
3. FinancialTechWiz
4. Tradervue
5. TradingDiary Pro
6. TradesViz
7. TraderSync
8. Trademetria
9. Trading Vault
10. TradeZella

## Use-Case Awards

Overall rank is not the only editorial output. A journal can be the best choice
for a specific trader even if it is not the top overall score.

Current use-case leaders:

| Award | Current winner | Why |
| --- | --- | --- |
| Best daily usability | TraderTrac | Fast trade logging, easy capture, clean stats, low-friction review habit |
| Best value | TraderTrac | Free tier, low paid price, AI analysis, practical stats |
| Best broker sync | Edgewonk | Largest documented broker integration footprint |
| Best advanced analytics | Edgewonk | Deep analytics, psychology, simulator, long operating history |

TraderTrac should be presented as the best journal for traders who primarily
need fast logging, easy capture, clean stats, and a habit-forming daily workflow.
It now has IBKR broker auto-import via SnapTrade, so it can be credited for
broker sync. It should not be presented as best for broad broker coverage until
more broker integrations are verified.

## FinancialTechWiz Position

FinancialTechWiz currently scores well on:

- AI analysis and AI coach evidence
- Broker/import automation evidence
- Low starting price
- Usability and cloud/mobile workflow
- Product screenshots in `/srv/BusinessOps/TradingToolsHub/TechWiz/`

It scores lower on:

- Market coverage, because current structured data lists only stocks and crypto
- Trust/reliability, because it is newer than Edgewonk, Tradervue, TraderSync, TradeZella, and TradesViz
- Evidence depth, because more third-party review data and explicit market/integration documentation would strengthen the score

This is the defensible editorial position: FinancialTechWiz can be recommended for specific trader profiles without being artificially ranked first.

## Required Next Improvements

1. Add a visible methodology block to `/best/best-trading-journals/`.
2. Add scoring component data to the trading journal listicle page.
3. Verify each journal's current pricing and broker integration counts.
4. Add screenshots to FinancialTechWiz review if image assets are approved for public use.
5. Re-run ranking after each material data update.
