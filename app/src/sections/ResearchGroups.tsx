import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Dna, HeartPulse } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export default function ResearchGroups() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isZh = lang === 'zh';
  const isDark = theme === 'dark';

  const groups = [
    {
      id: 'llm',
      title: isZh ? '大模型与智能体' : 'LLM & Agents',
      english: 'Large Language Models, Agents, Tool Use, AI Research Assistant',
      description: isZh
        ? '聚焦大模型、智能体系统、工具调用、科研智能体与复杂任务规划。'
        : 'Large models, agent systems, tool invocation, research agents, and complex task planning.',
      keywords: ['LLM', 'Agents', 'Tool Use', 'Multi-Agent'],
      icon: Bot,
      color: '#a78bfa',
      colorClass: 'text-[#a78bfa]',
      bgClass: 'bg-[rgba(139,92,246,0.1)]',
      borderTop: 'linear-gradient(90deg, #4c1d95 0%, #7c3aed 100%)',
      leftBorder: 'rgba(124, 58, 237, 0.4)',
      cardBorder: isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.12)',
      glowBorder: 'rgba(139, 92, 246, 0.2)',
      shadow: '0 8px 32px rgba(139, 92, 246, 0.08)',
      link: '/groups/llm-agent',
      pillBg: 'rgba(139, 92, 246, 0.1)',
      pillText: '#a78bfa',
      pillBorder: 'rgba(139, 92, 246, 0.15)',
    },
    {
      id: 'biology',
      title: 'AI for Biology',
      english: 'Bioinformatics, Foundation Models, Molecular Intelligence',
      description: isZh
        ? '面向生命科学问题，探索 AI 在生物数据建模、分子表征、生命系统理解中的应用。'
        : 'Exploring AI applications in biological data modeling, molecular representation, and understanding living systems.',
      keywords: ['Bioinformatics', 'Protein LLM', 'Genomics'],
      icon: Dna,
      color: '#2dd4bf',
      colorClass: 'text-[#2dd4bf]',
      bgClass: 'bg-[rgba(20,184,166,0.1)]',
      borderTop: 'linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)',
      leftBorder: 'rgba(20, 184, 166, 0.4)',
      cardBorder: isDark ? 'rgba(20, 184, 166, 0.08)' : 'rgba(20, 184, 166, 0.12)',
      glowBorder: 'rgba(20, 184, 166, 0.2)',
      shadow: '0 8px 32px rgba(20, 184, 166, 0.08)',
      link: '/groups/ai-for-biology',
      pillBg: 'rgba(20, 184, 166, 0.1)',
      pillText: '#2dd4bf',
      pillBorder: 'rgba(20, 184, 166, 0.15)',
    },
    {
      id: 'health',
      title: 'AI for Health',
      english: 'Medical AI, Clinical Intelligence, Health Informatics',
      description: isZh
        ? '聚焦医学人工智能、健康数据分析、临床辅助决策与精准健康管理。'
        : 'Medical AI, health data analytics, clinical decision support, and precision health management.',
      keywords: ['Medical AI', 'Clinical AI', 'Health Informatics'],
      icon: HeartPulse,
      color: '#38bdf8',
      colorClass: 'text-[#38bdf8]',
      bgClass: 'bg-[rgba(14,165,233,0.1)]',
      borderTop: 'linear-gradient(90deg, #0369a1 0%, #0ea5e9 100%)',
      leftBorder: 'rgba(14, 165, 233, 0.4)',
      cardBorder: isDark ? 'rgba(14, 165, 233, 0.08)' : 'rgba(14, 165, 233, 0.12)',
      glowBorder: 'rgba(14, 165, 233, 0.2)',
      shadow: '0 8px 32px rgba(14, 165, 233, 0.08)',
      link: '/groups/ai-for-health',
      pillBg: 'rgba(14, 165, 233, 0.1)',
      pillText: '#38bdf8',
      pillBorder: 'rgba(14, 165, 233, 0.15)',
    },
  ];

  return (
    <section
      id="research-groups"
      className="relative py-16 lg:py-24"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #050508 0%, #080810 20%, #0A0A12 100%)'
          : 'linear-gradient(180deg, #f0f0f5 0%, #f5f5f8 20%, #ffffff 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="mb-12"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-block h-0.5 w-6 bg-[#06B6D4]" />
            <span className={`text-xs font-medium tracking-[0.2em] uppercase ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
              {isZh ? '研究方向' : 'RESEARCH DIRECTIONS'}
            </span>
          </div>
          <h2 className={`display-lg ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
            {isZh ? '研究方向' : 'Research Groups'}
          </h2>
          <p
            className={`mt-4 max-w-[600px] text-lg ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`}
            style={{ lineHeight: 1.75 }}
          >
            {isZh
              ? '三个核心研究方向，覆盖通用智能、生物计算与健康智能的交叉前沿。'
              : 'Three core research directions covering the intersection of general intelligence, biological computing, and health intelligence.'}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <motion.div key={group.id} variants={cardVariants}>
                <Link to={group.link}>
                  <div
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
                    style={{
                      background: isDark ? 'rgba(10, 10, 18, 0.55)' : 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: `1px solid ${group.cardBorder}`,
                      borderTop: `3px solid transparent`,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = group.glowBorder;
                      el.style.transform = 'translateY(-6px)';
                      el.style.boxShadow = group.shadow;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = group.cardBorder;
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    {/* Top gradient border */}
                    <div
                      className="absolute left-0 right-0 top-0 h-[3px]"
                      style={{ background: group.borderTop }}
                    />

                    {/* Left accent bar */}
                    <div
                      className="absolute bottom-0 left-0 top-0 w-1"
                      style={{ background: group.leftBorder }}
                    />

                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${group.bgClass}`}
                    >
                      <Icon className={`h-5 w-5 ${group.colorClass}`} />
                    </div>

                    {/* Title */}
                    <h3 className={`mt-4 display-md ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>{group.title}</h3>

                    {/* English subtitle */}
                    <p
                      className="mt-2 text-xs uppercase tracking-wider"
                      style={{ color: group.color }}
                    >
                      {group.english}
                    </p>

                    {/* Divider */}
                    <div className={`my-4 h-px ${isDark ? 'bg-[rgba(255,255,255,0.06)]' : 'bg-[rgba(0,0,0,0.06)]'}`} />

                    {/* Description */}
                    <p
                      className={`text-sm leading-relaxed ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`}
                      style={{ lineHeight: 1.7 }}
                    >
                      {group.description}
                    </p>

                    {/* Keywords */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            background: group.pillBg,
                            color: group.pillText,
                            border: `1px solid ${group.pillBorder}`,
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Button */}
                    <div
                      className="mt-6 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: group.color }}
                    >
                      {isZh ? '了解更多' : 'Learn More'}
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
