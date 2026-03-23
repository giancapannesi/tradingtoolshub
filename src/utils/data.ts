import fs from 'node:fs';
import path from 'node:path';

export interface ToolPricing {
  has_free_tier: boolean;
  starting_price: number;
  tiers: { name: string; price_monthly: number; price_yearly: number; features: string[] }[];
  currency: string;
}

export interface ToolFeatures {
  ai_analysis: boolean;
  backtesting: boolean;
  paper_trading: boolean;
  alerts: boolean;
  mobile_app: boolean;
  api_access: boolean;
  social_features: boolean;
  broker_integration: boolean;
  custom_indicators: boolean;
  automated_trading: boolean;
  journaling: boolean;
  performance_analytics: boolean;
  risk_management: boolean;
  news_feed: boolean;
  education: boolean;
}

export interface Tool {
  name: string;
  slug: string;
  category: string;
  subcategories: string[];
  description_short: string;
  description_long: string;
  logo_url: string;
  screenshots: string[];
  website_url: string;
  affiliate_url: string;
  affiliate_program: string;
  affiliate_commission: string;
  affiliate_cookie_days: number;
  pricing: ToolPricing;
  features: ToolFeatures;
  markets: string[];
  pros: string[];
  cons: string[];
  rating: number;
  rating_breakdown: Record<string, number>;
  founded_year: number;
  company: string;
  headquarters: string;
  best_for: string[];
  similar_tools: string[];
  last_updated: string;
  review_status: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  seo_title: string;
  seo_description: string;
}

export interface Comparison {
  slug: string;
  tool_a: string;
  tool_b: string;
  title: string;
  target_keyword: string;
  summary: string;
  analysis?: string;
}

export interface Listicle {
  slug: string;
  title: string;
  target_keyword: string;
  category: string;
  description: string;
  tools: string[];
}

const TOOLS_DIR = path.join(process.cwd(), 'src/content/tools');
const CONTENT_DIR = path.join(process.cwd(), 'src/content');

let _toolsCache: Tool[] | null = null;

export function getAllTools(): Tool[] {
  if (_toolsCache) return _toolsCache;
  const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.json'));
  _toolsCache = files.map(f => {
    const raw = fs.readFileSync(path.join(TOOLS_DIR, f), 'utf-8');
    return JSON.parse(raw) as Tool;
  }).filter(t => t.review_status === 'published');
  return _toolsCache;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return getAllTools().find(t => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return getAllTools().filter(t => t.category === category).sort((a, b) => b.rating - a.rating);
}

export function getCategories(): Category[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'categories.json'), 'utf-8');
  const cats = JSON.parse(raw) as Category[];
  return cats.map(c => ({
    ...c,
    count: getToolsByCategory(c.slug).length,
  }));
}

export function getComparisons(): Comparison[] {
  const filePath = path.join(CONTENT_DIR, 'comparisons.json');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Comparison[];
}

export function getListicles(): Listicle[] {
  const filePath = path.join(CONTENT_DIR, 'listicles.json');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Listicle[];
}

export interface FeaturedIdea {
  slug: string;
  title: string;
  tool_slug: string;
  category_tag: string;
  excerpt: string;
  content: string;
  target_keyword: string;
  meta_title: string;
  meta_description: string;
  published_date: string;
  last_updated: string;
  read_time_minutes: number;
  pdf_filename: string;
  tags: string[];
}

export function getFeaturedIdeas(): FeaturedIdea[] {
  const filePath = path.join(CONTENT_DIR, 'featured.json');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as FeaturedIdea[];
}

export function getFeaturedBySlug(slug: string): FeaturedIdea | undefined {
  return getFeaturedIdeas().find(f => f.slug === slug);
}

export function getSimilarTools(tool: Tool, limit = 5): Tool[] {
  const all = getAllTools();
  const similar = tool.similar_tools
    .map(slug => all.find(t => t.slug === slug))
    .filter(Boolean) as Tool[];
  if (similar.length >= limit) return similar.slice(0, limit);
  const sameCategory = all
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .sort((a, b) => b.rating - a.rating);
  const combined = [...similar, ...sameCategory.filter(t => !similar.includes(t))];
  return combined.slice(0, limit);
}

export interface BlogPost {
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  published_date: string;
  last_updated: string;
  read_time_minutes: number;
  image: string;
  image_alt: string;
  related_tools: string[];
  related_comparisons: string[];
  target_keyword: string;
}

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

let _blogCache: BlogPost[] | null = null;

export function getBlogPosts(): BlogPost[] {
  if (_blogCache) return _blogCache;
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json'));
  _blogCache = files.map(f => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8');
    return JSON.parse(raw) as BlogPost;
  }).sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
  return _blogCache;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find(p => p.slug === slug);
}

export function getBlogByCategory(category: string): BlogPost[] {
  return getBlogPosts().filter(p => p.category === category);
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}/mo`;
}

export function getFeatureLabel(key: string): string {
  const labels: Record<string, string> = {
    ai_analysis: 'AI Analysis',
    backtesting: 'Backtesting',
    paper_trading: 'Paper Trading',
    alerts: 'Price Alerts',
    mobile_app: 'Mobile App',
    api_access: 'API Access',
    social_features: 'Social Features',
    broker_integration: 'Broker Integration',
    custom_indicators: 'Custom Indicators',
    automated_trading: 'Automated Trading',
    journaling: 'Trade Journaling',
    performance_analytics: 'Performance Analytics',
    risk_management: 'Risk Management',
    news_feed: 'News Feed',
    education: 'Education Content',
  };
  return labels[key] || key;
}
