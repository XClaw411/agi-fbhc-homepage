import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, ArrowLeft, Brain, Wrench, Network, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function GroupLLM() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isZh = lang === 'zh';
  const isDark = theme === 'dark';

  const researchTopics = [
    { icon: Brain, title: isZh ? '基础模型' : 'Foundation Models', desc: isZh ? '面向科学推理和知识综合的大规模预训练模型。' : 'Large-scale pre-trained models for scientific reasoning and knowledge synthesis.' },
    { icon: Wrench, title: isZh ? '工具调用与 API' : 'Tool Use & APIs', desc: isZh ? '自主工具调用、API 编排和函数调用框架。' : 'Autonomous tool invocation, API orchestration, and function-calling frameworks.' },
    { icon: Network, title: isZh ? '多智能体系统' : 'Multi-Agent Systems', desc: isZh ? '面向复杂科学任务分解的协作智能体架构。' : 'Collaborative agent architectures for complex scientific task decomposition.' },
    { icon: Sparkles, title: isZh ? 'AI 科研助手' : 'AI Research Assistant', desc: isZh ? '面向文献综述、实验设计和假设生成的智能体。' : 'Intelligent agents for literature review, experiment design, and hypothesis generation.' },
  ];

  const keywords = ['LLM', 'Agents', 'Tool Use', 'Multi-Agent', 'RAG', 'Prompt Engineering', 'ReAct', 'Chain-of-Thought'];

  const projects = [
    { name: 'BUAgents', desc: isZh ? '面向协作式 AI 工作流的企业级多智能体操作系统。' : 'Enterprise-grade multi-agent operating system for collaborative AI workflows.', tag: 'Multi-Agent' },
    { name: 'XBots', desc: isZh ? '面向自动化研究流程构建的生成式 AI 框架。' : 'Generative AI framework for automated research pipeline construction.', tag: 'Generative AI' },
    { name: isZh ? '科研协作平台' : 'Research Collaboration Platform', desc: isZh ? '集成文献管理、任务追踪和智能体的 AI 辅助工作空间。' : 'AI-assisted workspace integrating literature management, task tracking, and intelligent agents.', tag: 'Platform' },
  ];

  return (
    <div style={{ background: isDark ? '#050508' : '#f0f0f5' }}>
      {/* Hero Banner */}
      <section className="relative flex min-h-[480px] items-end overflow-hidden pb-16 pt-32">
        <div className="absolute inset-0" style={{ background: isDark ? 'linear-gradient(180deg, #0c0818 0%, #050508 100%)' : 'linear-gradient(180deg, #f5f0ff 0%, #f0f0f5 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(124,58,237,0.12) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(79,70,229,0.06) 0%, transparent 50%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOutExpo }}>
            <Link to="/" className={`mb-6 inline-flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}>
              <ArrowLeft className="h-4 w-4" />
              {isZh ? '返回首页' : 'Back to Home'}
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(139,92,246,0.1)]">
                <Bot className="h-5 w-5 text-[#a78bfa]" />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#a78bfa]">
                {isZh ? '研究方向' : 'RESEARCH GROUP'}
              </span>
            </div>
            <h1 className={`display-xl ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>LLM & Agents</h1>
            <p className={`mt-2 text-lg ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`}>
              {isZh ? '大模型与智能体' : 'Large Language Models & Agents'}
            </p>
            <p className={`mt-4 max-w-[640px] text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.75 }}>
              {isZh
                ? '大模型基础、智能体系统、工具调用与多智能体协作科学研究。'
                : 'Foundation models, agent systems, tool use, and multi-agent collaboration for scientific research.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="lg:col-span-2"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-block h-0.5 w-6 bg-[#7C3AED]" />
                <span className={`text-xs font-medium uppercase tracking-[0.2em] ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>{isZh ? '概览' : 'OVERVIEW'}</span>
              </div>
              <h2 className={`mb-6 text-2xl font-semibold tracking-tight ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                {isZh ? '推进面向科学研究的 AI 智能体' : 'Advancing AI Agents for Science'}
              </h2>
              <p className={`mb-4 text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.8 }}>
                {isZh
                  ? '我们构建基于大语言模型的智能体，能够自主规划、推理和执行复杂的科学工作流。研究范围从单智能体工具调用到多智能体协作系统，应用于自动化文献分析、实验设计和研究协作。'
                  : 'We build large language model-based intelligent agents that can autonomously plan, reason, and execute complex scientific workflows. Our research spans from single-agent tool use to multi-agent collaborative systems.'}
              </p>
              <p className={`text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.8 }}>
                {isZh
                  ? '核心项目包括 BUAgents（企业级多智能体操作系统）、XBots（获奖的生成式 AI 框架）和集成 AI 辅助的科研协作平台。'
                  : 'Key projects include BUAgents (enterprise multi-agent OS), XBots (award-winning generative AI framework), and the Research Collaboration Platform.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
            >
              <h3 className={`mb-4 text-sm font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>{isZh ? '关键词' : 'Keywords'}</h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full px-3 py-1 text-xs font-medium text-[#a78bfa]"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research Topics */}
      <section className="py-16" style={{ background: isDark ? '#0A0A12' : '#ffffff' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="mb-10"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6 bg-[#7C3AED]" />
              <span className={`text-xs font-medium uppercase tracking-[0.2em] ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>{isZh ? '研究主题' : 'FOCUS AREAS'}</span>
            </div>
            <h2 className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
              {isZh ? '研究主题' : 'Research Topics'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {researchTopics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, ease: easeOutExpo, delay: i * 0.1 }}
                  className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: isDark ? 'rgba(10, 10, 18, 0.55)' : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(139,92,246,0.1)]">
                    <Icon className="h-5 w-5 text-[#a78bfa]" />
                  </div>
                  <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>{topic.title}</h3>
                  <p className={`mt-2 text-sm ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.7 }}>{topic.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="mb-10"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6 bg-[#7C3AED]" />
              <span className={`text-xs font-medium uppercase tracking-[0.2em] ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>{isZh ? '代表性成果' : 'PROJECTS'}</span>
            </div>
            <h2 className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
              {isZh ? '代表性成果' : 'Representative Work'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {projects.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: easeOutExpo, delay: i * 0.1 }}
                className="rounded-2xl p-6"
                style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}
              >
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-[#a78bfa]" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  {p.tag}
                </span>
                <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>{p.name}</h3>
                <p className={`mt-2 text-sm ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.7 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
