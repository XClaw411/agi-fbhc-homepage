/**
 * GitHub Organization Scraper — Repository-centric
 * Fetches repos from AGI-FBHC org, reads README for summary,
 * and converts each repo into an article entry.
 *
 * No more commit/event noise — each article = one repository.
 */

const axios = require('axios');

const ORG_NAME = 'AGI-FBHC';
const API_BASE = 'https://api.github.com';

// Topic → category mapping
const TOPIC_CATEGORIES = {
  'llm': 'LLM & Agents',
  'agent': 'LLM & Agents',
  'agents': 'LLM & Agents',
  'multi-agent': 'LLM & Agents',
  'bot': 'LLM & Agents',
  'chat': 'LLM & Agents',
  'biology': 'AI for Biology',
  'bioinformatics': 'AI for Biology',
  'protein': 'AI for Biology',
  'gene': 'AI for Biology',
  'ppi': 'AI for Biology',
  'drug': 'AI for Health',
  'health': 'AI for Health',
  'medical': 'AI for Health',
  'clinical': 'AI for Health',
};

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
 * Fetch all repos for the organization (handles pagination)
 */
async function fetchAllRepos() {
  const repos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    console.log(`[GitHub] Fetching repos page ${page}...`);
    const response = await axios.get(
      `${API_BASE}/orgs/${ORG_NAME}/repos`,
      {
        headers: getHeaders(),
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: perPage,
          page,
        },
        timeout: 30000,
      }
    );

    const data = response.data;
    if (!data.length) break;

    repos.push(...data.map(repo => ({
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
      pushedAt: repo.pushed_at,
      isPrivate: repo.private,
      isFork: repo.fork,
    })));

    if (data.length < perPage) break;
    page++;
  }

  console.log(`[GitHub] ✓ Fetched ${repos.length} repos`);
  return repos;
}

/**
 * Fetch README content for a repo and extract plain-text summary
 */
async function fetchReadmeSummary(fullName) {
  try {
    const response = await axios.get(
      `${API_BASE}/repos/${fullName}/readme`,
      {
        headers: getHeaders(),
        timeout: 15000,
      }
    );

    const data = response.data;
    if (!data.content) return null;

    // Decode base64
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return extractSummary(content);

  } catch (err) {
    if (err.response?.status === 404) {
      console.log(`[GitHub] No README for ${fullName}`);
    } else {
      console.error(`[GitHub] Failed to fetch README for ${fullName}:`, err.message);
    }
    return null;
  }
}

/**
 * Extract a clean text summary from README markdown
 */
function extractSummary(markdown) {
  if (!markdown) return null;

  // Remove HTML tags
  let text = markdown.replace(/<[^>]+>/g, '');

  // Remove markdown images/links: ![alt](url)  [text](url)
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`[^`]+`/g, '');

  // Remove markdown headers
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove horizontal rules
  text = text.replace(/^[\-*_]{3,}\s*$/gm, '');

  // Split into lines and find first meaningful paragraph
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty, too short, or table rows
    if (!trimmed || trimmed.length < 15) continue;
    if (/^\|/.test(trimmed)) continue;
    if (/^\s*[-*]\s/.test(trimmed) && trimmed.length < 40) continue; // skip short list items
    return trimmed;
  }

  // Fallback: return first non-empty line
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 10) return trimmed;
  }

  return null;
}

/**
 * Infer article category from repo name, description, and topics
 */
function inferCategory(repo) {
  const text = (repo.name + ' ' + repo.description + ' ' + repo.topics.join(' ')).toLowerCase();

  for (const [topic, category] of Object.entries(TOPIC_CATEGORIES)) {
    if (text.includes(topic)) return category;
  }

  // Heuristic fallback
  if (/\b(llm|agent|bot|chat|gpt|claude|rag)\b/.test(text)) return 'LLM & Agents';
  if (/\b(bio|protein|gene|ppi|dgraph|mappis|ipnet|causal3d)\b/.test(text)) return 'AI for Biology';
  if (/\b(health|medical|clinical|drug|patient)\b/.test(text)) return 'AI for Health';

  return 'Group News';
}

/**
 * Build a rich content body from repo metadata + README summary
 */
function buildContent(repo, readmeSummary) {
  const parts = [];

  parts.push(`# ${repo.name}`);
  parts.push('');

  if (repo.description) {
    parts.push(repo.description);
    parts.push('');
  }

  if (readmeSummary) {
    parts.push('## About');
    parts.push(readmeSummary);
    parts.push('');
  }

  parts.push('## Repository Info');
  parts.push(`- **Language:** ${repo.language}`);
  parts.push(`- **Stars:** ${repo.stars}`);
  parts.push(`- **Forks:** ${repo.forks}`);
  if (repo.topics.length) {
    parts.push(`- **Topics:** ${repo.topics.join(', ')}`);
  }
  parts.push(`- **Updated:** ${repo.updatedAt.split('T')[0]}`);
  parts.push('');
  parts.push(`[View on GitHub](${repo.url})`);

  return parts.join('\n');
}

/**
 * Convert a repo to article format
 */
function repoToArticle(repo, readmeSummary) {
  const category = inferCategory(repo);

  // Use description as excerpt, fallback to README summary
  let excerpt = repo.description || readmeSummary || '';
  if (excerpt.length > 300) excerpt = excerpt.slice(0, 297) + '...';

  const title = repo.description
    ? `${repo.name}: ${repo.description}`
    : repo.name;

  return {
    id: `github_repo_${repo.name}`,
    title: title.length > 200 ? title.slice(0, 197) + '...' : title,
    excerpt,
    content: buildContent(repo, readmeSummary),
    contentEn: buildContent(repo, readmeSummary), // Same for now
    category,
    source: 'GitHub',
    author: ORG_NAME,
    date: repo.pushedAt ? repo.pushedAt.split('T')[0] : repo.updatedAt.split('T')[0],
    url: repo.url,
    coverImage: '',
    tags: ['GitHub', category.split(' ')[0], ...(repo.topics.slice(0, 3))],
    scrapedAt: new Date().toISOString(),
  };
}

/**
 * Scrape all repos and return as articles
 * @param {Object} options
 * @param {boolean} options.readReadme - Whether to fetch README for each repo (slower but richer)
 * @param {number} options.maxRepos - Max repos to process (null = all)
 */
async function scrapeReposAsArticles(options = {}) {
  const { readReadme = true, maxRepos = null } = options;

  const repos = await fetchAllRepos();
  const toProcess = maxRepos ? repos.slice(0, maxRepos) : repos;

  const articles = [];

  for (let i = 0; i < toProcess.length; i++) {
    const repo = toProcess[i];
    console.log(`[GitHub] [${i + 1}/${toProcess.length}] Processing ${repo.name}...`);

    let readmeSummary = null;
    if (readReadme) {
      readmeSummary = await fetchReadmeSummary(repo.fullName);
      // Small delay to avoid rate limits
      if (i < toProcess.length - 1) await sleep(500);
    }

    const article = repoToArticle(repo, readmeSummary);
    articles.push(article);
  }

  console.log(`[GitHub] ✓ Converted ${articles.length} repos to articles`);
  return articles;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Full organization data (for other uses)
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
    return response.data.map(m => ({
      username: m.login,
      avatar: m.avatar_url,
      profileUrl: m.html_url,
    }));
  } catch (err) {
    console.error('[GitHub] Failed to fetch members:', err.message);
    return [];
  }
}

/**
 * Legacy: convert events to articles (kept for compatibility, but NOT recommended)
 * @deprecated Use scrapeReposAsArticles instead
 */
async function scrapeEvents() {
  console.warn('[GitHub] scrapeEvents() is deprecated. Use scrapeReposAsArticles() instead.');
  return [];
}

function convertEventsToArticles(events) {
  console.warn('[GitHub] convertEventsToArticles() is deprecated.');
  return [];
}

module.exports = {
  // New repo-centric API
  fetchAllRepos,
  fetchReadmeSummary,
  extractSummary,
  inferCategory,
  repoToArticle,
  scrapeReposAsArticles,

  // Legacy / other
  fetchOrgProfile,
  fetchMembers,
  scrapeEvents,
  convertEventsToArticles,
  ORG_NAME,
};
