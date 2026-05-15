/**
 * GitHub API Routes
 * GET /api/github/repos      - List organization repos
 * GET /api/github/events     - List recent events
 * GET /api/github/members    - List public members
 * GET /api/github/profile    - Organization profile
 * GET /api/github/data       - All data aggregated
 */

const express = require('express');
const router = express.Router();
const githubScraper = require('../scrapers/github');

// ─── GET /api/github/repos ───────────────────────────────────
router.get('/repos', async (req, res) => {
  try {
    const repos = await githubScraper.scrapeRepos();
    res.json({ success: true, data: repos });
  } catch (err) {
    console.error('[API] GET /github/repos error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/github/events ──────────────────────────────────
router.get('/events', async (req, res) => {
  try {
    const events = await githubScraper.scrapeEvents();
    res.json({ success: true, data: events });
  } catch (err) {
    console.error('[API] GET /github/events error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/github/members ─────────────────────────────────
router.get('/members', async (req, res) => {
  try {
    const members = await githubScraper.fetchMembers();
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/github/profile ─────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const profile = await githubScraper.fetchOrgProfile();
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/github/data ────────────────────────────────────
router.get('/data', async (req, res) => {
  try {
    const data = await githubScraper.fetchAllData();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
