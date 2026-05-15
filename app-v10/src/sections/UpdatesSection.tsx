import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageCircle, Github, Monitor } from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Category = 'All' | 'LLM & Agents' | 'AI for Biology' | 'AI for Health' | 'Group News' | 'Platforms';

interface Article {
  id: number;
  title: string;
  category: Category;
  source: 'WeChat' | 'GitHub' | 'Platform';
  date: string;
  abstract: string;
  link?: string;
}

const categories: Category[] = [
  'All',
  'LLM & Agents',
  'AI for Biology',
  'AI for Health',
  'Group News',
  'Platforms',
];

const articles: Article[] = [
  {
    id: 1,
    title: 'BUAgents: 企业级多智能体操作系统架构设计与实践',
    category: 'LLM & Agents',
    source: 'GitHub',
    date: '2025-01-15',
    abstract:
      '本文介绍了 BUAgents 的整体架构设计，包括多智能体协作框架、工具调用机制和记忆管理系统...',
    link: '#',
  },
  {
    id: 2,
    title: '基于大语言模型的蛋白质功能预测新方法',
    category: 'AI for Biology',
    source: 'WeChat',
    date: '2025-01-10',
    abstract:
      '探索如何利用大语言模型的语义理解能力来提升蛋白质功能预测的准确性和泛化性能...',
    link: '#',
  },
  {
    id: 3,
    title: 'XClaw 邮件推送系统 v2.0 版本更新',
    category: 'Platforms',
    source: 'Platform',
    date: '2025-01-08',
    abstract:
      'XClaw 2.0 新增 AI 智能摘要、多源 RSS 聚合和个性化推荐引擎，为科研人员提供更精准的信息...',
    link: '#',
  },
  {
    id: 4,
    title: '科研协作平台新增文献 AI 解读功能',
    category: 'Platforms',
    source: 'Platform',
    date: '2025-01-05',
    abstract:
      '科研协作平台正式上线文献 AI 解读模块，支持自动摘要、关键发现提取和关联研究推荐...',
    link: '#',
  },
  {
    id: 5,
    title: '医疗知识图谱在临床决策支持中的应用',
    category: 'AI for Health',
    source: 'WeChat',
    date: '2024-12-28',
    abstract:
      '构建面向临床决策支持的知识图谱系统，整合多源医学知识，提供可解释的诊断建议...',
    link: '#',
  },
  {
    id: 6,
    title: '课题组参加 2025 江苏生成式 AI 创新大赛获三等奖',
    category: 'Group News',
    source: 'WeChat',
    date: '2024-12-20',
    abstract:
      '我组项目 XBots 在 2025 江苏生成式人工智能创新大赛中获得三等奖...',
    link: '#',
  },
];

const categoryStyles: Record<string, { bg: string; text: string }> = {
  'LLM & Agents': { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa' },
  'AI for Biology': { bg: 'rgba(20,184,166,0.1)', text: '#2dd4bf' },
  'AI for Health': { bg: 'rgba(14,165,233,0.1)', text: '#38bdf8' },
  'Group News': { bg: 'rgba(255,255,255,0.05)', text: '#8B8B9E' },
  Platforms: { bg: 'rgba(245,158,11,0.1)', text: '#fbbf24' },
};

function SourceIcon({ source }: { source: Article['source'] }) {
  switch (source) {
    case 'WeChat':
      return <MessageCircle className="h-3 w-3" />;
    case 'GitHub':
      return <Github className="h-3 w-3" />;
    case 'Platform':
      return <Monitor className="h-3 w-3" />;
  }
}

export default function UpdatesSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filtered =
    activeCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

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
              WHAT&apos;S NEW
            </span>
          </div>
          <h2 className="display-lg text-[#F0F0F5]">Latest Updates</h2>
          <p className="mt-4 text-lg text-[#8B8B9E]" style={{ lineHeight: 1.75 }}>
            同步展示课题组公众号、科研动态、平台更新与方向组文章。
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
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#F0F0F5';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#8B8B9E';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Articles Grid */}
        <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((article) => {
              const catStyle = categoryStyles[article.category] || {
                bg: 'rgba(255,255,255,0.05)',
                text: '#8B8B9E',
              };

              return (
                <motion.article
                  key={article.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className="group overflow-hidden rounded-[14px] p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'rgba(10, 10, 18, 0.55)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{
                        background: catStyle.bg,
                        color: catStyle.text,
                      }}
                    >
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#55556B]">
                      <SourceIcon source={article.source} />
                      {article.source}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-base font-semibold leading-snug text-[#F0F0F5] line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Abstract */}
                  <p className="mt-2 text-sm leading-relaxed text-[#8B8B9E] line-clamp-3" style={{ lineHeight: 1.6 }}>
                    {article.abstract}
                  </p>

                  {/* Bottom row */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-[#55556B]">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                    <span className="text-sm font-medium text-[#A5B4FC] transition-colors hover:underline">
                      Read More &rarr;
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => alert('Coming soon')}
            className="rounded-[10px] border border-white/15 px-6 py-2.5 text-sm font-medium text-[#F0F0F5] transition-all hover:border-white/25 hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.98]"
          >
            View All Updates
          </button>
        </div>
      </div>
    </section>
  );
}
