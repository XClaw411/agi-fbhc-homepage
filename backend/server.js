/**
 * AGI&FBHC Backend Server
 * Provides APIs for:
 * - WeChat article scraping
 * - GitHub organization data
 * - Article management with caching
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

// Import routes
const articlesRouter = require('./routes/articles');
const githubRouter = require('./routes/github');

// Import scrapers for scheduled tasks
const wechatScraper = require('./scrapers/wechat');
const githubScraper = require('./scrapers/github');
const articleService = require('./services/articles');

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// ─── Request logging ─────────────────────────────────────────
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.path}`);
  next();
});

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/articles', articlesRouter);
app.use('/api/github', githubRouter);

// ─── Error handling ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ─── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found', path: req.path });
});

// ─── Scheduled scraping tasks ────────────────────────────────
const SCRAPE_INTERVAL = process.env.WECHAT_SCRAPE_INTERVAL_MINUTES || 60;

// Initial scrape on startup
console.log('[Server] Running initial data scrape...');
(async () => {
  try {
    await articleService.initStorage();
    await runFullScrape();
    console.log('[Server] Initial scrape complete');
  } catch (err) {
    console.error('[Server] Initial scrape failed:', err.message);
  }
})();

// Scheduled scrape every N minutes
console.log(`[Server] Scheduled scraping every ${SCRAPE_INTERVAL} minutes`);
cron.schedule(`*/${SCRAPE_INTERVAL} * * * *`, async () => {
  console.log('[Cron] Running scheduled scrape...');
  await runFullScrape();
});

async function runFullScrape() {
  try {
    // Scrape WeChat articles
    const wechatArticles = await wechatScraper.scrapeAll();
    console.log(`[Scrape] WeChat: ${wechatArticles.length} articles`);
    for (const article of wechatArticles) {
      await articleService.upsertArticle(article);
    }

    // Scrape GitHub data
    const githubRepos = await githubScraper.scrapeRepos();
    const githubEvents = await githubScraper.scrapeEvents();
    console.log(`[Scrape] GitHub: ${githubRepos.length} repos, ${githubEvents.length} events`);

    // Convert GitHub events to articles
    const githubArticles = githubScraper.convertEventsToArticles(githubEvents);
    for (const article of githubArticles) {
      await articleService.upsertArticle(article);
    }
  } catch (err) {
    console.error('[Scrape] Error:', err.message);
  }
}

// ─── Start server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║  AGI&FBHC Backend Server                          ║
║  Port: ${PORT}                                    ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  API Base: http://localhost:${PORT}/api           ║
╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
