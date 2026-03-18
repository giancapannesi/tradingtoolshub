# CLAUDE.md — TradingToolsHub

## Project Overview

TradingToolsHub is a **static content site** for trading tool reviews, comparisons, and recommendations. Built with **Astro 5**, **TypeScript (strict)**, and **Tailwind CSS 4**, deployed on **Vercel** as a fully static site.

- **Live site:** https://tradingtoolshub.com
- **Content:** 130+ trading tool reviews, 200+ comparisons, best-of listicles, category pages, prop firm coverage

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Framework   | Astro 5.17 (static output)         |
| Language    | TypeScript (strict mode)            |
| Styling     | Tailwind CSS 4.2 via Vite plugin    |
| Font        | Inter (@fontsource/inter)           |
| Sitemap     | @astrojs/sitemap                    |
| Deployment  | Vercel (static)                     |
| API         | Vercel serverless functions (`/api/`) |
| Analytics   | Google Analytics 4                  |

## Commands

```bash
npm run dev       # Start dev server on :4321
npm run build     # Build static site to /dist/
npm run preview   # Preview built site locally
```

## Project Structure

```
/
├── src/
│   ├── components/        # Reusable Astro components
│   │   ├── ComparisonTable.astro
│   │   ├── ProsCons.astro
│   │   ├── ToolCard.astro
│   │   └── RatingStars.astro
│   ├── layouts/
│   │   └── BaseLayout.astro   # Master layout (nav, footer, GA4, schema.org)
│   ├── pages/                 # File-based routing
│   │   ├── index.astro
│   │   ├── review/[slug].astro
│   │   ├── compare/[slug].astro
│   │   ├── best/[slug].astro
│   │   ├── alternatives/[slug].astro
│   │   ├── categories/[category].astro
│   │   ├── featured/[slug].astro
│   │   ├── prop-firms/
│   │   ├── feed.xml.ts        # RSS feed generator
│   │   └── (static pages: about, methodology, privacy, terms, etc.)
│   ├── content/               # JSON-based content (the data layer)
│   │   ├── tools/             # 130+ individual tool JSON files
│   │   ├── categories.json
│   │   ├── comparisons.json
│   │   ├── listicles.json
│   │   ├── specials.json
│   │   ├── featured.json
│   │   └── data/              # Prop firm data
│   ├── styles/
│   │   └── global.css         # Tailwind imports, CSS variables, typography
│   └── utils/
│       └── data.ts            # All data loading/transformation logic
├── api/
│   └── subscribe.ts           # Vercel serverless: EmailOctopus newsletter signup
├── public/                    # Static assets (favicon, robots.txt, llms.txt)
├── astro.config.mjs
├── tsconfig.json
└── vercel.json                # Security headers + caching rules
```

## Architecture & Key Patterns

### Data Model

All content lives as **JSON files** in `src/content/`. There is no CMS or database.

- **Tools** (`src/content/tools/*.json`): Individual tool reviews with name, slug, category, pricing tiers, features, ratings, pros/cons, affiliate info, markets, company details
- **Comparisons** (`src/content/comparisons.json`): Side-by-side tool comparison data
- **Listicles** (`src/content/listicles.json`): Best-of lists grouped by use case
- **Categories** (`src/content/categories.json`): Category definitions with metadata
- **Specials** (`src/content/specials.json`): Current promotional deals
- **Featured** (`src/content/featured.json`): Long-form article ideas/metadata

### Data Loading (`src/utils/data.ts`)

Single utility file containing all data access logic:
- `getAllTools()` — Returns published tools (cached)
- `getToolBySlug(slug)` — Lookup a single tool
- `getToolsByCategory(category)` — Filter + sort by rating
- `getCategories()` — All categories with tool counts
- `getComparisons()` — Comparison data
- `getListicles()` — Best-of list data
- `getSimilarTools(tool)` — Recommendation engine
- Various formatting helpers

### Routing

Astro file-based routing with dynamic `[slug]` and `[category]` params:
- `/review/[slug]/` — Tool review pages
- `/compare/[slug]/` — Tool comparison pages
- `/best/[slug]/` — Listicle pages
- `/alternatives/[slug]/` — Alternative tool pages
- `/categories/[category]/` — Category listing pages
- `/featured/[slug]/` — Featured article pages

### SEO

- JSON-LD schema.org markup (WebSite, SoftwareApplication, FAQPage, BreadcrumbList)
- Open Graph and standard meta tags on all pages
- Auto-generated sitemap via `@astrojs/sitemap`
- RSS feed at `/feed.xml`
- Google site verification meta tag

## Content Conventions

### Adding a New Tool

1. Create a JSON file in `src/content/tools/<slug>.json`
2. Follow the existing schema (see any tool file for reference)
3. Ensure `published: true` for the tool to appear on the site
4. The tool will auto-generate a `/review/<slug>/` page

### Adding a Comparison

Add an entry to `src/content/comparisons.json` following the existing structure. A `/compare/<slug>/` page is auto-generated.

### Adding a Listicle

Add an entry to `src/content/listicles.json`. A `/best/<slug>/` page is auto-generated.

## Environment Variables

Required for the newsletter subscription API (`/api/subscribe.ts`):
- `EO_API_KEY` — EmailOctopus API key
- `EO_LIST_ID` — EmailOctopus mailing list ID

No `.env.example` file exists. These are only needed for the serverless subscribe endpoint.

## Deployment

- **Platform:** Vercel
- **Output:** Static (`output: 'static'` in `astro.config.mjs`)
- **Security headers:** Configured in `vercel.json` (HSTS, X-Frame-Options DENY, nosniff, strict referrer)
- **Caching:** Review, compare, best, and alternatives routes have 24h client / 7d CDN cache headers

## Testing

No test framework is configured. There are no automated tests. Validate changes by:
1. Running `npm run build` to check for build errors
2. Running `npm run preview` to visually verify pages

## Code Style & Conventions

- **TypeScript strict mode** — All code must pass strict type checking
- **ES modules** — `"type": "module"` in package.json
- **Astro components** — `.astro` files for pages and components
- **Dark theme by default** — Dark color scheme with slate/blue palette
- **Tailwind utility classes** — Prefer Tailwind utilities over custom CSS
- **JSON content** — All structured content is JSON, not Markdown or MDX
- **No test framework** — Rely on `npm run build` for catching errors
- **Directory-based routing** — Build format uses directory structure (trailing slashes)

## Important Notes for AI Assistants

- The site is **fully static** — no SSR, no database, no runtime server (except the Vercel serverless subscribe endpoint)
- Content is **JSON-driven** — to add/edit content, modify JSON files in `src/content/`
- `src/utils/data.ts` is the **single source of truth** for all data loading logic
- `BaseLayout.astro` is the **master template** used by all pages — changes here affect the entire site
- Tool data files use a `published` flag — only published tools appear on the site
- The site targets **tradingtoolshub.com** as the canonical domain
- Always run `npm run build` after changes to verify nothing breaks
