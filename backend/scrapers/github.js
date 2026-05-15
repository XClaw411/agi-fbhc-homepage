/**
 * GitHub Organization Scraper
 * Fetches public data from AGI-FBHC GitHub organization
 * Uses GitHub REST API (no auth needed for public data, auth increases rate limits)
 */

const axios = require('axios');

const ORG_NAME = 'AGI-FBHC';
const API_BASE = 'https://api.github.com';

// Topic to category mapping
const TOPIC_CATEGORIES = {
  'llm': 'LLM & Agents',
  'agents': 'LLM & Agents',
  'multi-agent': 'LLM & Agents',
  'biology': 'AI for Biology',
  'bioinformatics': 'AI for Biology',
  'protein': 'AI for Biology',
  'health': 'AI for Health',
  'medical': 'AI for Health',
  'clinical': 'AI for Health',
};

// GitHub API headers
function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'AGI-FBHC-Backend/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * Fetch organization profile
 */
async function fetchOrgProfile() {
  try {
    const response = await axios.get(`${API_BASE}/orgs/${ORG_NAME}`, {
      headers: getHeaders(),
      timeout: 15000,
    });
    return response.data;
  } catch (err) {
    console.error('[GitHub] Failed to fetch org profile:', err.message);
    return null;
  }
}

/**
 * Fetch organization repositories
 */
async function scrapeRepos() {
  try {
    console.log(`[GitHub] Fetching repos for ${ORG_NAME}...`);

    const response = await axios.get(
      `${API_BASE}/orgs/${ORG_NAME}/repos`,
      {
        headers: getHeaders(),
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: 50,
        },
        timeout: 15000,
      }
    );

    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'Unknown',
      topics: repo.topics || [],
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      isPrivate: repo.private,
      isFork: repo.fork,
    }));

    console.log(`[GitHub] ✓ Fetched ${repos.length} repos`);
    return repos;

  } catch (err) {
    console.error('[GitHub] Failed to fetch repos:', err.message);
    return [];
  }
}

/**
 * Fetch recent organization events
 */
async function scrapeEvents() {
  try {
    console.log(`[GitHub] Fetching events for ${ORG_NAME}...`);

    const response = await axios.get(
      `${API_BASE}/orgs/${ORG_NAME}/events`,
      {
        headers: getHeaders(),
        params: { per_page: 30 },
        timeout: 15000,
      }
    );

    const events = response.data.map(event => ({
      id: event.id,
      type: event.type,
      actor: event.actor?.login || 'unknown',
      repo: event.repo?.name || '',
      createdAt: event.created_at,
      payload: event.payload,
    }));

    console.log(`[GitHub] ✓ Fetched ${events.length} events`);
    return events;

  } catch (err) {
    console.error('[GitHub] Failed to fetch events:', err.message);
    return [];
  }
}

/**
 * Fetch organization members
 */
async function fetchMembers() {
  try {
    const response = await axios.get(
      `${API_BASE}/orgs/${ORG_NAME}/public_members`,
      {
        headers: getHeaders(),
        params: { per_page: 50 },
        timeout: 15000,
      }
    );

    return response.data.map(member => ({
      username: member.login,
      avatar: member.avatar_url,
      profileUrl: member.html_url,
    }));

  } catch (err) {
    console.error('[GitHub] Failed to fetch members:', err.message);
    return [];
  }
}

/**
 * Convert GitHub events to article format for display
 */
function convertEventsToArticles(events) {
  const articles = [];
  const seenRepos = new Set();

  for (const event of events) {
    // Only process PushEvent and CreateEvent for new content
    if (event.type !== 'PushEvent' && event.type !== 'CreateEvent') continue;

    const repoName = event.repo.replace(`${ORG_NAME}/`, '');
    if (seenRepos.has(repoName)) continue;
    seenRepos.add(repoName);

    // Determine category from repo name/topics
    const category = inferCategory(repoName, event.payload?.description || '');

    const article = {
      id: `github_${event.id}`,
      title: `[GitHub] ${repoName} - ${getEventDescription(event)}`,
      excerpt: `Repository update: ${repoName}. ${event.type === 'PushEvent' ? 'New commits pushed' : 'New content created'} by ${event.actor}.`,
      content: `GitHub repository activity for ${event.repo}:\n\nEvent: ${event.type}\nActor: ${event.actor}\nTime: ${event.createdAt}\n\nThis repository contains research code and artifacts from the AGI&FBHC lab.`,
      contentEn: `GitHub repository activity for ${event.repo}:\n\nEvent: ${event.type}\nActor: ${event.actor}\nTime: ${event.createdAt}\n\nThis repository contains research code and artifacts from the AGI&FBHC lab.`,
      category,
      source: 'GitHub',
      author: event.actor,
      date: event.createdAt.split('T')[0],
      url: `https://github.com/${event.repo}`,
      coverImage: '',
      tags: ['GitHub', category.split(' ')[0]],
      scrapedAt: new Date().toISOString(),
    };

    articles.push(article);
  }

  return articles;
}

/**
 * Infer article category from repo name/description
 */
function inferCategory(repoName, description = '') {
  const text = (repoName + ' ' + description).toLowerCase();

  if (text.includes('llm') || text.includes('agent') || text.includes('bot') || text.includes('chat')) {
    return 'LLM & Agents';
  }
  if (text.includes('bio') || text.includes('protein') || text.includes('gene') || text.includes('medical')) {
    return 'AI for Biology';
  }
  if (text.includes('health') || text.includes('clinical') || text.includes('drug')) {
    return 'AI for Health';
  }
  return 'Group News';
}

/**
 * Get human-readable event description
 */
function getEventDescription(event) {
  switch (event.type) {
    case 'PushEvent':
      return `${event.payload?.commits?.length || 0} commits pushed`;
    case 'CreateEvent':
      return `New ${event.payload?.ref_type || 'content'} created`;
    case 'ReleaseEvent':
      return `Release ${event.payload?.release?.tag_name || ''}`;
    default:
      return event.type;
  }
}

/**
 * Full organization data aggregation
 */
async function fetchAllData() {
  const [profile, repos, events, members] = await Promise.all([
    fetchOrgProfile(),
    scrapeRepos(),
    scrapeEvents(),
    fetchMembers(),
  ]);

  return {
    profile,
    repos,
    events,
    members,
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  fetchOrgProfile,
  scrapeRepos,
  scrapeEvents,
  fetchMembers,
  fetchAllData,
  convertEventsToArticles,
};
