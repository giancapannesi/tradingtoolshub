#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const reportsDir = process.env.TTH_GSC_REPORT_DIR || '/srv/BusinessOps/TradingToolsHub_SEO/gsc_reports';
const outputDir = process.env.TTH_TRAFFIC_REPORT_DIR || '/srv/BusinessOps/TradingToolsHub_SEO/traffic';
const latestJsonPath = join(outputDir, 'latest.json');
const latestMdPath = join(outputDir, 'latest.md');
const historyPath = join(outputDir, 'history.jsonl');

function loadReports() {
  if (!existsSync(reportsDir)) return [];
  return readdirSync(reportsDir)
    .filter(file => /^gsc_report_\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .map(file => {
      const path = join(reportsDir, file);
      try {
        return { file, path, data: JSON.parse(readFileSync(path, 'utf8')) };
      } catch (error) {
        return { file, path, error: error.message };
      }
    })
    .filter(report => report.data)
    .sort((a, b) => String(a.data.generated).localeCompare(String(b.data.generated)));
}

function periodSummary(report, period) {
  const data = report?.data?.periods?.[period] || report?.data?.summary || {};
  return {
    clicks: Number(data.clicks || 0),
    impressions: Number(data.impressions || 0),
    ctr: Number(data.ctr || 0),
    avgPosition: Number(data.avg_position || data.position || 0),
  };
}

function delta(current, previous) {
  if (!previous && previous !== 0) return null;
  return current - previous;
}

function pctDelta(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

function formatPct(value) {
  return value === null ? 'n/a' : `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function makeTrend(latest, previous) {
  const periods = ['7day', '28day', '90day'];
  return Object.fromEntries(periods.map(period => {
    const now = periodSummary(latest, period);
    const before = previous ? periodSummary(previous, period) : null;
    return [period, {
      ...now,
      clicksDelta: before ? delta(now.clicks, before.clicks) : null,
      impressionsDelta: before ? delta(now.impressions, before.impressions) : null,
      clicksPctDelta: before ? pctDelta(now.clicks, before.clicks) : null,
      impressionsPctDelta: before ? pctDelta(now.impressions, before.impressions) : null,
    }];
  }));
}

function topRows(rows, limit = 10) {
  return Array.isArray(rows) ? rows.slice(0, limit) : [];
}

function makeMarkdown(snapshot) {
  const lines = [
    '# TradingToolsHub Traffic Tracker',
    '',
    `Run: ${snapshot.checkedAt}`,
    `Latest GSC report: ${snapshot.latestReportDate}`,
    '',
    '| Period | Clicks | Clicks Δ | Impressions | Impr. Δ | CTR | Avg Pos |',
    '|---|---:|---:|---:|---:|---:|---:|',
  ];

  for (const period of ['7day', '28day', '90day']) {
    const row = snapshot.trend[period];
    lines.push(`| ${period} | ${row.clicks} | ${formatPct(row.clicksPctDelta)} | ${row.impressions} | ${formatPct(row.impressionsPctDelta)} | ${row.ctr.toFixed(2)}% | ${row.avgPosition.toFixed(1)} |`);
  }

  lines.push('', '## Top Pages', '');
  if (!snapshot.topPages.length) {
    lines.push('- No page rows in latest report.');
  } else {
    for (const page of snapshot.topPages) {
      lines.push(`- ${page.page}: ${page.clicks || 0} clicks, ${page.impressions || 0} impressions, pos ${Number(page.position || 0).toFixed(1)}`);
    }
  }

  lines.push('', '## Top Keywords', '');
  if (!snapshot.topKeywords.length) {
    lines.push('- No keyword rows in latest report.');
  } else {
    for (const keyword of snapshot.topKeywords) {
      lines.push(`- ${keyword.query || keyword.keyword}: ${keyword.clicks || 0} clicks, ${keyword.impressions || 0} impressions, pos ${Number(keyword.position || 0).toFixed(1)}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

mkdirSync(outputDir, { recursive: true });

const reports = loadReports();
if (!reports.length) {
  console.error(`No GSC reports found in ${reportsDir}`);
  process.exit(1);
}

const latest = reports.at(-1);
const previous = reports.length > 1 ? reports.at(-2) : null;
const snapshot = {
  checkedAt: new Date().toISOString(),
  latestReportDate: latest.data.generated,
  latestReportFile: latest.file,
  previousReportDate: previous?.data?.generated || null,
  trend: makeTrend(latest, previous),
  topPages: topRows(latest.data.top_pages || latest.data.summary?.top_pages),
  topKeywords: topRows(latest.data.top_keywords || latest.data.summary?.top_keywords),
};

writeFileSync(latestJsonPath, `${JSON.stringify(snapshot, null, 2)}\n`);
writeFileSync(latestMdPath, makeMarkdown(snapshot));
writeFileSync(historyPath, `${JSON.stringify(snapshot)}\n`, { flag: 'a' });

const seven = snapshot.trend['7day'];
console.log(`Traffic snapshot ${snapshot.latestReportDate}: 7d ${seven.clicks} clicks, ${seven.impressions} impressions, CTR ${seven.ctr.toFixed(2)}%, pos ${seven.avgPosition.toFixed(1)}`);
