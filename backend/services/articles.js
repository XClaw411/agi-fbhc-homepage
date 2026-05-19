/**
 * Article Data Service
 * Manages article storage, retrieval using MySQL
 * Replaces JSON file storage with database
 */

const db = require('./db');

// In-memory cache for hot data
let articlesCache = [];
let cacheTimestamp = 0;
const CACHE_TTL = (process.env.CACHE_TTL_SECONDS || 300) * 1000; // 5 min default

/**
 * Initialize storage - test DB connection and warm cache
 */
async function initStorage() {
  const ok = await db.testConnection();
  if (!ok) {
    console.error('[Storage] Database connection failed, using empty cache');
    articlesCache = [];
    return;
  }
  await warmCache();
}

/**
 * Warm cache from database
 */
async function warmCache() {
  try {
    const rows = await db.query(
      'SELECT * FROM articles ORDER BY date DESC, created_at DESC LIMIT 1000'
    );
    articlesCache = rows.map(row => ({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    }));
    cacheTimestamp = Date.now();
    console.log(`[Storage] Cache warmed: ${articlesCache.length} articles`);
  } catch (err) {
    console.error('[Storage] Cache warm failed:', err.message);
  }
}

/**
 * Check if cache is stale
 */
function isCacheStale() {
  return Date.now() - cacheTimestamp > CACHE_TTL;
}

/**
 * Get all articles with filters
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

  // Build query
  let sql = 'SELECT * FROM articles WHERE 1=1';
  const params = [];

  // 过滤低质量内容：排除无意义的 GitHub 自动事件
  sql += ` AND NOT (
    source = 'GitHub'
    AND (
      title LIKE '%0 commits pushed%'
      OR title LIKE '%New branch created%'
      OR title LIKE '%New tag created%'
      OR title LIKE '%pull request%merged%'
      OR title LIKE '%pull request%opened%'
      OR title LIKE '%issue%opened%'
      OR title LIKE '%issue%closed%'
    )
  )`;

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (source) {
    sql += ' AND source = ?';
    params.push(source);
  }

  // Sort
  const validSortColumns = ['date', 'created_at', 'updated_at', 'title', 'source'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'date';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
  sql += ` ORDER BY ${sortColumn} ${order}, created_at DESC`;

  // Count total (同样应用过滤条件)
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
  const countRows = await db.query(countSql.replace(/ORDER BY.*$/, ''), params);
  const total = countRows[0]?.total || 0;

  // Paginate
  sql += ' LIMIT ? OFFSET ?';
  params.push(String(parseInt(limit)), String(parseInt(offset)));

  const rows = await db.query(sql, params);
  const articles = rows.map(row => ({
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
  }));

  return { articles, total };
}

/**
 * Get article by ID
 */
async function getArticleById(id) {
  const rows = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
  if (!rows.length) return null;
  const row = rows[0];
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
  };
}

/**
 * Get articles by category
 */
async function getByCategory(category) {
  const rows = await db.query(
    'SELECT * FROM articles WHERE category = ? ORDER BY date DESC',
    [category]
  );
  return rows.map(row => ({
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
  }));
}

/**
 * Insert or update an article (upsert)
 */
async function upsertArticle(article) {
  if (!article || !article.id) return false;

  const {
    id, title, excerpt = '', content = '', contentEn = '',
    category, source, author = '', date, url,
    coverImage = '', tags = [],
  } = article;

  const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : tags;

  const sql = `
    INSERT INTO articles (
      id, title, excerpt, content, content_en, category,
      source, author, date, url, cover_image, tags, scraped_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      excerpt = VALUES(excerpt),
      content = VALUES(content),
      content_en = VALUES(content_en),
      category = VALUES(category),
      source = VALUES(source),
      author = VALUES(author),
      date = VALUES(date),
      url = VALUES(url),
      cover_image = VALUES(cover_image),
      tags = VALUES(tags),
      scraped_at = VALUES(scraped_at),
      updated_at = NOW()
  `;

  await db.query(sql, [
    id, title, excerpt, content, contentEn, category,
    source, author, date, url, coverImage, tagsJson,
  ]);

  // Invalidate cache
  cacheTimestamp = 0;
  return true;
}

/**
 * Add multiple articles (batch insert)
 */
async function addArticles(articles) {
  let added = 0;
  for (const article of articles) {
    const exists = await db.query('SELECT 1 FROM articles WHERE id = ?', [article.id]);
    if (!exists.length) {
      await upsertArticle(article);
      added++;
    }
  }
  if (added > 0) cacheTimestamp = 0;
  return added;
}

/**
 * Delete article by ID
 */
async function deleteArticle(id) {
  const result = await db.query('DELETE FROM articles WHERE id = ?', [id]);
  if (result.affectedRows > 0) {
    cacheTimestamp = 0;
    return true;
  }
  return false;
}

/**
 * Get all categories with counts
 */
async function getCategories() {
  const rows = await db.query(`
    SELECT category as name, COUNT(*) as count
    FROM articles
    GROUP BY category
    ORDER BY count DESC
  `);
  return rows;
}

/**
 * Get statistics
 */
async function getStats() {
  const [totalRows, sourceRows, categoryRows] = await Promise.all([
    db.query('SELECT COUNT(*) as total FROM articles'),
    db.query('SELECT source, COUNT(*) as count FROM articles GROUP BY source'),
    db.query('SELECT category, COUNT(*) as count FROM articles GROUP BY category'),
  ]);

  return {
    total: totalRows[0]?.total || 0,
    bySource: sourceRows.reduce((acc, r) => { acc[r.source] = r.count; return acc; }, {}),
    byCategory: categoryRows.reduce((acc, r) => { acc[r.category] = r.count; return acc; }, {}),
    lastUpdated: cacheTimestamp,
  };
}

/**
 * Refresh from database (manual cache refresh)
 */
async function refresh() {
  await warmCache();
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
