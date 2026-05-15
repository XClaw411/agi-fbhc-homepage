import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageCircle, Github, Monitor, X, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const springTransition = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

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

const articles: Article[] = [
  {
    id: '1',
    category: 'LLM & Agents',
    source: 'GitHub',
    title: 'BUAgents：企业级多智能体操作系统架构设计与实践',
    excerpt: '本文介绍了 BUAgents 的整体架构设计，包括多智能体协作框架、工具调用机制和记忆管理系统...',
    content: 'BUAgents 是我们团队自主研发的企业级多智能体操作系统，旨在为复杂科研任务提供自动化协作能力。系统采用分层架构设计，底层为工具调用与 API 编排引擎，中层为多智能体协作框架，上层为面向用户的任务编排界面。核心创新点包括动态任务分解算法、智能体间消息传递协议以及基于记忆的上下文管理系统。实验表明，BUAgents 在文献综述、代码生成和实验设计等任务上相比单智能体系统效率提升约 40%。',
    contentEn: 'BUAgents is an enterprise-grade multi-agent operating system developed by our team, designed to automate collaborative capabilities for complex research tasks. The system adopts a layered architecture with a tool invocation and API orchestration engine at the bottom, a multi-agent collaboration framework in the middle, and a user-facing task orchestration interface at the top. Key innovations include dynamic task decomposition algorithms, inter-agent message passing protocols, and memory-based context management. Experiments show BUAgents improves efficiency by ~40% compared to single-agent systems on literature review, code generation, and experiment design tasks.',
    date: '2025-01-15',
    tags: ['Multi-Agent', 'LLM', 'System Design'],
    url: '#',
  },
  {
    id: '2',
    category: 'AI for Biology',
    source: 'WeChat',
    title: '基于大语言模型的蛋白质功能预测新方法',
    excerpt: '探索如何利用大语言模型的语义理解能力来提升蛋白质功能预测的准确性和泛化性能...',
    content: '蛋白质功能预测是生物信息学领域的核心挑战之一。传统方法依赖序列比对和手工特征工程，难以捕捉蛋白质序列中深层的语义信息。我们提出了一种基于大语言模型的蛋白质功能预测框架 ProtLLM，将蛋白质序列视为一种特殊"语言"，利用预训练语言模型的强大表征能力进行功能注释。在多个基准数据集上的实验结果表明，ProtLLM 在 GO 术语预测和酶分类任务上均取得了 state-of-the-art 的性能。',
    contentEn: 'Protein function prediction is one of the core challenges in bioinformatics. Traditional methods rely on sequence alignment and manual feature engineering, struggling to capture deep semantic information in protein sequences. We propose ProtLLM, a protein function prediction framework based on large language models that treats protein sequences as a special "language" and leverages the powerful representation capabilities of pretrained language models for functional annotation. Experimental results on multiple benchmark datasets show ProtLLM achieves state-of-the-art performance on GO term prediction and enzyme classification tasks.',
    date: '2025-01-10',
    tags: ['Protein LLM', 'Bioinformatics', 'Foundation Model'],
    url: '#',
  },
  {
    id: '3',
    category: 'Platforms',
    source: 'Platform',
    title: 'XClaw 邮件推送系统 v2.0 版本更新',
    excerpt: 'XClaw 2.0 新增 AI 智能摘要、多源 RSS 聚合和个性化推荐引擎，为科研人员提供更精准的信息...',
    content: 'XClaw 智能邮件推送系统迎来重大版本更新。v2.0 版本引入了三大核心功能：AI 智能摘要引擎，能够自动提炼论文核心观点并生成简洁摘要；多源 RSS 聚合器，支持同时追踪 arXiv、PubMed、Google Scholar 等 20+ 学术数据源；个性化推荐系统，基于用户阅读历史和兴趣画像进行精准内容推荐。此外，新版本还优化了邮件模板设计，支持深色模式，并引入了更灵活的定时推送策略。',
    contentEn: 'The XClaw intelligent email delivery system receives a major version update. v2.0 introduces three core features: an AI smart summary engine that automatically extracts key paper insights and generates concise summaries; a multi-source RSS aggregator supporting 20+ academic data sources including arXiv, PubMed, and Google Scholar; and a personalized recommendation system that delivers precisely curated content based on reading history and interest profiles. The new version also features optimized email templates, dark mode support, and more flexible scheduled delivery strategies.',
    date: '2025-01-08',
    tags: ['XClaw', 'RSS', 'AI Filtering'],
    url: '#',
  },
  {
    id: '4',
    category: 'AI for Health',
    source: 'WeChat',
    title: '医疗知识图谱在临床决策支持中的应用',
    excerpt: '构建面向临床决策支持的知识图谱系统，整合多源医学知识，提供可解释的诊断建议...',
    content: '临床决策支持系统是医学人工智能的重要应用方向。我们构建了一个面向中文医疗场景的知识图谱系统 MedKG，整合了临床指南、医学教科书、药品说明书和真实世界电子病历等多源医学知识。MedKG 采用多模态知识融合技术，将结构化知识与非结构化文本统一表示，支持复杂医学推理。在三个三甲医院的临床验证中，系统提供的诊断建议与专家共识的一致率达到 92.6%。',
    contentEn: 'Clinical decision support systems are an important application of medical AI. We built MedKG, a knowledge graph system for Chinese medical scenarios that integrates multi-source medical knowledge including clinical guidelines, medical textbooks, drug manuals, and real-world EHRs. MedKG adopts multi-modal knowledge fusion technology to uniformly represent structured knowledge and unstructured text, supporting complex medical reasoning. In clinical validation at three tertiary hospitals, the diagnostic suggestions provided by the system achieved 92.6% concordance with expert consensus.',
    date: '2024-12-28',
    tags: ['Knowledge Graph', 'Clinical AI', 'CDS'],
    url: '#',
  },
  {
    id: '5',
    category: 'Group News',
    source: 'WeChat',
    title: '课题组参加 2025 江苏生成式 AI 创新大赛获三等奖',
    excerpt: '我组项目 XBots 在 2025 江苏生成式人工智能创新大赛中获得三等奖...',
    content: '2025 年江苏省生成式人工智能创新大赛在南京圆满落幕。我组参赛项目 XBots（可扩展智能体构建框架）从全省 200 多个参赛项目中脱颖而出，荣获大赛三等奖。XBots 是一个面向科研场景的生成式 AI 框架，支持通过自然语言描述快速构建多智能体工作流，实现自动化实验设计、数据分析和报告生成。评委组特别肯定了 XBots 在科研自动化领域的创新性和实用性。',
    contentEn: 'The 2025 Jiangsu Generative AI Innovation Competition concluded successfully in Nanjing. Our project XBots (Extensible Bot Construction Framework) stood out from over 200 competing projects province-wide and won third prize. XBots is a generative AI framework for research scenarios that supports rapid construction of multi-agent workflows through natural language descriptions, enabling automated experiment design, data analysis, and report generation. The jury particularly recognized the innovation and practicality of XBots in the field of research automation.',
    date: '2024-12-20',
    tags: ['Award', 'Generative AI', 'XBots'],
    url: '#',
  },
];

const sourceIcons: Record<string, typeof Github> = {
  GitHub: Github,
  WeChat: MessageCircle,
  Platform: Monitor,
};

export default function UpdatesSection() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const selected = articles.find((a) => a.id === selectedId);
  const selectedStyle = selected ? categoryStyles[selected.category] : null;

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
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((article) => {
              const catStyle = categoryStyles[article.category] || {
                bg: 'rgba(255,255,255,0.05)',
                text: '#8B8B9E',
                glow: 'rgba(255,255,255,0.15)',
              };
              const SourceIcon = sourceIcons[article.source] || MessageCircle;
              const isOpen = selectedId === article.id;

              return (
                <motion.article
                  key={article.id}
                  layout={!isOpen}
                  layoutId={isOpen ? undefined : `update-card-${article.id}`}
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
                      {article.date}
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

        {/* View All button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => alert('Coming soon')}
            className="rounded-[10px] border border-white/15 px-6 py-2.5 text-sm font-medium text-[#F0F0F5] transition-all hover:border-white/25 hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.98]"
          >
            {isZh ? '查看全部动态' : 'View All Updates'}
          </button>
        </div>
      </div>

      {/* ====== Modal Overlay ====== */}
      <AnimatePresence>
        {selected && selectedStyle && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'rgba(5, 5, 8, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setSelectedId(null)}
            >
              {/* Subtle radial glow behind modal */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: '800px',
                  height: '800px',
                  background: `radial-gradient(circle, ${selectedStyle.glow.replace('0.3', '0.08')} 0%, transparent 70%)`,
                }}
              />
            </motion.div>

            {/* Modal Card */}
            <motion.div
              layoutId={`update-card-${selected.id}`}
              className="relative z-10 mx-auto flex max-h-[85vh] w-[92vw] max-w-[860px] flex-col overflow-hidden rounded-[24px]"
              style={{
                background: 'rgba(10, 10, 18, 0.92)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: `1px solid ${selectedStyle.glow}`,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 25px 80px ${selectedStyle.bg}, 0 8px 24px rgba(0,0,0,0.6)`,
              }}
              transition={springTransition}
            >
              {/* Top gradient line */}
              <div
                className="h-0.5 w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${selectedStyle.text}, transparent)` }}
              />

              {/* Header bar */}
              <div className="flex items-center justify-between px-6 pt-5 sm:px-8">
                <div className="flex items-center gap-3">
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
                    {selected.date}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#55556B] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:text-[#F0F0F5]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto px-6 pb-8 pt-5 sm:px-8">
                {/* Title */}
                <motion.h2
                  className="text-xl font-bold leading-snug text-[#F0F0F5] sm:text-2xl"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ delay: 0.08, duration: 0.35, ease: easeOutExpo }}
                >
                  {selected.title}
                </motion.h2>

                {/* Tags */}
                <motion.div
                  className="mt-4 flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ delay: 0.14, duration: 0.35, ease: easeOutExpo }}
                >
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
                  style={{ background: `linear-gradient(90deg, ${selectedStyle.text}30, transparent)` }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: easeOutExpo }}
                />

                {/* Excerpt */}
                <motion.p
                  className="text-base font-medium leading-relaxed text-[#A5B4FC]"
                  style={{ lineHeight: 1.7 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ delay: 0.2, duration: 0.35, ease: easeOutExpo }}
                >
                  {selected.excerpt}
                </motion.p>

                {/* Full content */}
                <motion.div
                  className="mt-5 space-y-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ delay: 0.26, duration: 0.35, ease: easeOutExpo }}
                >
                  {(isZh ? selected.content : selected.contentEn).split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-[#8B8B9E]" style={{ lineHeight: 1.8 }}>
                      {para}
                    </p>
                  ))}
                </motion.div>

                {/* Bottom divider */}
                <div className="my-6 h-px bg-[rgba(255,255,255,0.06)]" />

                {/* Bottom actions */}
                <motion.div
                  className="flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ delay: 0.32, duration: 0.35, ease: easeOutExpo }}
                >
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, ${selectedStyle.text}, ${selectedStyle.glow.replace('0.3', '0.6')})`,
                      boxShadow: `0 4px 20px ${selectedStyle.glow.replace('0.3', '0.15')}`,
                    }}
                  >
                    {isZh ? '查看原文' : 'Open Original Article'}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="rounded-[10px] border border-white/15 px-5 py-2.5 text-sm font-medium text-[#F0F0F5] transition-all hover:border-white/25 hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    {isZh ? '关闭' : 'Close'}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
