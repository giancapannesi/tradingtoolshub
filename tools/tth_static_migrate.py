#!/usr/bin/env python3
"""
TTH Phase 2 — static HTML migration.

Reads the top-N pages by GSC 16-month impressions, copies each page's built HTML
from dist/ into public/, rewrites the framework-hashed CSS reference to a stable
/assets/main.css, and records the migrated slugs in
`src/content/static_migrated.json` so Astro's `getStaticPaths()` filters them
out on the next build.

End state per migrated page: served as a plain static file from public/, zero
Astro pipeline dependency at request time.

Usage:
    python3 tools/tth_static_migrate.py --top 100
    python3 tools/tth_static_migrate.py --top 100 --dry-run

Idempotent: re-running with the same --top value produces the same set of files.
"""

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DIST = REPO / "dist"
PUBLIC = REPO / "public"
MIGRATED_JSON = REPO / "src" / "content" / "static_migrated.json"
GSC_REPORT = Path("/srv/BusinessOps/TradingToolsHub_SEO/gsc_reports/gsc_report_2026-07-13.json")

# Routes that go through per-slug Astro templates and are eligible for static
# override. Everything else (categories, index, static single-page routes) stays
# on Astro for now — those templates have per-page data-driven variance already.
MIGRATABLE_ROUTES = ("review", "compare", "alternatives", "best", "blog")

# Paths that should never be migrated: home, category hubs, static single pages.
EXCLUDE_PATHS = {
    "/", "/about/", "/privacy/", "/terms/", "/methodology/",
    "/reviews/", "/guides/", "/blog/", "/prop-firms/",
    "/featured/", "/specials/", "/affiliate-disclosure/",
}


def load_top_pages(top_n: int) -> list[dict]:
    report = json.loads(GSC_REPORT.read_text())
    pages = sorted(
        report["periods"]["16month"]["top_pages"],
        key=lambda x: x["impressions"],
        reverse=True,
    )
    selected = []
    for p in pages:
        page = p["page"]
        if page in EXCLUDE_PATHS:
            continue
        # Path must be at least /route/slug/ shape (route + one slug).
        parts = page.strip("/").split("/")
        if len(parts) < 2:
            continue
        if parts[0] not in MIGRATABLE_ROUTES:
            continue
        # Skip pages whose HTML doesn't exist in dist — retired routes, redirects,
        # or anything Astro chose not to render. No point recording them.
        rel = page.strip("/") + "/index.html"
        if not (DIST / rel).exists():
            continue
        selected.append(p)
        if len(selected) >= top_n:
            break
    return selected


def scrub_html(html: str) -> str:
    """
    Rewrites the framework-hashed CSS reference to a stable filename. Astro
    builds this file as /assets/<name>.<hash>.css — the hash rebuilds every
    time and is a build-signature. We keep our own stable /assets/main.css
    (already copied into public/) and point static files at it.
    """
    # Rewrite the primary Astro-built CSS import to /assets/main.css.
    html = re.sub(
        r'<link\s+rel="stylesheet"\s+href="/assets/[^"]+\.css"\s*/?>',
        '<link rel="stylesheet" href="/assets/main.css" />',
        html,
        count=1,
    )
    return html


def migrate_one(page_path: str, dry_run: bool) -> str:
    """
    Copies dist/<route>/<slug>/index.html to public/<route>/<slug>/index.html,
    rewriting the CSS reference. Returns 'copied', 'skipped', or 'missing'.
    """
    rel = page_path.strip("/") + "/index.html"
    src = DIST / rel
    dst = PUBLIC / rel
    if not src.exists():
        return "missing"

    html = src.read_text()
    scrubbed = scrub_html(html)

    if dry_run:
        return "would-copy"

    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(scrubbed)
    return "copied"


def update_exclusion_list(pages: list[dict], dry_run: bool):
    """
    Records the migrated slugs, per route, so Astro's getStaticPaths can
    filter them out.

    Shape:
      {
        "review": ["polygon-io", "power-etrade", ...],
        "compare": ["power-etrade-vs-thinkorswim-options", ...],
        ...
      }
    """
    by_route: dict[str, list[str]] = {r: [] for r in MIGRATABLE_ROUTES}
    for p in pages:
        parts = p["page"].strip("/").split("/")
        if len(parts) >= 2 and parts[0] in MIGRATABLE_ROUTES:
            by_route[parts[0]].append(parts[1])

    for r in by_route:
        by_route[r] = sorted(set(by_route[r]))

    if dry_run:
        print(f"[dry-run] would write {MIGRATED_JSON} with {sum(len(v) for v in by_route.values())} slugs")
        return

    MIGRATED_JSON.parent.mkdir(parents=True, exist_ok=True)
    MIGRATED_JSON.write_text(json.dumps(by_route, indent=2) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", type=int, default=100, help="Number of top pages to migrate")
    ap.add_argument("--dry-run", action="store_true", help="Report what would change without writing")
    args = ap.parse_args()

    if not DIST.exists():
        print(f"error: {DIST} does not exist — run `npm run build` first", file=sys.stderr)
        sys.exit(1)

    pages = load_top_pages(args.top)
    print(f"Selected {len(pages)} pages (aggregate 16m impressions: {sum(p['impressions'] for p in pages):,})")

    results = {"copied": 0, "missing": 0, "would-copy": 0}
    missing_pages = []
    for p in pages:
        status = migrate_one(p["page"], args.dry_run)
        results[status] = results.get(status, 0) + 1
        if status == "missing":
            missing_pages.append(p["page"])

    update_exclusion_list(pages, args.dry_run)

    print(f"\nResults: {results}")
    if missing_pages:
        print(f"\nMissing (not in dist/): {len(missing_pages)}")
        for p in missing_pages[:5]:
            print(f"  {p}")

    # Route breakdown
    from collections import Counter
    routes = Counter(p["page"].strip("/").split("/")[0] for p in pages)
    print(f"\nBy route:")
    for r, n in routes.most_common():
        print(f"  {r:<15} {n}")


if __name__ == "__main__":
    main()
