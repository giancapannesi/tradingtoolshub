#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = join(__dirname, '..');
const reportRoot = process.env.TTH_PERF_REPORT_DIR || '/srv/BusinessOps/TradingToolsHub_SEO/performance';
const historyPath = join(reportRoot, 'history.jsonl');
const latestJsonPath = join(reportRoot, 'latest.json');
const latestMdPath = join(reportRoot, 'latest.md');
const chromePath = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';

const urls = [
  { label: 'Home', url: 'https://tradingtoolshub.com/' },
  { label: 'Prop Firms Hub', url: 'https://tradingtoolshub.com/prop-firms/' },
  { label: 'Futures Prop Firm Listicle', url: 'https://tradingtoolshub.com/best/best-prop-firms-futures/' },
  { label: 'TradingView Review', url: 'https://tradingtoolshub.com/review/tradingview/' },
  { label: 'TradingView vs TrendSpider', url: 'https://tradingtoolshub.com/compare/tradingview-vs-trendspider/' },
];

const thresholds = {
  performance: 0.8,
  seo: 0.9,
  accessibility: 0.9,
  bestPractices: 0.9,
  largestContentfulPaintMs: 2500,
  cumulativeLayoutShift: 0.1,
  totalBlockingTimeMs: 200,
};

function score(category) {
  return typeof category?.score === 'number' ? Math.round(category.score * 100) : null;
}

function auditValue(audits, key) {
  const audit = audits[key];
  if (!audit) return null;
  return {
    numericValue: typeof audit.numericValue === 'number' ? audit.numericValue : null,
    displayValue: audit.displayValue || null,
  };
}

function runLighthouse(target) {
  const outputPath = join(reportRoot, `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
  const args = [
    target.url,
    '--output=json',
    `--output-path=${outputPath}`,
    '--quiet',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--preset=desktop',
    `--chrome-path=${chromePath}`,
    '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
  ];

  const result = spawnSync('npx', ['lighthouse', ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });

  if (result.status !== 0) {
    throw new Error(`Lighthouse failed for ${target.url}: ${result.stderr || result.stdout}`);
  }

  const lhr = JSON.parse(readFileSync(outputPath, 'utf8'));
  rmSync(outputPath, { force: true });

  const categories = lhr.categories || {};
  const audits = lhr.audits || {};
  const metrics = {
    firstContentfulPaint: auditValue(audits, 'first-contentful-paint'),
    largestContentfulPaint: auditValue(audits, 'largest-contentful-paint'),
    speedIndex: auditValue(audits, 'speed-index'),
    totalBlockingTime: auditValue(audits, 'total-blocking-time'),
    cumulativeLayoutShift: auditValue(audits, 'cumulative-layout-shift'),
  };

  return {
    label: target.label,
    url: target.url,
    finalUrl: lhr.finalDisplayedUrl || lhr.finalUrl || target.url,
    fetchTime: lhr.fetchTime,
    scores: {
      performance: score(categories.performance),
      accessibility: score(categories.accessibility),
      bestPractices: score(categories['best-practices']),
      seo: score(categories.seo),
    },
    metrics,
  };
}

function formatMs(metric) {
  if (!metric?.numericValue && metric?.numericValue !== 0) return 'n/a';
  return `${Math.round(metric.numericValue)} ms`;
}

function formatCls(metric) {
  if (!metric?.numericValue && metric?.numericValue !== 0) return 'n/a';
  return metric.numericValue.toFixed(3);
}

function findWarnings(pages) {
  const warnings = [];

  for (const page of pages) {
    if (page.scores.performance !== null && page.scores.performance < thresholds.performance * 100) {
      warnings.push(`${page.label}: performance ${page.scores.performance} < ${thresholds.performance * 100}`);
    }
    if (page.scores.seo !== null && page.scores.seo < thresholds.seo * 100) {
      warnings.push(`${page.label}: SEO ${page.scores.seo} < ${thresholds.seo * 100}`);
    }
    if (page.scores.accessibility !== null && page.scores.accessibility < thresholds.accessibility * 100) {
      warnings.push(`${page.label}: accessibility ${page.scores.accessibility} < ${thresholds.accessibility * 100}`);
    }
    if (page.scores.bestPractices !== null && page.scores.bestPractices < thresholds.bestPractices * 100) {
      warnings.push(`${page.label}: best practices ${page.scores.bestPractices} < ${thresholds.bestPractices * 100}`);
    }

    const lcp = page.metrics.largestContentfulPaint?.numericValue;
    const cls = page.metrics.cumulativeLayoutShift?.numericValue;
    const tbt = page.metrics.totalBlockingTime?.numericValue;

    if (typeof lcp === 'number' && lcp > thresholds.largestContentfulPaintMs) {
      warnings.push(`${page.label}: LCP ${Math.round(lcp)} ms > ${thresholds.largestContentfulPaintMs} ms`);
    }
    if (typeof cls === 'number' && cls > thresholds.cumulativeLayoutShift) {
      warnings.push(`${page.label}: CLS ${cls.toFixed(3)} > ${thresholds.cumulativeLayoutShift}`);
    }
    if (typeof tbt === 'number' && tbt > thresholds.totalBlockingTimeMs) {
      warnings.push(`${page.label}: TBT ${Math.round(tbt)} ms > ${thresholds.totalBlockingTimeMs} ms`);
    }
  }

  return warnings;
}

function makeMarkdown(report) {
  const lines = [
    '# TradingToolsHub Weekly Performance Tracker',
    '',
    `Run: ${report.runAt}`,
    `Status: ${report.warnings.length ? 'Needs review' : 'Within thresholds'}`,
    '',
    '| Page | Perf | SEO | A11y | Best | LCP | TBT | CLS |',
    '|---|---:|---:|---:|---:|---:|---:|---:|',
  ];

  for (const page of report.pages) {
    lines.push(`| [${page.label}](${page.url}) | ${page.scores.performance ?? 'n/a'} | ${page.scores.seo ?? 'n/a'} | ${page.scores.accessibility ?? 'n/a'} | ${page.scores.bestPractices ?? 'n/a'} | ${formatMs(page.metrics.largestContentfulPaint)} | ${formatMs(page.metrics.totalBlockingTime)} | ${formatCls(page.metrics.cumulativeLayoutShift)} |`);
  }

  lines.push('', '## Thresholds', '');
  lines.push(`- Performance >= ${thresholds.performance * 100}`);
  lines.push(`- SEO/accessibility/best practices >= ${thresholds.seo * 100}/${thresholds.accessibility * 100}/${thresholds.bestPractices * 100}`);
  lines.push(`- LCP <= ${thresholds.largestContentfulPaintMs} ms, TBT <= ${thresholds.totalBlockingTimeMs} ms, CLS <= ${thresholds.cumulativeLayoutShift}`);

  if (report.warnings.length) {
    lines.push('', '## Review Items', '');
    for (const warning of report.warnings) {
      lines.push(`- ${warning}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

if (!existsSync(reportRoot)) {
  mkdirSync(reportRoot, { recursive: true });
}

const runAt = new Date().toISOString();
const pages = [];

for (const target of urls) {
  console.log(`Auditing ${target.label}: ${target.url}`);
  pages.push(runLighthouse(target));
}

const report = {
  runAt,
  thresholds,
  pages,
  warnings: findWarnings(pages),
};

writeFileSync(latestJsonPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(latestMdPath, makeMarkdown(report));
writeFileSync(historyPath, `${JSON.stringify(report)}\n`, { flag: 'a' });

console.log(`Wrote ${latestMdPath}`);
if (report.warnings.length) {
  console.log(`Review needed: ${report.warnings.length} warning(s)`);
  for (const warning of report.warnings) {
    console.log(`- ${warning}`);
  }
} else {
  console.log('All tracked pages are within thresholds.');
}
