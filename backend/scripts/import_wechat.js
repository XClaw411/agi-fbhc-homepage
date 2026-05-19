/**
 * WeChat Articles Import Script
 * Parses wechatDownload ZIP output and imports into MySQL
 *
 * Usage:
 *   node scripts/import_wechat.js <path-to-zip> [--dry-run]
 *
 * Features:
 *   - Parses filename: [YYYYMMDDhhmm]Title.md
 *   - Extracts metadata from Markdown content
 *   - Classifies into categories via keyword matching
 *   - Deduplicates by article_id (date-based)
 *   - Copies files to storage directory
 *   - Extracts keywords as tags
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const db = require('../services/db');

// ─── Configuration ───────────────────────────────────────────
const STORAGE_ROOT = '/home/jnuaipr/wechat_articles';
const TEMP_DIR = '/tmp/wechat_import_' + Date.now();

// ─── Category Classification Rules ───────────────────────────
const CATEGORY_RULES = [
  {
    category: 'LLM & Agents',
    keywords: ['大模型', '智能体', 'agent', 'llm', 'xbots', 'buagents',
               '多智能体', 'multi-agent', 'bot', 'gpt', '语言模型'],
  },
  {
    category: 'AI for Health',
    keywords: ['health', '健康', '医疗', '医学', '脑机', '癫痫',
               '临床', '药物', '影像', '分割', '诊断', '息肉', '结直肠',
               '智能健康', 'healthcare', 'disease'],
  },
  {
    category: 'AI for Biology',
    keywords: ['protein', '蛋白质', '酶', 'enzyme', '生物', 'bio',
               '基因', 'rna', 'dna', '分子', 'food', '食品',
               'xai', '可解释', '聚类', '模糊', '图数据', '表示学习',
               '多视图', '多标记', '迁移学习', '图模糊', '增强'],
  },
  {
    category: 'Group News',
    keywords: ['团队', '获奖', '竞赛', '首席', '名称更新', '佳绩',
               '荣誉', '优秀', '试身手'],
  },
];

// ─── Keyword Extraction for Tags ────────────────────────────
const TAG_KEYWORDS = {
  // 技术方向
  '蛋白质工程': ['protein', '蛋白质', '酶', 'enzyme', '配体', '口袋预测'],
  '食品计算': ['food', '食品', '图像识别', '食品图像'],
  '生物分子互作': ['生物分子', '互作', '相互作用', 'drug', '靶点'],
  '可解释AI': ['xai', '可解释', '模糊系统', '规则', '推理'],
  '多视图学习': ['多视图', 'multi-view', '多视角'],
  '图神经网络': ['图数据', '图卷积', 'gcn', 'graph'],
  '表示学习': ['表示学习', 'representation'],
  '迁移学习': ['迁移学习', 'transfer'],
  '聚类分析': ['聚类', 'clustering'],
  // 应用领域
  '智能健康': ['health', '健康', '医疗', '医学影像'],
  '脑机接口': ['脑机', 'bci', '癫痫'],
  '药物发现': ['药物', 'drug', '靶点'],
  '蛋白质设计': ['蛋白质设计', '序列设计'],
  // 团队/平台
  '多智能体': ['智能体', 'agent', 'multi-agent'],
  '大模型': ['大模型', 'llm', '语言模型'],
  // 方法
  '注意力机制': ['注意力', 'attention'],
  'Transformer': ['transformer', 'swin'],
  '深度学习': ['深度学习', '神经网络'],
  '模糊系统': ['模糊', 'fuzzy', 'tsk'],
};

// ─── Utility Functions ──────────────────────────────────────

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeFilename(name) {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}

/**
 * Extract article_id and datetime from filename
 * Format: [202503242216]Title.md -> id: 202503242216
 */
function parseFilename(filename) {
  const match = filename.match(/^\[(\d{12})\](.+?)\.md$/);
  if (!match) return null;
  return {
    articleId: match[1],
    dateStr: match[1].slice(0, 8),   // YYYYMMDD
    timeStr: match[1].slice(8, 12),  // hhmm
    rawTitle: match[2],
  };
}

/**
 * Parse date string to YYYY-MM-DD
 */
function formatDate(dateStr) {
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}

/**
 * Parse datetime string to YYYY-MM-DD hh:mm:ss
 */
function formatDateTime(articleId) {
  const d = articleId;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)} ${d.slice(8, 10)}:${d.slice(10, 12)}:00`;
}

/**
 * Classify article into category based on title
 */
function classifyArticle(title) {
  const titleLower = title.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(k => titleLower.includes(k.toLowerCase()))) {
      return rule.category;
    }
  }

  // Default fallback
  return 'AI for Biology';
}

/**
 * Extract tags from title + content
 */
function extractTags(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  const tags = [];

  for (const [tagName, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some(k => text.includes(k.toLowerCase()))) {
      tags.push(tagName);
    }
  }

  // Add series tag based on title prefix
  const seriesMatch = title.match(/^(AI\s*for\s*\w+|XAI[\-可解释]|不确定场景|大模型|食品生物)/i);
  if (seriesMatch) {
    const series = seriesMatch[1].trim();
    if (!tags.includes(series)) {
      tags.unshift(series); // Add to front
    }
  }

  return [...new Set(tags)]; // Deduplicate
}

/**
 * Parse Markdown content to extract metadata
 */
function parseMarkdown(content, articleId) {
  const lines = content.split('\n');

  // Extract cover image from first line
  let coverImage = '';
  const coverMatch = content.match(/!\[cover_image\]\((https?:\/\/[^)]+)\)/);
  if (coverMatch) {
    coverImage = coverMatch[1];
  }

  // Extract title from first # heading
  let title = '';
  for (const line of lines) {
    const titleMatch = line.match(/^#\s+(.+)$/);
    if (titleMatch) {
      title = titleMatch[1].trim();
      break;
    }
  }

  // Extract author from lines like "原创  作者名  作者名  [ AGI&FBHC ]"
  let author = 'AGI&FBHC';
  for (const line of lines) {
    const authorMatch = line.match(/原创\s+\S+\s+(\S+)\s+\[\s*AGI&FBHC\s*\]/);
    if (authorMatch) {
      author = authorMatch[1].trim();
      break;
    }
  }

  // Extract publish time from lines like "_2025年03月24日 22:16_"
  let publishTime = '';
  for (const line of lines) {
    const timeMatch = line.match(/_(\d{4})年(\d{2})月(\d{2})日\s+(\d{2}):(\d{2})_/);
    if (timeMatch) {
      publishTime = `${timeMatch[1]}-${timeMatch[2]}-${timeMatch[3]} ${timeMatch[4]}:${timeMatch[5]}:00`;
      break;
    }
  }
  if (!publishTime) {
    publishTime = formatDateTime(articleId);
  }

  // Clean content: remove WeChat UI noise
  let cleanContent = content
    // 先统一换行符，处理 \r\n
    .replace(/\r/g, '')
    // 移除封面图片
    .replace(/!\[cover_image\]\([^)]+\)\s*\n?/g, '')
    // 移除标题行（# 开头的 Markdown 标题）
    .replace(/^#\s+.+\n/gm, '')
    // 移除公众号作者行：xxx xxx [ AGI&FBHC ](javascript:void\(0\);)
    .replace(/^[\w\s]*\[\s*AGI&FBHC\s*\]\s*\(javascript:void\\\(0\\\);\)\s*\n?/gm, '')
    .replace(/\b\w+\s+\w+\s+\[\s*AGI&FBHC\s*\]\s*\(javascript:void\\\(0\\\);\)/g, '')
    // 移除日期行：_2025年03月17日 09:11_ _ _ _ _ _ 江苏 _
    .replace(/_\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2}_\s*(?:_\s*)+[^_\n]*_\s*\n?/g, '')
    .replace(/_\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2}_/g, '')
    // 移除其他微信 UI 元素
    .replace(/在小说阅读器读本章\s*\n?/g, '')
    .replace(/去阅读\s*\n?/g, '')
    .replace(/^阅读\s*\n?/gm, '')
    .replace(/修改于\s*\n?/g, '')
    .replace(/预览时标签不可点\s*\n?/g, '')
    .replace(/微信扫一扫\s*\n?/g, '')
    // 移除多余的星号和下划线
    .replace(/\*{4,}\s*\n?/g, '')
    .replace(/_{2,}\s*\n?/g, '')
    // 压缩多余空行
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Generate excerpt (first 200 chars of clean content)
  // 找到第一个有意义的段落（非空、非纯标点、非标题）
  const paragraphs = cleanContent.split(/\n{2,}/);
  let meaningfulText = '';
  for (const para of paragraphs) {
    const trimmed = para.trim();
    // 跳过空行、纯标点、过短的行（少于10字）、Markdown 标题
    if (trimmed.length >= 10 && /[\u4e00-\u9fa5a-zA-Z]/.test(trimmed) && !trimmed.startsWith('#')) {
      meaningfulText = trimmed;
      break;
    }
  }
  // 如果没找到有意义的段落，回退到全文
  if (!meaningfulText) {
    meaningfulText = cleanContent;
  }

  const excerpt = meaningfulText.length > 200
    ? meaningfulText.slice(0, 200).replace(/\n/g, ' ') + '...'
    : meaningfulText.replace(/\n/g, ' ');

  return {
    title,
    author,
    publishTime,
    coverImage,
    content: cleanContent,
    excerpt,
  };
}

/**
 * Parse log file to extract WeChat URLs
 */
function parseLogFile(logPath) {
  const urlMap = new Map();

  if (!fs.existsSync(logPath)) {
    console.warn(`[Import] Log file not found: ${logPath}`);
    return urlMap;
  }

  const content = fs.readFileSync(logPath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    // Match: "开始下载：Title，链接：http://mp.weixin.qq.com/s?..."
    const match = line.match(/开始下载[：:]\s*(.+?)[，,]\s*链接[：:]\s*(https?:\/\/[^\s]+)/);
    if (match) {
      const title = match[1].trim();
      const url = match[2].trim().replace(/&amp;/g, '&');
      urlMap.set(title, url);
    }
  }

  console.log(`[Import] Parsed ${urlMap.size} URLs from log file`);
  return urlMap;
}

/**
 * Find matching URL for article title
 */
function findUrlForTitle(title, urlMap) {
  // Exact match
  if (urlMap.has(title)) {
    return urlMap.get(title);
  }

  // Fuzzy match: remove common suffixes/prefixes
  const simplifiedTitle = title
    .replace(/[（(]\d+[)）]/g, '')
    .replace(/[：:].*$/g, '')
    .trim();

  for (const [logTitle, url] of urlMap.entries()) {
    if (logTitle.includes(simplifiedTitle) || simplifiedTitle.includes(logTitle)) {
      return url;
    }
  }

  return '';
}

/**
 * Copy article files to storage directory
 */
function copyArticleFiles(sourceDir, articleId, files) {
  const targetDir = path.join(STORAGE_ROOT, 'articles', articleId);
  fs.mkdirSync(targetDir, { recursive: true });

  const paths = {};
  for (const [ext, sourcePath] of Object.entries(files)) {
    if (fs.existsSync(sourcePath)) {
      const targetPath = path.join(targetDir, `article.${ext}`);
      fs.copyFileSync(sourcePath, targetPath);
      paths[ext] = targetPath;
    }
  }

  return paths;
}

/**
 * Check if article already exists in database
 */
async function articleExists(articleId) {
  const id = `wechat_${articleId}`;
  const rows = await db.query('SELECT 1 FROM articles WHERE id = ?', [id]);
  return rows.length > 0;
}

/**
 * Insert article into database
 */
async function insertArticle(article) {
  const sql = `
    INSERT INTO articles (
      id, title, excerpt, content, content_en, category,
      source, author, date, url, cover_image, tags, scraped_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      excerpt = VALUES(excerpt),
      content = VALUES(content),
      category = VALUES(category),
      author = VALUES(author),
      date = VALUES(date),
      url = VALUES(url),
      cover_image = VALUES(cover_image),
      tags = VALUES(tags),
      updated_at = NOW()
  `;

  await db.query(sql, [
    article.id,
    article.title,
    article.excerpt,
    article.content,
    article.contentEn || '',
    article.category,
    article.source,
    article.author,
    article.date,
    article.url,
    article.coverImage,
    JSON.stringify(article.tags),
  ]);
}

// ─── Main Import Function ───────────────────────────────────

async function importWeChatZip(zipPath, options = {}) {
  const { dryRun = false, verbose = true } = options;

  console.log(`\n╔═══════════════════════════════════════════════════╗`);
  console.log(`║  WeChat Articles Import                           ║`);
  console.log(`║  ZIP: ${path.basename(zipPath).padEnd(43)} ║`);
  console.log(`║  Mode: ${dryRun ? 'DRY RUN (no DB writes)' : 'LIVE IMPORT'.padEnd(36)} ║`);
  console.log(`╚═══════════════════════════════════════════════════╝\n`);

  // 1. Create temp directory and extract
  console.log('[Step 1/6] Extracting ZIP...');
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  try {
    execSync(`unzip -q "${zipPath}" -d "${TEMP_DIR}"`, { stdio: 'ignore' });
  } catch (err) {
    console.error('[Import] Failed to extract ZIP:', err.message);
    throw err;
  }

  // Find extracted directory (usually AGIx26ampFBHC/)
  const entries = fs.readdirSync(TEMP_DIR);
  const extractDir = entries.find(e => fs.statSync(path.join(TEMP_DIR, e)).isDirectory());
  if (!extractDir) {
    throw new Error('No directory found in ZIP');
  }

  const workDir = path.join(TEMP_DIR, extractDir);
  console.log(`[Import] Extracted to: ${workDir}`);

  // 2. Parse log file for URLs
  console.log('[Step 2/6] Parsing log file...');
  const logPath = path.join(TEMP_DIR, 'log20260518.txt') ||
                  fs.readdirSync(TEMP_DIR).find(f => f.endsWith('.txt'));
  const urlMap = parseLogFile(logPath);

  // 3. Find all Markdown files
  console.log('[Step 3/6] Scanning Markdown files...');
  const mdFiles = fs.readdirSync(workDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  console.log(`[Import] Found ${mdFiles.length} Markdown files`);

  // 4. Process each article
  console.log('[Step 4/6] Processing articles...\n');

  const results = {
    total: mdFiles.length,
    imported: 0,
    skipped: 0,
    errors: 0,
    byCategory: {},
  };

  // Ensure storage directory exists
  if (!dryRun) {
    fs.mkdirSync(STORAGE_ROOT, { recursive: true });
    fs.mkdirSync(path.join(STORAGE_ROOT, 'articles'), { recursive: true });
  }

  for (let i = 0; i < mdFiles.length; i++) {
    const mdFile = mdFiles[i];
    const progress = `[${i + 1}/${mdFiles.length}]`;

    try {
      // Parse filename
      const parsed = parseFilename(mdFile);
      if (!parsed) {
        console.warn(`${progress} Skip: Invalid filename format: ${mdFile}`);
        results.errors++;
        continue;
      }

      const { articleId, dateStr, rawTitle } = parsed;

      // Check for duplicates
      const exists = await articleExists(articleId);
      if (exists) {
        console.log(`${progress} Skip: ${articleId} already exists`);
        results.skipped++;
        continue;
      }

      // Read and parse Markdown
      const mdPath = path.join(workDir, mdFile);
      const mdContent = fs.readFileSync(mdPath, 'utf-8');
      const meta = parseMarkdown(mdContent, articleId);

      // Classify category
      const category = classifyArticle(meta.title || rawTitle);

      // Extract tags
      const tags = extractTags(meta.title || rawTitle, meta.content);

      // Find URL from log
      const url = findUrlForTitle(meta.title || rawTitle, urlMap);

      // Prepare article object
      const article = {
        id: `wechat_${articleId}`,
        title: meta.title || rawTitle,
        excerpt: meta.excerpt,
        content: meta.content,
        contentEn: '',
        category,
        source: 'WeChat',
        author: meta.author,
        date: formatDate(dateStr),
        url,
        coverImage: meta.coverImage,
        tags,
      };

      if (verbose) {
        console.log(`${progress} ${articleId} | ${category.padEnd(18)} | ${article.title.slice(0, 50)}${article.title.length > 50 ? '...' : ''}`);
        if (tags.length > 0) {
          console.log(`         Tags: ${tags.join(', ')}`);
        }
      }

      if (!dryRun) {
        // Copy files
        const baseName = mdFile.replace('.md', '');
        const files = {
          md: path.join(workDir, `${baseName}.md`),
          html: path.join(workDir, `${baseName}.html`),
          pdf: path.join(workDir, `${baseName}.pdf`),
          docx: path.join(workDir, `${baseName}.docx`),
          mhtml: path.join(workDir, `${baseName}.mhtml`),
        };
        const copiedPaths = copyArticleFiles(workDir, articleId, files);

        // Insert into database
        await insertArticle(article);
      }

      results.imported++;
      results.byCategory[category] = (results.byCategory[category] || 0) + 1;

      // Rate limiting
      await delay(50);

    } catch (err) {
      console.error(`${progress} Error processing ${mdFile}:`, err.message);
      results.errors++;
    }
  }

  // 5. Cleanup
  console.log('\n[Step 5/6] Cleaning up...');
  try {
    execSync(`rm -rf "${TEMP_DIR}"`, { stdio: 'ignore' });
  } catch (err) {
    console.warn('[Import] Cleanup warning:', err.message);
  }

  // 6. Report
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║  Import Summary                                   ║');
  console.log(`╠═══════════════════════════════════════════════════╣`);
  console.log(`║  Total files:      ${String(results.total).padEnd(33)} ║`);
  console.log(`║  Imported:         ${String(results.imported).padEnd(33)} ║`);
  console.log(`║  Skipped (dup):    ${String(results.skipped).padEnd(33)} ║`);
  console.log(`║  Errors:           ${String(results.errors).padEnd(33)} ║`);
  console.log(`╠═══════════════════════════════════════════════════╣`);
  console.log('║  By Category:                                     ║');
  for (const [cat, count] of Object.entries(results.byCategory)) {
    console.log(`║    ${cat.padEnd(15)} ${String(count).padEnd(31)} ║`);
  }
  console.log(`╚═══════════════════════════════════════════════════╝\n`);

  return results;
}

// ─── CLI Entry Point ────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const zipPath = args[0];
  const dryRun = args.includes('--dry-run');

  if (!zipPath) {
    console.log('Usage: node scripts/import_wechat.js <path-to-zip> [--dry-run]');
    process.exit(1);
  }

  if (!fs.existsSync(zipPath)) {
    console.error(`Error: File not found: ${zipPath}`);
    process.exit(1);
  }

  // Test DB connection
  const dbOk = await db.testConnection();
  if (!dbOk) {
    console.error('Error: Database connection failed');
    process.exit(1);
  }

  try {
    const results = await importWeChatZip(zipPath, { dryRun });
    process.exit(results.errors > 0 ? 1 : 0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { importWeChatZip, classifyArticle, extractTags };
