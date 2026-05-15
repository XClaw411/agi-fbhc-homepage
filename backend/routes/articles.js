/**
 * Articles API Routes
 * GET /api/articles          - List all articles (with filters)
 * GET /api/articles/:id      - Get single article
 * POST /api/articles/scrape  - Trigger manual scrape
 * GET /api/articles/categories - List categories
 * GET /api/articles/stats    - Get statistics
 */

const express = require('express');
const router = express.Router();
const articleService = require('../services/articles');
const wechatScraper = require('../scrapers/wechat');
const githubScraper = require('../scrapers/github');

// ─── GET /api/articles ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      category,
      source,
      limit = '50',
      offset = '0',
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    const result = await articleService.getAllArticles({
      category: category || null,
      source: source || null,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
      sortOrder,
    });

    res.json({
      success: true,
      data: result.articles,
      meta: {
        total: result.total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        category: category || 'All',
      },
    });
  } catch (err) {
    console.error('[API] GET /articles error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/articles/categories ────────────────────────────
router.get('/categories', async (req, res) => {
  try {
    const categories = await articleService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/articles/stats ─────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const stats = await articleService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/articles/:id ───────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/articles/scrape ───────────────────────────────
// Trigger manual scrape (admin endpoint)
router.post('/scrape', async (req, res) => {
  try {
    const { source = 'all' } = req.body;
    const results = { wechat: 0, github: 0, errors: [] };

    // Scrape WeChat
    if (source === 'all' || source === 'wechat') {
      try {
        const articles = await wechatScraper.scrapeAll();
        for (const article of articles) {
          await articleService.upsertArticle(article);
        }
        results.wechat = articles.length;
      } catch (err) {
        results.errors.push(`WeChat: ${err.message}`);
      }
    }

    // Scrape GitHub
    if (source === 'all' || source === 'github') {
      try {
        const events = await githubScraper.scrapeEvents();
        const articles = githubScraper.convertEventsToArticles(events);
        for (const article of articles) {
          await articleService.upsertArticle(article);
        }
        results.github = articles.length;
      } catch (err) {
        results.errors.push(`GitHub: ${err.message}`);
      }
    }

    res.json({
      success: true,
      message: `Scrape complete. Added/updated ${results.wechat + results.github} articles.`,
      results,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/articles/scrape-url ───────────────────────────
// Scrape a specific WeChat URL
router.post('/scrape-url', async (req, res) => {
  try {
    const { url, category = 'Group News' } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const article = await wechatScraper.scrapeByUrl(url, category);
    if (!article) {
      return res.status(500).json({ success: false, error: 'Failed to scrape article' });
    }

    await articleService.upsertArticle(article);
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
