#!/usr/bin/env node
/**
 * Manual Scrape Script
 * Usage: node scripts/manual-scrape.js [wechat|github|all]
 */

const dotenv = require('dotenv');
dotenv.config();

const wechatScraper = require('../scrapers/wechat');
const githubScraper = require('../scrapers/github');
const articleService = require('../services/articles');

async function main() {
  const source = process.argv[2] || 'all';
  console.log(`[Manual Scrape] Source: ${source}\n`);

  await articleService.initStorage();

  // WeChat
  if (source === 'all' || source === 'wechat') {
    console.log('[Manual Scrape] === WeChat Articles ===');
    const articles = await wechatScraper.scrapeAll();
    console.log(`  Found: ${articles.length} articles`);
    for (const article of articles) {
      await articleService.upsertArticle(article);
      console.log(`  ✓ Saved: "${article.title}"`);
    }
  }

  // GitHub
  if (source === 'all' || source === 'github') {
    console.log('\n[Manual Scrape] === GitHub Events ===');
    const repos = await githubScraper.scrapeRepos();
    console.log(`  Repos: ${repos.length}`);

    const events = await githubScraper.scrapeEvents();
    console.log(`  Events: ${events.length}`);

    const articles = githubScraper.convertEventsToArticles(events);
    for (const article of articles) {
      await articleService.upsertArticle(article);
      console.log(`  ✓ Saved: "${article.title}"`);
    }

    console.log(`\n  Repo list:`);
    repos.forEach(r => console.log(`    - ${r.name} (${r.stars}⭐, ${r.language})`));
  }

  // Stats
  const stats = await articleService.getStats();
  console.log(`\n[Manual Scrape] === Total Articles: ${stats.total} ===`);
  console.log('By source:', stats.bySource);
  console.log('By category:', stats.byCategory);
}

main().catch(console.error);
