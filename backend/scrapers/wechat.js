/**
 * WeChat Article Scraper
 * Scrapes WeChat Official Account articles from given URLs
 * Extracts: title, summary, content, publish date, author, cover image, tags
 */

const axios = require('axios');
const cheerio = require('cheerio');

// WeChat article URLs to monitor
const WECHAT_ARTICLE_URLS = [
  'https://mp.weixin.qq.com/s/kVTEg92hJVNL01XxZIHIzw',
  // Add more article URLs here as they are published
];

// Additional known article URLs (can be populated manually or via feed)
const KNOWN_ARTICLES = [
  {
    url: 'https://mp.weixin.qq.com/s/kVTEg92hJVNL01XxZIHIzw',
    category: 'LLM & Agents',
    source: 'WeChat',
    tags: ['Multi-Agent', 'LLM', 'System Design'],
  },
];

// Browser-like headers to avoid being blocked
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
};

/**
 * Scrape a single WeChat article
 */
async function scrapeArticle(articleMeta) {
  const { url, category = 'Group News', tags = [] } = articleMeta;

  try {
    console.log(`[WeChat] Scraping: ${url}`);

    const response = await axios.get(url, {
      headers: DEFAULT_HEADERS,
      timeout: 30000,
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Extract article metadata
    const title = $('#activity_name').text().trim()
      || $('h2.rich_media_title').text().trim()
      || $('meta[property="og:title"]').attr('content')
      || 'Untitled Article';

    const description = $('meta[property="og:description"]').attr('content')
      || $('#js_content').text().trim().slice(0, 200) + '...'
      || '';

    const publishTime = $('em#publish_time').text().trim()
      || $('meta[name="publish_time"]').attr('content')
      || new Date().toISOString().split('T')[0];

    const author = $('span.profile_nickname').text().trim()
      || $('a#js_name').text().trim()
      || 'AGI&FBHC Lab';

    const coverImage = $('meta[property="og:image"]').attr('content') || '';

    // Extract full content (simplified - first few paragraphs)
    const contentParagraphs = [];
    $('#js_content p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 10) {
        contentParagraphs.push(text);
      }
    });

    // Build English translation (placeholder - real i18n would use translation API)
    const content = contentParagraphs.slice(0, 10).join('\n\n') || description;
    const contentEn = content; // Would be translated in production

    // Generate excerpt (first 150 chars)
    const excerpt = description.length > 150
      ? description.slice(0, 150) + '...'
      : description;

    const article = {
      id: `wechat_${Buffer.from(url).toString('base64').slice(0, 12)}`,
      title,
      excerpt,
      content,
      contentEn,
      category,
      source: 'WeChat',
      author,
      date: formatDate(publishTime),
      url,
      coverImage,
      tags: tags.length > 0 ? tags : extractTags(title + ' ' + description),
      scrapedAt: new Date().toISOString(),
    };

    console.log(`[WeChat] ✓ Scraped: "${title}" (${article.date})`);
    return article;

  } catch (err) {
    console.error(`[WeChat] ✗ Failed to scrape ${url}:`, err.message);
    return null;
  }
}

/**
 * Scrape all configured WeChat articles
 */
async function scrapeAll() {
  const articles = [];
  const urlsToScrape = [...KNOWN_ARTICLES];

  for (const meta of urlsToScrape) {
    // Rate limiting - delay between requests
    await delay(2000);

    const article = await scrapeArticle(meta);
    if (article) {
      articles.push(article);
    }
  }

  return articles;
}

/**
 * Scrape a single article by URL (API endpoint)
 */
async function scrapeByUrl(url, category = 'Group News') {
  return scrapeArticle({ url, category });
}

/**
 * Extract relevant tags from content
 */
function extractTags(text) {
  const tagMap = {
    '大模型': 'LLM',
    '智能体': 'Agents',
    '多智能体': 'Multi-Agent',
    '蛋白质': 'Protein',
    '生物信息': 'Bioinformatics',
    '医疗': 'Medical AI',
    '临床': 'Clinical AI',
    '知识图谱': 'Knowledge Graph',
    'BUAgents': 'Multi-Agent',
    'XClaw': 'Platform',
    '平台': 'Platform',
    '论文': 'Paper',
    '获奖': 'Award',
  };

  const foundTags = [];
  for (const [keyword, tag] of Object.entries(tagMap)) {
    if (text.includes(keyword) && !foundTags.includes(tag)) {
      foundTags.push(tag);
    }
  }
  return foundTags.length > 0 ? foundTags : ['Research'];
}

/**
 * Format date string to YYYY-MM-DD
 */
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toISOString().split('T')[0];
  } catch {
    return dateStr;
  }
}

/**
 * Delay utility
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  scrapeAll,
  scrapeByUrl,
  scrapeArticle,
  WECHAT_ARTICLE_URLS,
};
