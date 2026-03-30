#!/usr/bin/env python3
"""
TTH Daily Enrichment Engine
Automatically deep-enriches thin tool reviews with 1,200-1,500 word reviews and screenshots.
Runs daily via cron. Processes N tools per run (default: 20).

Usage:
  python3 tools/tth_enrichment_engine.py                  # Enrich next 20 tools
  python3 tools/tth_enrichment_engine.py --count 5        # Enrich next 5 tools
  python3 tools/tth_enrichment_engine.py --dry-run        # Show queue without enriching
  python3 tools/tth_enrichment_engine.py --slug tradervue # Enrich a specific tool
"""

import anthropic
import json
import os
import sys
import glob
import subprocess
import argparse
import time
import re
import requests
from datetime import datetime
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import base64

# Paths
TTH_DIR = "/srv/BusinessOps/tradingtoolshub"
TOOLS_DIR = os.path.join(TTH_DIR, "src/content/tools")
SCREENSHOTS_DIR = os.path.join(TTH_DIR, "public/screenshots")
IMAGES_DIR = os.path.join(TTH_DIR, "public/images/tools")
LOG_FILE = os.path.join(TTH_DIR, "tools/enrichment_log.json")
GEMINI_API_KEY_FILE = "/srv/BusinessOps/tools/.gemini-api-key"

# Affiliate priority slugs (tools with active or pending affiliate programs)
AFFILIATE_PRIORITY = [
    # Active affiliates
    "tradingview", "finviz", "edgewonk", "ftmo", "motivewave",
    # Tier 1 - Easy signups
    "tradervue", "trademetria", "tradersync", "seeking-alpha", "simply-wall-st",
    "stock-rover", "soft4fx", "forex-tester", "coinrule", "bitsgap",
    "3commas", "koyfin", "kinfo", "tradezella",
    # Tier 2 - Network programs
    "benzinga-pro", "ninjatrader", "tradestation", "vectorvest", "morningstar",
    # Tier 3 - Review process
    "trendspider", "atas", "funded-trading-plus", "earn2trade", "the-5-ers",
    "trade-ideas", "cheddar-flow", "option-alpha", "bookmap",
    "city-traders-imperium", "fxify", "investors-underground", "insiderfinance",
    "luxalgo", "fx-replay", "spotgamma",
    # Tier 4 - Brokers
    "interactive-brokers", "ic-markets", "pepperstone", "etoro", "exness",
    "blackbull-markets", "vantage", "robinhood",
]

# Category priority (money categories first)
CATEGORY_PRIORITY = [
    "prop-firms", "brokers-us", "brokers-international", "stock-screeners",
    "charting-platforms", "trading-journals", "options-tools",
    "backtesting", "automated-trading", "ai-trading",
    "crypto-tools", "news-analytics", "education",
]


def load_all_tools():
    """Load all tool JSON files."""
    tools = []
    for f in sorted(glob.glob(os.path.join(TOOLS_DIR, "*.json"))):
        try:
            with open(f) as fh:
                data = json.load(fh)
                data['_file'] = f
                tools.append(data)
        except Exception as e:
            print(f"  Error loading {f}: {e}", file=sys.stderr)
    return tools


def get_enrichment_queue(tools):
    """Prioritize tools for enrichment. Returns list of thin tools sorted by priority."""
    thin_tools = []
    for t in tools:
        word_count = len(t.get('description_long', '').split())
        if word_count < 500:
            thin_tools.append(t)

    def priority_score(tool):
        slug = tool.get('slug', '')
        score = 0

        # Affiliate priority (higher = more important)
        if slug in AFFILIATE_PRIORITY:
            idx = AFFILIATE_PRIORITY.index(slug)
            score += (len(AFFILIATE_PRIORITY) - idx) * 10

        # Has active affiliate link
        if tool.get('affiliate_url', '').strip():
            score += 500

        # Category priority
        cat = tool.get('category', '')
        if cat in CATEGORY_PRIORITY:
            idx = CATEGORY_PRIORITY.index(cat)
            score += (len(CATEGORY_PRIORITY) - idx) * 5

        # Higher rated tools first
        score += (tool.get('rating', 0) - 3) * 20

        return -score  # Negative for ascending sort

    thin_tools.sort(key=priority_score)
    return thin_tools


def scrape_website(url, timeout=15):
    """Scrape a tool's website for current features and pricing info."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        resp = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        if resp.status_code != 200:
            return f"[Could not access website: HTTP {resp.status_code}]"

        soup = BeautifulSoup(resp.text, 'html.parser')

        # Remove scripts, styles, nav, footer
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'iframe', 'noscript']):
            tag.decompose()

        text = soup.get_text(separator='\n', strip=True)

        # Trim to reasonable size
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        text = '\n'.join(lines[:200])

        if len(text) > 4000:
            text = text[:4000] + "\n[truncated]"

        return text
    except Exception as e:
        return f"[Could not scrape: {e}]"


def generate_deep_review(client_unused, tool, scraped_content):
    """Use Claude CLI (print mode) to generate a deep review for a tool.
    Uses claude -p which has OAuth auth and web search capabilities."""
    existing_data = {
        'name': tool.get('name'),
        'slug': tool.get('slug'),
        'category': tool.get('category'),
        'description_short': tool.get('description_short'),
        'website_url': tool.get('website_url'),
        'pricing': tool.get('pricing'),
        'features': tool.get('features'),
        'markets': tool.get('markets'),
        'pros': tool.get('pros'),
        'cons': tool.get('cons'),
        'rating': tool.get('rating'),
        'founded_year': tool.get('founded_year'),
        'company': tool.get('company'),
        'headquarters': tool.get('headquarters'),
        'best_for': tool.get('best_for'),
        'similar_tools': tool.get('similar_tools'),
    }

    prompt = f"""You are writing a deep, honest review of {tool['name']} for TradingToolsHub.com, an affiliate review site for traders.

EXISTING TOOL DATA:
{json.dumps(existing_data, indent=2)}

SCRAPED FROM THEIR WEBSITE:
{scraped_content[:3000]}

Write a comprehensive review following these STRICT requirements:

1. **Length:** 1,200-1,500 words. No less than 1,200.
2. **Format:** Use ## headings to organize sections. Write in plain text with \\n\\n between paragraphs. Use **bold** for emphasis.
3. **Sections to cover** (adapt headings to the tool):
   - What the tool is and who makes it (company background, founding, key people)
   - Core features and what makes it unique
   - Pricing breakdown with actual numbers (monthly/yearly)
   - Honest pros — what it genuinely does well
   - Honest cons — real limitations, not soft criticisms
   - Who should use it (and who should NOT)
   - How it compares to 1-2 direct competitors
   - The bottom line
4. **Tone:** Honest, direct, non-promotional. Mention real weaknesses. If the free tier sucks, say so. If it's overpriced, say so. If the UI is dated, say so.
5. **No filler:** No "In today's fast-paced trading world..." generic intros.
6. **Pricing must be specific** — use exact dollar amounts from the scraped data or existing JSON. If unsure, say "check their website for current pricing."
7. **SEO:** Include the tool name naturally 5-8 times. Mention the category (e.g., "trading journal", "stock screener") early.

Return your response as a JSON object with these exact keys:
{{
  "description_long": "the full review text with ## headings and \\n\\n separators",
  "meta_title": "Under 60 chars, include tool name and 2026",
  "meta_description": "Under 155 chars, honest and keyword-rich",
  "company_background": "2-3 sentences about the company",
  "pros": ["5-6 short specific bullet points"],
  "cons": ["4-5 short specific bullet points"],
  "best_for": ["4-5 target audiences"],
  "scraped_features": ["10-20 specific features"]
}}

Return ONLY the JSON object. No markdown code blocks. No explanation text before or after."""

    try:
        # Use Claude CLI in print mode (has OAuth auth, no API key needed)
        env = os.environ.copy()
        env.pop('CLAUDECODE', None)  # Allow nested usage

        result = subprocess.run(
            ['claude', '-p', prompt, '--max-turns', '1'],
            capture_output=True, text=True, timeout=120,
            env=env, cwd=TTH_DIR
        )

        if result.returncode != 0:
            print(f"    Claude CLI error: {result.stderr[:200]}", file=sys.stderr)
            return None

        text = result.stdout.strip()

        # Remove markdown code blocks if present
        if text.startswith('```'):
            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```\s*$', '', text)

        # Try to find JSON in the output
        # Sometimes Claude adds text before/after the JSON
        json_match = re.search(r'\{[\s\S]*\}', text)
        if json_match:
            text = json_match.group()

        result_data = json.loads(text)

        # Validate word count
        word_count = len(result_data.get('description_long', '').split())
        if word_count < 800:
            print(f"    WARNING: Review only {word_count} words", file=sys.stderr)
            return None

        return result_data

    except json.JSONDecodeError as e:
        print(f"    JSON parse error: {e}", file=sys.stderr)
        return None
    except subprocess.TimeoutExpired:
        print(f"    Claude CLI timeout (120s)", file=sys.stderr)
        return None
    except Exception as e:
        print(f"    Error: {e}", file=sys.stderr)
        return None


def scrape_social_links(website_url):
    """Scrape a tool's website for social media profile links."""
    social_patterns = {
        'twitter': [r'twitter\.com/\w+', r'x\.com/\w+'],
        'linkedin': [r'linkedin\.com/company/[\w-]+'],
        'youtube': [r'youtube\.com/(?:@[\w-]+|c/[\w-]+|channel/[\w-]+|user/[\w-]+)'],
        'facebook': [r'facebook\.com/[\w.-]+'],
        'instagram': [r'instagram\.com/[\w.-]+'],
        'discord': [r'discord\.(?:gg|com)/[\w-]+'],
        'reddit': [r'reddit\.com/r/[\w-]+'],
        'github': [r'github\.com/[\w-]+'],
        'tiktok': [r'tiktok\.com/@[\w.-]+'],
    }

    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
        resp = requests.get(website_url, headers=headers, timeout=15, allow_redirects=True)
        if resp.status_code != 200:
            return {}

        soup = BeautifulSoup(resp.text, 'html.parser')
        links = set()
        for a in soup.find_all('a', href=True):
            links.add(a['href'])

        socials = {}
        for platform, patterns in social_patterns.items():
            for link in links:
                for pattern in patterns:
                    match = re.search(pattern, link, re.IGNORECASE)
                    if match:
                        # Build full URL
                        if link.startswith('http'):
                            socials[platform] = link.split('?')[0].rstrip('/')
                        else:
                            full = match.group(0)
                            socials[platform] = f"https://{full}"
                        break
                if platform in socials:
                    break

        return socials
    except Exception as e:
        return {}


def generate_review_image(slug, tool_name, category, description_short):
    """Generate an AI review header image using Gemini."""
    try:
        if not os.path.exists(GEMINI_API_KEY_FILE):
            return None
        with open(GEMINI_API_KEY_FILE) as f:
            api_key = f.read().strip()
    except:
        return None

    os.makedirs(IMAGES_DIR, exist_ok=True)
    output_path = os.path.join(IMAGES_DIR, f"{slug}-review-header.webp")

    # Skip if image already exists
    if os.path.exists(output_path):
        return f"/images/tools/{slug}-review-header.webp"

    category_labels = {
        'stock-screeners': 'Stock Screener',
        'charting-platforms': 'Charting Platform',
        'trading-journals': 'Trading Journal',
        'prop-firms': 'Prop Trading Firm',
        'brokers-us': 'US Broker',
        'brokers-international': 'International Broker',
        'options-tools': 'Options Tool',
        'backtesting': 'Backtesting Tool',
        'automated-trading': 'Automated Trading',
        'ai-trading': 'AI Trading Tool',
        'crypto-tools': 'Crypto Tool',
        'news-analytics': 'News & Analytics',
        'education': 'Trading Education',
    }

    cat_label = category_labels.get(category, category.replace('-', ' ').title())

    prompt = (
        f"Generate a clean, professional review header image for '{tool_name}' ({cat_label}). "
        f"The image should be a modern, editorial-style graphic suitable for a financial technology review website. "
        f"Use a dark background (#0B0E14) with teal (#22C55E) accent elements. "
        f"Include abstract trading/finance visual elements like candlestick charts, data grids, or dashboard mockups. "
        f"The text '{tool_name} Review' should be prominently displayed in clean white sans-serif font. "
        f"Below it in smaller text: '{cat_label}'. "
        f"Style: minimal, professional, dark theme. Dimensions: 1200x630 (social sharing ratio). "
        f"No photorealistic people, no logos, no stock photos."
    )

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseModalities": ["TEXT", "IMAGE"],
            }
        }
        resp = requests.post(url, json=payload, timeout=60)
        if resp.status_code != 200:
            print(f"    Gemini API error: {resp.status_code}")
            return None

        data = resp.json()
        candidates = data.get('candidates', [])
        if not candidates:
            return None

        for part in candidates[0].get('content', {}).get('parts', []):
            if 'inlineData' in part:
                img_data = base64.b64decode(part['inlineData']['data'])

                # Save as webp (convert if needed)
                from PIL import Image
                import io
                img = Image.open(io.BytesIO(img_data))
                img.save(output_path, 'WEBP', quality=85)

                size_kb = os.path.getsize(output_path) / 1024
                print(f"    Generated review image: {size_kb:.0f}KB")
                return f"/images/tools/{slug}-review-header.webp"

        return None
    except Exception as e:
        print(f"    Image generation error: {e}")
        return None


def take_screenshots(slug, website_url, tool_name=None):
    """Take homepage and pricing screenshots using Puppeteer."""
    if not tool_name:
        tool_name = slug

    out_dir = os.path.join(SCREENSHOTS_DIR, slug)
    os.makedirs(out_dir, exist_ok=True)

    screenshots_config = [
        {
            "url": website_url,
            "output": os.path.join(out_dir, f"{slug}-homepage.webp"),
            "fullPage": False
        }
    ]

    # Try pricing page
    pricing_urls = [
        f"{website_url.rstrip('/')}/pricing",
        f"{website_url.rstrip('/')}/pricing/",
        f"{website_url.rstrip('/')}/plans",
    ]

    for pu in pricing_urls:
        try:
            r = requests.head(pu, timeout=5, allow_redirects=True,
                            headers={'User-Agent': 'Mozilla/5.0'})
            if r.status_code == 200:
                screenshots_config.append({
                    "url": pu,
                    "output": os.path.join(out_dir, f"{slug}-pricing.webp"),
                    "fullPage": False
                })
                break
        except:
            continue

    node_script = """
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const config = SCREENSHOT_CONFIG;

  for (const item of config) {
    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (['media', 'font'].includes(req.resourceType())) req.abort();
        else req.continue();
      });

      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));

      // Dismiss cookie banners
      for (const sel of ['[class*="cookie"] button', '[class*="consent"] button', 'button[aria-label="Close"]', 'button[aria-label="Accept"]']) {
        try { const btn = await page.$(sel); if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 500)); } } catch(e) {}
      }

      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: item.output, type: 'webp', quality: 85, fullPage: item.fullPage || false });
      console.log('OK: ' + item.output);
      await page.close();
    } catch (err) {
      console.error('FAIL: ' + item.url + ' - ' + err.message);
    }
  }
  await browser.close();
})();
""".replace("SCREENSHOT_CONFIG", json.dumps(screenshots_config, indent=2))

    script_path = os.path.join(TTH_DIR, f'_enrichment_screenshot_{slug}.cjs')
    try:
        with open(script_path, 'w') as f:
            f.write(node_script)

        result = subprocess.run(
            ['node', script_path],
            cwd=TTH_DIR,
            capture_output=True, text=True, timeout=60
        )
        if result.stdout:
            for line in result.stdout.strip().split('\n'):
                print(f"    {line}")
    except subprocess.TimeoutExpired:
        print(f"    Screenshot timeout for {slug}")
    except Exception as e:
        print(f"    Screenshot error: {e}")
    finally:
        if os.path.exists(script_path):
            os.unlink(script_path)

    # Return screenshot entries that were actually created
    results = []
    homepage = os.path.join(out_dir, f"{slug}-homepage.webp")
    if os.path.exists(homepage):
        results.append({
            "label": "homepage",
            "path": f"/screenshots/{slug}/{slug}-homepage.webp",
            "alt": f"{tool_name} homepage"
        })
    pricing = os.path.join(out_dir, f"{slug}-pricing.webp")
    if os.path.exists(pricing):
        results.append({
            "label": "pricing",
            "path": f"/screenshots/{slug}/{slug}-pricing.webp",
            "alt": f"{tool_name} pricing and plans"
        })
    return results


def update_tool_json(tool, review_data, screenshots, social_links=None, review_image=None):
    """Update the tool's JSON file with enriched data."""
    file_path = tool['_file']
    with open(file_path) as f:
        data = json.load(f)

    # Update fields from review
    data['description_long'] = review_data['description_long']
    data['meta_title'] = review_data.get('meta_title', data.get('meta_title', ''))
    data['meta_description'] = review_data.get('meta_description', data.get('meta_description', ''))

    if review_data.get('company_background'):
        data['company_background'] = review_data['company_background']
    if review_data.get('pros'):
        data['pros'] = review_data['pros']
    if review_data.get('cons'):
        data['cons'] = review_data['cons']
    if review_data.get('best_for'):
        data['best_for'] = review_data['best_for']
    if review_data.get('scraped_features'):
        data['scraped_features'] = review_data['scraped_features']

    # Update screenshots
    if screenshots:
        existing = data.get('screenshots', [])
        existing_paths = {s.get('path') for s in existing}
        for s in screenshots:
            if s['path'] not in existing_paths:
                existing.append(s)
        data['screenshots'] = existing

    # Update social links
    if social_links:
        data['social_links'] = social_links

    # Update review header image
    if review_image:
        data['review_image'] = review_image

    data['last_updated'] = datetime.now().strftime('%Y-%m-%d')
    data['enriched_at'] = datetime.now().strftime('%Y-%m-%d')

    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return data


def load_log():
    """Load enrichment log."""
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            return json.load(f)
    return {"runs": [], "enriched_slugs": []}


def save_log(log):
    """Save enrichment log."""
    with open(LOG_FILE, 'w') as f:
        json.dump(log, f, indent=2)


def build_and_push(enriched_slugs):
    """Build the site and push to Vercel."""
    print("\n--- Building site ---")
    result = subprocess.run(
        ['npm', 'run', 'build'],
        cwd=TTH_DIR,
        capture_output=True, text=True, timeout=300
    )

    if result.returncode != 0:
        print(f"BUILD FAILED:\n{result.stderr[-500:]}", file=sys.stderr)
        return False

    # Extract page count
    for line in result.stdout.split('\n'):
        if 'page(s) built' in line:
            print(f"  {line.strip()}")
            break

    # Git commit and push
    print("\n--- Committing and pushing ---")
    slug_list = ', '.join(enriched_slugs[:5])
    if len(enriched_slugs) > 5:
        slug_list += f" +{len(enriched_slugs) - 5} more"

    commands = [
        ['git', 'add', 'src/content/tools/', 'public/screenshots/', 'public/images/tools/'],
        ['git', 'commit', '-m', f'Auto-enrich {len(enriched_slugs)} tool reviews: {slug_list}\n\nCo-Authored-By: claude-flow <ruv@ruv.net>'],
        ['git', 'push'],
    ]

    for cmd in commands:
        r = subprocess.run(cmd, cwd=TTH_DIR, capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            if 'nothing to commit' in r.stdout + r.stderr:
                print("  Nothing to commit")
                return True
            print(f"  Git error: {r.stderr[:200]}", file=sys.stderr)
            return False

    print(f"  Pushed {len(enriched_slugs)} enriched reviews to Vercel")
    return True


def send_telegram_notification(enriched, failed, skipped):
    """Send summary via Telegram."""
    try:
        from tools.gsc_data import send_telegram
    except ImportError:
        try:
            sys.path.insert(0, '/srv/BusinessOps')
            from tools.gsc_data import send_telegram
        except ImportError:
            return

    msg = f"📊 *TTH Enrichment Report*\n"
    msg += f"✅ Enriched: {len(enriched)} tools\n"
    if failed:
        msg += f"❌ Failed: {len(failed)} ({', '.join(failed[:5])})\n"
    if skipped:
        msg += f"⏭️ Skipped: {len(skipped)}\n"

    if enriched:
        msg += f"\n*Enriched:*\n"
        for slug in enriched[:10]:
            msg += f"• {slug}\n"
        if len(enriched) > 10:
            msg += f"• +{len(enriched) - 10} more\n"

    try:
        send_telegram(msg)
    except:
        pass


def main():
    parser = argparse.ArgumentParser(description="TTH Daily Enrichment Engine")
    parser.add_argument("--count", type=int, default=20, help="Number of tools to enrich (default: 20)")
    parser.add_argument("--dry-run", action="store_true", help="Show queue without enriching")
    parser.add_argument("--slug", help="Enrich a specific tool by slug")
    parser.add_argument("--no-push", action="store_true", help="Don't build/push after enrichment")
    parser.add_argument("--no-screenshots", action="store_true", help="Skip screenshot capture")
    args = parser.parse_args()

    print(f"=== TTH Enrichment Engine — {datetime.now().strftime('%Y-%m-%d %H:%M')} ===\n")

    # Load tools
    tools = load_all_tools()
    print(f"Loaded {len(tools)} tools")

    # Get queue
    queue = get_enrichment_queue(tools)
    print(f"Thin tools needing enrichment: {len(queue)}")

    if args.slug:
        # Find specific tool
        matches = [t for t in tools if t.get('slug') == args.slug]
        if not matches:
            print(f"Tool '{args.slug}' not found")
            sys.exit(1)
        queue = matches

    if args.dry_run:
        print(f"\n--- Enrichment Queue (next {args.count}) ---")
        for i, t in enumerate(queue[:args.count]):
            words = len(t.get('description_long', '').split())
            has_aff = '💰' if t.get('affiliate_url', '').strip() else '  '
            print(f"  {i+1:3d}. {has_aff} {t['slug']:30s} ({words:4d} words) [{t.get('category', '?')}]")
        print(f"\n  Total remaining: {len(queue)} thin tools")
        remaining_after = max(0, len(queue) - args.count)
        print(f"  After this run: {remaining_after} remaining (~{remaining_after // 20 + 1} more days)")
        return

    if not queue:
        print("No thin tools remaining — all enriched!")
        return

    # Load log
    log = load_log()

    # Process tools
    to_process = queue[:args.count]
    enriched = []
    failed = []
    skipped = []

    print(f"\nProcessing {len(to_process)} tools...\n")

    for i, tool in enumerate(to_process):
        slug = tool.get('slug', 'unknown')
        name = tool.get('name', slug)
        print(f"[{i+1}/{len(to_process)}] {name} ({slug})")

        # Skip if recently enriched
        if slug in log.get('enriched_slugs', []):
            print(f"  Skipped (already enriched)")
            skipped.append(slug)
            continue

        # Step 1: Scrape website
        website_url = tool.get('website_url', '')
        if website_url:
            print(f"  Scraping {website_url}...")
            scraped = scrape_website(website_url)
        else:
            scraped = "[No website URL available]"

        # Step 2: Generate review
        print(f"  Generating deep review...")
        review_data = generate_deep_review(None, tool, scraped)

        if not review_data:
            # Retry once
            print(f"  Retrying...")
            time.sleep(2)
            review_data = generate_deep_review(None, tool, scraped)

        if not review_data:
            print(f"  FAILED - skipping")
            failed.append(slug)
            continue

        word_count = len(review_data.get('description_long', '').split())
        print(f"  Review: {word_count} words")

        # Step 3: Screenshots
        screenshots = []
        if not args.no_screenshots and website_url:
            print(f"  Taking screenshots...")
            screenshots = take_screenshots(slug, website_url, name)
            print(f"  Captured {len(screenshots)} screenshots")

        # Step 4: Social links
        social_links = {}
        if website_url:
            print(f"  Scraping social links...")
            social_links = scrape_social_links(website_url)
            if social_links:
                print(f"  Found socials: {', '.join(social_links.keys())}")

        # Step 5: AI review header image
        review_image = None
        if not args.no_screenshots:
            print(f"  Generating review image...")
            review_image = generate_review_image(
                slug, name,
                tool.get('category', ''),
                tool.get('description_short', '')
            )

        # Step 6: Update JSON
        update_tool_json(tool, review_data, screenshots, social_links, review_image)
        print(f"  Updated {slug}.json ✓")

        enriched.append(slug)
        log['enriched_slugs'].append(slug)

        # Brief pause between API calls
        if i < len(to_process) - 1:
            time.sleep(1)

    # Save log
    log['runs'].append({
        'date': datetime.now().isoformat(),
        'enriched': enriched,
        'failed': failed,
        'skipped': skipped,
    })
    save_log(log)

    # Build and push
    if enriched and not args.no_push:
        build_and_push(enriched)

    # Summary
    print(f"\n=== Summary ===")
    print(f"  Enriched: {len(enriched)}")
    print(f"  Failed: {len(failed)}")
    print(f"  Skipped: {len(skipped)}")
    print(f"  Remaining: {len(queue) - len(enriched) - len(skipped)} thin tools")

    # Send Telegram notification
    if enriched or failed:
        send_telegram_notification(enriched, failed, skipped)


if __name__ == "__main__":
    main()
