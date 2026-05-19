import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageCircle, Github, Monitor, X, ExternalLink, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Staggered children animation config
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
};

// Modal content stagger
const contentStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const contentItem = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: easeOutExpo },
  },
};

// 格式化日期：2026-05-17 → May 17, 2026 / 2026年5月17日
function formatDate(dateStr: string, isZh: boolean): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  if (isZh) {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type Category = 'All' | 'LLM & Agents' | 'AI for Biology' | 'AI for Health' | 'Group News' | 'Platforms';

interface Article {
  id: string;
  category: Category;
  source: string;
  title: string;
  excerpt: string;
  content: string;
  contentEn: string;
  date: string;
  tags: string[];
  url: string;
  cover_image?: string;
}

const categories: Category[] = [
  'All',
  'LLM & Agents',
  'AI for Biology',
  'AI for Health',
  'Group News',
  'Platforms',
];

const categoryStyles: Record<string, { bg: string; text: string; glow: string }> = {
  'LLM & Agents':   { bg: 'rgba(139,92,246,0.1)',  text: '#a78bfa', glow: 'rgba(139,92,246,0.3)' },
  'AI for Biology': { bg: 'rgba(20,184,166,0.1)',   text: '#2dd4bf', glow: 'rgba(20,184,166,0.3)' },
  'AI for Health':  { bg: 'rgba(14,165,233,0.1)',    text: '#38bdf8', glow: 'rgba(14,165,233,0.3)' },
  'Group News':     { bg: 'rgba(255,255,255,0.05)',  text: '#8B8B9E', glow: 'rgba(255,255,255,0.15)' },
  'Platforms':      { bg: 'rgba(245,158,11,0.1)',    text: '#fbbf24', glow: 'rgba(245,158,11,0.3)' },
};

const sourceIcons: Record<string, typeof Github> = {
  GitHub: Github,
  WeChat: MessageCircle,
  Platform: Monitor,
};

// API base URL - adjust if needed
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

export default function UpdatesSection() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6); // 每次显示6条

  // Fetch articles from API
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setVisibleCount(6); // 切换分类时重置显示数量
        const categoryParam = activeCategory === 'All' ? '' : `&category=${encodeURIComponent(activeCategory)}`;
        const response = await fetch(`${API_BASE}/articles?limit=100&sortBy=date&sortOrder=desc${categoryParam}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          // Map database fields to frontend format
          const mapped = result.data.map((item: any) => ({
            id: item.id,
            category: item.category as Category,
            source: item.source,
            title: item.title,
            excerpt: item.excerpt || '',
            content: item.content || '',
            contentEn: item.content_en || '',
            date: item.date,
            tags: Array.isArray(item.tags) ? item.tags : (item.tags ? JSON.parse(item.tags) : []),
            url: item.url || '#',
            cover_image: item.cover_image,
          }));
          setArticles(mapped);
          setTotal(result.meta?.total || mapped.length);
        } else {
          throw new Error(result.error || 'Failed to fetch articles');
        }
      } catch (err: any) {
        console.error('Failed to fetch articles:', err);
        setError(err.message);
        // Fallback: show empty state
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [activeCategory]);

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  // 分页显示的数据
  const visibleArticles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const selected = articles.find((a) => a.id === selectedId);
  const selectedStyle = selected ? categoryStyles[selected.category] : null;

  // Memoized close handler
  const handleClose = useCallback(() => setSelectedId(null), []);

  // Lock body scroll
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedId]);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  return (
    <section id="news" className="relative py-16 lg:py-24" style={{ background: '#050508' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-block h-0.5 w-6 bg-[#06B6D4]" />
            <span className="text-xs font-medium tracking-[0.2em] text-[#55556B] uppercase">
              {isZh ? '最新动态' : "WHAT'S NEW"}
            </span>
          </div>
          <h2 className="display-lg text-[#F0F0F5]">
            {isZh ? '最新动态' : 'Latest Updates'}
          </h2>
          <p className="mt-4 text-lg text-[#8B8B9E]" style={{ lineHeight: 1.75 }}>
            {isZh
              ? '同步展示课题组公众号、科研动态、平台更新与方向组文章。'
              : 'Latest updates from the lab: publications, news, and platform releases.'}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: isActive ? '#F0F0F5' : '#8B8B9E',
                  border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#06B6D4]" />
            <span className="ml-3 text-[#8B8B9E]">{isZh ? '加载中...' : 'Loading...'}</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-[14px] border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-red-400">{isZh ? '加载失败' : 'Failed to load'}: {error}</p>
            <p className="mt-2 text-sm text-[#8B8B9E]">{isZh ? '请检查后端服务是否运行' : 'Please check if backend is running'}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-[#55556B]">
              {isZh ? `共 ${total} 篇文章` : `${total} articles total`}
              {activeCategory !== 'All' && (
                <span> · {isZh ? '当前筛选' : 'Filtered'}: {filtered.length}</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visibleArticles.map((article) => {
                  const catStyle = categoryStyles[article.category] || {
                    bg: 'rgba(255,255,255,0.05)',
                    text: '#8B8B9E',
                    glow: 'rgba(255,255,255,0.15)',
                  };
                  const SourceIcon = sourceIcons[article.source] || MessageCircle;

                  return (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: easeOutExpo }}
                      className="group relative cursor-pointer overflow-hidden rounded-[14px] p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1"
                      style={{
                        background: 'rgba(10, 10, 18, 0.55)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = catStyle.glow;
                        e.currentTarget.style.boxShadow = `0 8px 32px ${catStyle.bg}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => setSelectedId(article.id)}
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between">
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{ background: catStyle.bg, color: catStyle.text }}
                        >
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#55556B]">
                          <SourceIcon className="h-3 w-3" />
                          {article.source}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-3 text-base font-semibold leading-snug text-[#F0F0F5] line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Abstract */}
                      <p className="mt-2 text-sm leading-relaxed text-[#8B8B9E] line-clamp-3" style={{ lineHeight: 1.6 }}>
                        {article.excerpt}
                      </p>

                      {/* Bottom row */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-[#55556B]">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.date, isZh)}
                        </span>
                        <span className="text-sm font-medium text-[#A5B4FC]">
                          {isZh ? '阅读更多' : 'Read More'} &rarr;
                        </span>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center text-[#55556B]">
                {isZh ? '该分类下暂无文章' : 'No articles in this category'}
              </div>
            )}
          </>
        )}

        {/* View All button */}
        {!loading && !error && hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="rounded-[10px] border border-white/15 px-6 py-2.5 text-sm font-medium text-[#F0F0F5] transition-all hover:border-white/25 hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.98]"
            >
              {isZh ? `查看更多 (${visibleArticles.length} / ${filtered.length})` : `Load More (${visibleArticles.length} / ${filtered.length})`}
            </button>
          </div>
        )}
      </div>

      {/* ====== Modal Overlay ====== */}
      <AnimatePresence mode="wait">
        {selected && selectedStyle && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop with animated radial glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'rgba(5, 5, 8, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
            >
              {/* Animated radial glow */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: easeOutExpo }}
                style={{
                  width: '900px',
                  height: '900px',
                  background: `radial-gradient(circle, ${selectedStyle.glow.replace('0.3', '0.12')} 0%, transparent 65%)`,
                }}
              />
            </motion.div>

            {/* Modal Card */}
            <motion.div
              className="relative z-10 mx-auto flex max-h-[85vh] w-[92vw] max-w-[860px] flex-col overflow-hidden rounded-[24px]"
              style={{
                background: 'rgba(10, 10, 18, 0.94)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: `1px solid ${selectedStyle.glow}`,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 25px 80px ${selectedStyle.bg}, 0 8px 24px rgba(0,0,0,0.6)`,
              }}
              initial={{ opacity: 0, scale: 0.88, y: 40, rotateX: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20, rotateX: -4 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              {/* Top animated gradient line */}
              <motion.div
                className="h-[2px] w-full"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 }}
                style={{
                  background: `linear-gradient(90deg, transparent, ${selectedStyle.text}, ${selectedStyle.glow.replace('0.3', '0.6')}, transparent)`,
                  transformOrigin: 'center',
                }}
              />

              {/* Header bar */}
              <motion.div
                className="flex items-center justify-between px-6 pt-5 sm:px-8"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div className="flex items-center gap-3" variants={staggerItem}>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: selectedStyle.bg,
                      color: selectedStyle.text,
                      boxShadow: `0 0 12px ${selectedStyle.glow.replace('0.3', '0.15')}`,
                    }}
                  >
                    {selected.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#55556B]">
                    {(() => {
                      const SIcon = sourceIcons[selected.source] || MessageCircle;
                      return <SIcon className="h-3 w-3" />;
                    })()}
                    {selected.source}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#55556B]">
                    <Calendar className="h-3 w-3" />
                    {formatDate(selected.date, isZh)}
                  </span>
                </motion.div>
                <motion.button
                  variants={staggerItem}
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#55556B] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:text-[#F0F0F5]"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>

              {/* Content area with staggered animation */}
              <motion.div
                className="flex-1 overflow-y-auto px-6 pb-8 pt-5 sm:px-8"
                variants={contentStagger}
                initial="hidden"
                animate="show"
              >
                {/* Title */}
                <motion.h2
                  className="text-xl font-bold leading-snug text-[#F0F0F5] sm:text-2xl"
                  variants={contentItem}
                >
                  {selected.title}
                </motion.h2>

                {/* Tags */}
                <motion.div className="mt-4 flex flex-wrap gap-2" variants={contentItem}>
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium text-[#8B8B9E]"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* Divider */}
                <motion.div
                  className="my-6 h-px"
                  style={{ background: `linear-gradient(90deg, ${selectedStyle.text}40, ${selectedStyle.glow.replace('0.3', '0.2')}, transparent)` }}
                  variants={contentItem}
                />

                {/* Excerpt — hide for GitHub repos since full README is below */}
                {selected.source !== 'GitHub' && selected.excerpt && (
                  <motion.p
                    className="text-base font-medium leading-relaxed text-[#A5B4FC]"
                    style={{ lineHeight: 1.7 }}
                    variants={contentItem}
                  >
                    {selected.excerpt}
                  </motion.p>
                )}

                {/* Full content — Markdown rendered */}
                <motion.div className="markdown-body mt-5" variants={contentItem}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="mb-4 mt-6 text-xl font-bold text-[#F0F0F5]">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="mb-3 mt-5 text-lg font-semibold text-[#F0F0F5]">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mb-2 mt-4 text-base font-semibold text-[#F0F0F5]">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 text-sm leading-relaxed text-[#8B8B9E]" style={{ lineHeight: 1.8 }}>
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-4 ml-4 list-disc space-y-1 text-sm text-[#8B8B9E]">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-4 ml-4 list-decimal space-y-1 text-sm text-[#8B8B9E]">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#A5B4FC] underline underline-offset-2 transition-colors hover:text-[#C7D2FE]"
                        >
                          {children}
                        </a>
                      ),
                      code: ({ children }) => (
                        <code className="rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-xs text-[#A5B4FC]">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="mb-4 overflow-x-auto rounded-lg bg-[rgba(255,255,255,0.04)] p-4 text-xs text-[#8B8B9E]">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="mb-4 border-l-2 border-[#A5B4FC] pl-4 text-sm italic text-[#8B8B9E]">
                          {children}
                        </blockquote>
                      ),
                      img: ({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt || ''}
                          className="mb-4 max-h-[400px] w-auto rounded-lg object-contain"
                          loading="lazy"
                        />
                      ),
                      hr: () => <hr className="my-6 border-[rgba(255,255,255,0.08)]" />,
                      strong: ({ children }) => (
                        <strong className="font-semibold text-[#F0F0F5]">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-[#A5B4FC]">{children}</em>
                      ),
                      table: ({ children }) => (
                        <div className="mb-4 overflow-x-auto">
                          <table className="w-full border-collapse text-sm text-[#8B8B9E]">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-[rgba(255,255,255,0.04)] text-[#F0F0F5]">{children}</thead>
                      ),
                      th: ({ children }) => (
                        <th className="border border-[rgba(255,255,255,0.08)] px-3 py-2 text-left text-xs font-semibold">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-[rgba(255,255,255,0.06)] px-3 py-2">{children}</td>
                      ),
                    }}
                  >
                    {isZh ? selected.content : selected.contentEn}
                  </ReactMarkdown>
                </motion.div>

                {/* Bottom divider */}
                <div className="my-6 h-px bg-[rgba(255,255,255,0.06)]" />

                {/* Bottom actions */}
                <motion.div
                  className="flex flex-wrap items-center gap-3"
                  variants={contentItem}
                >
                  <motion.a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, ${selectedStyle.text}, ${selectedStyle.glow.replace('0.3', '0.6')})`,
                      boxShadow: `0 4px 20px ${selectedStyle.glow.replace('0.3', '0.15')}`,
                    }}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isZh ? '查看原文' : 'Open Original Article'}
                    <ExternalLink className="h-4 w-4" />
                  </motion.a>
                  <button
                    onClick={handleClose}
                    className="rounded-[10px] border border-white/15 px-5 py-2.5 text-sm font-medium text-[#F0F0F5] transition-all hover:border-white/25 hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    {isZh ? '关闭' : 'Close'}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
