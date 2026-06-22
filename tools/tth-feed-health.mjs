#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const feedUrl = process.env.TTH_FEED_URL || 'https://tradingtoolshub.com/feed.xml';
const reportRoot = process.env.TTH_FEED_REPORT_DIR || '/srv/BusinessOps/TradingToolsHub_SEO/feed_health';
const latestPath = join(reportRoot, 'latest.json');
const historyPath = join(reportRoot, 'history.jsonl');
const staleDays = Number(process.env.TTH_FEED_STALE_DAYS || 7);
const minItems = Number(process.env.TTH_FEED_MIN_ITEMS || 30);
const minBlogItems = Number(process.env.TTH_FEED_MIN_BLOG_ITEMS || 10);

function textBetween(source, tag) {
  const match = source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
}

function itemBlocks(xml) {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(match => match[0]);
}

function stripCdata(value) {
  return value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
}

function parseItems(xml) {
  return itemBlocks(xml).map(block => ({
    title: stripCdata(textBetween(block, 'title')),
    link: textBetween(block, 'link'),
    pubDate: textBetween(block, 'pubDate'),
    category: textBetween(block, 'category'),
  }));
}

function ageDays(date) {
  return (Date.now() - date.getTime()) / 86400000;
}

mkdirSync(reportRoot, { recursive: true });

const checkedAt = new Date().toISOString();
const response = await fetch(feedUrl, {
  headers: { 'User-Agent': 'TradingToolsHubFeedHealth/1.0' },
});
const xml = await response.text();
const items = parseItems(xml);
const latestPubDate = items
  .map(item => new Date(item.pubDate))
  .filter(date => !Number.isNaN(date.getTime()))
  .sort((a, b) => b.getTime() - a.getTime())[0] || null;
const blogItems = items.filter(item => item.link.includes('/blog/'));

const warnings = [];
if (!response.ok) warnings.push(`Feed returned HTTP ${response.status}`);
if (!response.headers.get('content-type')?.includes('xml')) {
  warnings.push(`Unexpected content type: ${response.headers.get('content-type') || 'missing'}`);
}
if (!xml.includes('<rss') || !xml.includes('<channel>')) warnings.push('Feed XML is missing rss/channel tags');
if (items.length < minItems) warnings.push(`Feed has ${items.length} items; expected at least ${minItems}`);
if (blogItems.length < minBlogItems) warnings.push(`Feed has ${blogItems.length} blog items; expected at least ${minBlogItems}`);
if (!latestPubDate) {
  warnings.push('No valid item pubDate found');
} else if (ageDays(latestPubDate) > staleDays) {
  warnings.push(`Newest item is ${ageDays(latestPubDate).toFixed(1)} days old; threshold is ${staleDays}`);
}

const report = {
  checkedAt,
  feedUrl,
  status: warnings.length ? 'needs_review' : 'ok',
  httpStatus: response.status,
  contentType: response.headers.get('content-type'),
  itemCount: items.length,
  blogItemCount: blogItems.length,
  latestPubDate: latestPubDate?.toISOString() || null,
  latestItems: items.slice(0, 10),
  warnings,
};

writeFileSync(latestPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(historyPath, `${JSON.stringify(report)}\n`, { flag: 'a' });

console.log(`${report.status.toUpperCase()}: ${items.length} items, ${blogItems.length} blog items, latest ${report.latestPubDate || 'n/a'}`);
if (warnings.length) {
  for (const warning of warnings) console.log(`- ${warning}`);
  process.exitCode = 1;
}
