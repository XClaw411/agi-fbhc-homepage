# AGI&FBHC Backend API

Backend server for the AGI&FBHC Research Group website. Provides data scraping and API services for WeChat articles and GitHub organization data.

## Features

- **WeChat Article Scraping** - Scrapes WeChat Official Account articles with full content extraction
- **GitHub Integration** - Fetches repos, events, and profile data from the AGI-FBHC organization
- **Article Management** - JSON-based storage with category filtering and full-text search
- **Scheduled Scraping** - Automatic periodic scraping via cron jobs
- **RESTful API** - Clean API endpoints for frontend consumption
- **CORS Support** - Configured for frontend integration

## Quick Start

```bash
cd backend

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start development server
npm run dev

# Or start production server
npm start
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment mode |
| `GITHUB_TOKEN` | - | GitHub personal access token (optional, increases rate limits) |
| `WECHAT_SCRAPE_INTERVAL_MINUTES` | 60 | Automatic scraping interval |
| `CACHE_TTL_SECONDS` | 3600 | Cache time-to-live |
| `CORS_ORIGIN` | * | Frontend CORS origin |

## API Endpoints

### Articles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List articles (supports `?category=&source=&limit=&offset=`) |
| GET | `/api/articles/:id` | Get single article |
| GET | `/api/articles/categories` | List categories with counts |
| GET | `/api/articles/stats` | Get article statistics |
| POST | `/api/articles/scrape` | Trigger manual scrape |
| POST | `/api/articles/scrape-url` | Scrape specific WeChat URL |

### GitHub

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/github/repos` | List organization repositories |
| GET | `/api/github/events` | List recent events |
| GET | `/api/github/members` | List public members |
| GET | `/api/github/profile` | Organization profile |
| GET | `/api/github/data` | All data aggregated |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Docker Deployment

```bash
cd backend

# Build image
docker build -t agi-fbhc-backend .

# Run container
docker run -d \
  -p 3001:3001 \
  -e GITHUB_TOKEN=your_token \
  -v ./data:/app/data \
  --name agi-fbhc-api \
  agi-fbhc-backend
```

## Frontend Integration

The frontend API service is located at `src/services/api.ts`. Set the `VITE_API_URL` environment variable to point to the backend:

```bash
# .env in frontend root
VITE_API_URL=http://localhost:3001/api
```

Then use the API in components:

```typescript
import { getArticles, triggerScrape } from '@/services/api';

// Fetch articles
const { articles, total } = await getArticles({ category: 'LLM & Agents' });

// Trigger manual scrape
await triggerScrape('all');
```

## Data Structure

### Article Object

```typescript
interface Article {
  id: string;           // Unique ID (source + hash)
  title: string;        // Article title
  excerpt: string;      // Short summary
  content: string;      // Full content (Chinese)
  contentEn: string;    // Full content (English)
  category: string;     // LLM & Agents | AI for Biology | AI for Health | Group News | Platforms
  source: string;       // WeChat | GitHub | Platform
  author: string;       // Author name
  date: string;         // YYYY-MM-DD
  url: string;          // Original URL
  coverImage: string;   // Cover image URL
  tags: string[];       // Array of tags
  scrapedAt: string;    // ISO timestamp
}
```
