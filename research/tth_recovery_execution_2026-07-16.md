# TTH Recovery Execution — 2026-07-16

## Production baseline

- Production sitemap: 2,123 unique URLs.
- Live status crawl: 2,123/2,123 sitemap URLs returned HTTP 200.
- Latest GSC URL Inspection sample: 1 indexed, 478 not indexed, 1 API error.
- Latest quality audit: 1,154 of 2,142 built pages flagged for upgrades.
- Rendered internal-link audit: 506 unresolved intended links across 295 source pages.
- Rendered title audit: 524 titles contained literal `...` truncation.
- Confirmed duplicate Koyfin surfaces: review, alternatives, pricing, setup, and tips URLs.

## Recovery controls in this release

### IndexNow safety (operations script)

- `/srv/BusinessOps/tools/gsc_indexing.py` now applies a hard TTH cap of ten total IndexNow URLs per run.
- The cap is applied after confirmed-not-indexed filtering and cooldown filtering.
- Accepted IndexNow URLs are stamped into the shared cooldown file.
- This corrects the prior behavior that submitted every confirmed-unindexed URL while only limiting each HTTP batch to ten.

### Internal links

- Added legacy category, review, tool, comparison, broker, and prop-firm route recovery.
- Added nested legacy tool-path recovery and common tool aliases.
- Invalid legacy comparison roots now resolve to a valid discovery hub rather than rendering as non-clickable text.

### Titles

- Replaced literal-ellipsis title clipping with phrase-aware title composition.
- Common generated title formulas are shortened into complete phrases.
- Long titles that cannot be shortened safely remain complete rather than being visibly chopped.

### Koyfin consolidation

- Canonical winners: `koyfin-pro` review, alternatives, pricing, setup, and tips URLs.
- Removed five duplicate Koyfin content surfaces from generation.
- Added permanent redirects from the old Koyfin URLs.
- Updated structured content references and the internal-link repair map to point at the canonical winners.

## Debug and release evidence

- Python compilation: passed for `gsc_indexing.py` and `indexnow.py`.
- IndexNow selection unit test: passed; 478 candidates produced ten selected URLs.
- Stricter `--max-push 5` test: passed; five selected URLs.
- `vercel.json` JSON parse: passed.
- Astro production build: passed, 2,140 pages.
- Rendered internal-link audit: passed, zero unresolved intended links (baseline: 506).
- Rendered title audit: passed, zero literal-ellipsis titles (baseline: 524) and zero titles over 65 characters.
- Metadata/image audit: 2,140 pages checked, zero issue pages.
- AI/schema audit: 2,140 pages checked, zero schema issue pages and zero `llms.txt` issues.
- Sitemap audit: 2,118 unique entries; zero duplicate Koyfin loser URLs.
- Robots audit: 20 intentional noindex blog archive pages; none introduced by this release.
- Added missing `ItemList` schema to the custom prop-firm deals best page and `CollectionPage` schema to the guides index.
- Updated `llms.txt` from 187 to 186 canonical tool reviews after Koyfin consolidation.
- Vercel preview, production deployment and live redirect checks: pending.

## Guardrails

- No publishing queues were resumed.
- No manual Google submission quota was used.
- No unverified pricing or affiliate claims were introduced.
- Old Koyfin URLs are redirected; they are not left as 404s.
