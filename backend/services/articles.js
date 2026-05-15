/**
 * Article Data Service
 * Manages article storage, retrieval, and caching
 * Uses JSON file storage (can be upgraded to MongoDB/PostgreSQL)
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

// In-memory cache
let articlesCache = [];
let cacheTimestamp = 0;
const CACHE_TTL = (process.env.CACHE_TTL_SECONDS || 3600) * 1000;

/**
 * Initialize storage directory and file
 */
async function initStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(ARTICLES_FILE);
      const data = await fs.readFile(ARTICLES_FILE, 'utf-8');
      articlesCache = JSON.parse(data);
      cacheTimestamp = Date.now();
      console.log(`[Storage] Loaded ${articlesCache.length} articles from disk`);
    } catch {
      // File doesn't exist, create with defaults
      await fs.writeFile(ARTICLES_FILE, JSON.stringify([], null, 2));
      articlesCache = [];
      console.log('[Storage] Created new articles storage');
    }
  } catch (err) {
    console.error('[Storage] Init error:', err.message);
    articlesCache = [];
  }
}

/**
 * Get all articles (from cache or disk)
 */
async function getAllArticles(options = {}) {
  const {
    category = null,
    source = null,
    limit = 100,
    offset = 0,
    sortBy = 'date',
    sortOrder = 'desc',
  } = options;

  let articles = [...articlesCache];

  // Filter
  if (category && category !== 'All') {
    articles = articles.filter(a => a.category === category);
  }
  if (source) {
    articles = articles.filter(a => a.source === source);
  }

  // Sort
  articles.sort((a, b) => {
    const aVal = sortBy === 'date' ? a.date : a[sortBy];
    const bVal = sortBy === 'date' ? b.date : b[sortBy];
    return sortOrder === 'desc'
      ? String(bVal).localeCompare(String(aVal))
      : String(aVal).localeCompare(String(bVal));
  });

  // Paginate
  const total = articles.length;
  const paginated = articles.slice(offset, offset + limit);

  return { articles: paginated, total };
}

/**
 * Get article by ID
 */
async function getArticleById(id) {
  return articlesCache.find(a => a.id === id) || null;
}

/**
 * Get articles by category
 */
async function getByCategory(category) {
  return articlesCache.filter(a => a.category === category);
}

/**
 * Insert or update an article (upsert)
 */
async function upsertArticle(article) {
  if (!article || !article.id) return false;

  const index = articlesCache.findIndex(a => a.id === article.id);

  if (index >= 0) {
    // Update existing
    articlesCache[index] = {
      ...articlesCache[index],
      ...article,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // Insert new
    articlesCache.push({
      ...article,
      createdAt: new Date().toISOString(),
    });
  }

  // Persist to disk
  await persist();
  return true;
}

/**
 * Add multiple articles (batch insert)
 */
async function addArticles(articles) {
  let added = 0;
  for (const article of articles) {
    const exists = articlesCache.some(a => a.id === article.id);
    if (!exists) {
      articlesCache.push({
        ...article,
        createdAt: new Date().toISOString(),
      });
      added++;
    }
  }
  if (added > 0) await persist();
  return added;
}

/**
 * Delete article by ID
 */
async function deleteArticle(id) {
  const before = articlesCache.length;
  articlesCache = articlesCache.filter(a => a.id !== id);
  if (articlesCache.length < before) {
    await persist();
    return true;
  }
  return false;
}

/**
 * Get all categories with counts
 */
async function getCategories() {
  const counts = {};
  for (const article of articlesCache) {
    counts[article.category] = (counts[article.category] || 0) + 1;
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

/**
 * Get statistics
 */
async function getStats() {
  return {
    total: articlesCache.length,
    bySource: articlesCache.reduce((acc, a) => {
      acc[a.source] = (acc[a.source] || 0) + 1;
      return acc;
    }, {}),
    byCategory: articlesCache.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {}),
    lastUpdated: cacheTimestamp,
  };
}

/**
 * Persist to disk
 */
async function persist() {
  try {
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articlesCache, null, 2));
    cacheTimestamp = Date.now();
  } catch (err) {
    console.error('[Storage] Persist error:', err.message);
  }
}

/**
 * Refresh from disk
 */
async function refresh() {
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8');
    articlesCache = JSON.parse(data);
    cacheTimestamp = Date.now();
  } catch (err) {
    console.error('[Storage] Refresh error:', err.message);
  }
}

module.exports = {
  initStorage,
  getAllArticles,
  getArticleById,
  getByCategory,
  upsertArticle,
  addArticles,
  deleteArticle,
  getCategories,
  getStats,
  refresh,
};
