import type { APIRoute } from 'astro';
import { getAllTools, getComparisons, getToolBySlug } from '../utils/data';

export const GET: APIRoute = () => {
  const siteUrl = 'https://tradingtoolshub.com';
  const allTools = getAllTools();
  const comparisons = getComparisons();

  // Sort tools by last_updated descending, take top 20
  const recentTools = [...allTools]
    .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
    .slice(0, 20);

  // Build comparison items from comparisons that have both tools
  const recentComparisons = comparisons
    .map(c => {
      const toolA = getToolBySlug(c.tool_a);
      const toolB = getToolBySlug(c.tool_b);
      if (!toolA || !toolB) return null;
      const latestDate = toolA.last_updated > toolB.last_updated ? toolA.last_updated : toolB.last_updated;
      return { ...c, toolA, toolB, date: latestDate };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime())
    .slice(0, 10);

  const buildDate = new Date().toUTCString();

  const toolItems = recentTools.map(tool => `    <item>
      <title><![CDATA[${tool.name} Review — Features, Pricing & Analysis]]></title>
      <link>${siteUrl}/review/${tool.slug}/</link>
      <guid isPermaLink="true">${siteUrl}/review/${tool.slug}/</guid>
      <description><![CDATA[${tool.description_short}]]></description>
      <pubDate>${new Date(tool.last_updated).toUTCString()}</pubDate>
      <category>${tool.category}</category>
    </item>`).join('\n');

  const comparisonItems = recentComparisons.map(c => `    <item>
      <title><![CDATA[${c!.toolA.name} vs ${c!.toolB.name} — Head-to-Head Comparison]]></title>
      <link>${siteUrl}/compare/${c!.slug}/</link>
      <guid isPermaLink="true">${siteUrl}/compare/${c!.slug}/</guid>
      <description><![CDATA[${c!.summary || `Compare ${c!.toolA.name} and ${c!.toolB.name} side-by-side — features, pricing, and which is right for you.`}]]></description>
      <pubDate>${new Date(c!.date).toUTCString()}</pubDate>
      <category>comparisons</category>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TradingToolsHub — Trading Tool Reviews &amp; Comparisons</title>
    <link>${siteUrl}</link>
    <description>Compare 200+ trading tools, platforms, and brokers. Honest reviews, pricing comparisons, and feature breakdowns for journals, charting, brokers, prop firms, and more.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>editorial@tradingtoolshub.com (TradingToolsHub)</managingEditor>
    <webMaster>editorial@tradingtoolshub.com (TradingToolsHub)</webMaster>
    <copyright>Copyright 2026 TradingToolsHub</copyright>
    <ttl>1440</ttl>
${toolItems}
${comparisonItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
