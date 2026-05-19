#!/usr/bin/env node
/**
 * GitHub Repo Sync Script
 * Fetches all repos from AGI-FBHC org, reads README summaries,
 * and upserts them into the database.
 *
 * Usage:
 *   node scripts/sync_github_repos.js           # full sync with README
 *   node scripts/sync_github_repos.js --quick   # skip README (metadata only)
 *   node scripts/sync_github_repos.js --max 5   # process first 5 repos only
 *   node scripts/sync_github_repos.js --dry-run # don't write to DB
 */

require('dotenv').config();

const github = require('../scrapers/github');
const articleService = require('../services/articles');

async function main() {
  const args = process.argv.slice(2);
  const quickMode = args.includes('--quick');
  const dryRun = args.includes('--dry-run');
  const maxArg = args.find(a => a.startsWith('--max='));
  const maxRepos = maxArg ? parseInt(maxArg.split('=')[1]) : null;

  console.log('═'.repeat(60));
  console.log('  GitHub Repo Sync — AGI-FBHC');
  console.log('═'.repeat(60));
  console.log(`  Mode:      ${quickMode ? 'QUICK (no README)' : 'FULL (with README)'}`);
  console.log(`  Max repos: ${maxRepos || 'unlimited'}`);
  console.log(`  Dry run:   ${dryRun ? 'YES (no DB writes)' : 'NO'}`);
  console.log('─'.repeat(60));

  // Init DB connection
  if (!dryRun) {
    await articleService.initStorage();
  }

  // Fetch repos
  const articles = await github.scrapeReposAsArticles({
    readReadme: !quickMode,
    maxRepos,
  });

  if (dryRun) {
    console.log('\n--- DRY RUN: Preview ---');
    for (const article of articles) {
      console.log(`\n[${article.category}] ${article.title}`);
      console.log(`  excerpt: ${article.excerpt.slice(0, 120)}...`);
      console.log(`  date: ${article.date}`);
      console.log(`  tags: ${article.tags.join(', ')}`);
    }
    console.log(`\n--- Would upsert ${articles.length} articles ---`);
    return;
  }

  // Upsert to DB
  let added = 0;
  let updated = 0;

  for (const article of articles) {
    const exists = await articleService.getArticleById(article.id);
    await articleService.upsertArticle(article);
    if (exists) {
      updated++;
      console.log(`  [UPDATED] ${article.id}`);
    } else {
      added++;
      console.log(`  [NEW] ${article.id}`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('  Sync Complete');
  console.log('═'.repeat(60));
  console.log(`  Total repos:   ${articles.length}`);
  console.log(`  New articles:  ${added}`);
  console.log(`  Updated:       ${updated}`);
  console.log('─'.repeat(60));

  // Show stats
  const stats = await articleService.getStats();
  console.log('\n  Database Stats:');
  console.log(`    Total articles: ${stats.total}`);
  console.log(`    By source:`, stats.bySource);
  console.log(`    By category:`, stats.byCategory);

  process.exit(0);
}

main().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
