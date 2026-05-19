import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, ArrowLeft, Stethoscope, ChartLine, Pill, Scan } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function GroupHealth() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isZh = lang === 'zh';
  const isDark = theme === 'dark';

  const researchTopics = [
    { icon: Stethoscope, title: isZh ? '临床决策支持' : 'Clinical Decision Support', desc: isZh ? '面向诊断辅助、治疗推荐和临床工作流优化的 AI 系统。' : 'AI systems for diagnostic assistance, treatment recommendation, and clinical workflow optimization.' },
    { icon: ChartLine, title: isZh ? '健康数据分析' : 'Health Data Analytics', desc: isZh ? '挖掘电子健康档案、可穿戴信号和人群健康数据。' : 'Mining electronic health records, wearable signals, and population health data for insights.' },
    { icon: Pill, title: isZh ? '精准医学' : 'Precision Medicine', desc: isZh ? '基于患者基因组、表型和临床史的个性化治疗策略。' : 'Personalized treatment strategies based on patient genomics, phenomics, and clinical history.' },
    { icon: Scan, title: isZh ? '医学知识图谱' : 'Medical Knowledge Graph', desc: isZh ? '面向推理和临床问答的结构化医学知识表示。' : 'Structured medical knowledge representation for reasoning and clinical question answering.' },
  ];

  const keywords = ['Medical AI', 'Clinical NLP', 'Health Informatics', 'Precision Medicine', 'EHR Mining', 'Knowledge Graph', 'Diagnosis AI', 'Drug Recommendation'];

  const projects = [
    { name: isZh ? '临床知识图谱' : 'Clinical Knowledge Graph', desc: isZh ? '整合多源证据用于临床推理的综合医学知识图谱。' : 'A comprehensive medical knowledge graph integrating multi-source evidence for clinical reasoning.', tag: 'Knowledge Graph' },
    { name: isZh ? '健康数据挖掘平台' : 'Health Data Mining Platform', desc: isZh ? '面向疾病模式发现和风险预测的大规模电子健康档案分析系统。' : 'Large-scale EHR analysis system for disease pattern discovery and risk prediction.', tag: 'Health Data' },
    { name: isZh ? 'AI 药物推荐' : 'AI-Powered Drug Recommendation', desc: isZh ? '基于患者病史和临床指南的智能药物推荐系统。' : 'Intelligent medication recommendation system based on patient history and clinical guidelines.', tag: 'Clinical AI' },
  ];

  return (
    <div style={{ background: isDark ? '#050508' : '#f0f0f5' }}>
      {/* Hero Banner */}
      <section className="relative flex min-h-[480px] items-end overflow-hidden pb-16 pt-32">
        <div className="absolute inset-0" style={{ background: isDark ? 'linear-gradient(180deg, #080810 0%, #050508 100%)' : 'linear-gradient(180deg, #f8f8fa 0%, #f0f0f5 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(14,165,233,0.12) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(56,189,248,0.06) 0%, transparent 50%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOutExpo }}>
            <Link to="/" className={`mb-6 inline-flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}>
              <ArrowLeft className="h-4 w-4" />
              {isZh ? '返回首页' : 'Back to Home'}
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(14,165,233,0.1)]">
                <HeartPulse className="h-5 w-5 text-[#38bdf8]" />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#38bdf8]">
                {isZh ? '研究方向' : 'RESEARCH GROUP'}
              </span>
            </div>
            <h1 className={`display-xl ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>AI for Health</h1>
            <p className={`mt-2 text-lg ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`}>
              {isZh ? '人工智能 × 健康医疗' : 'AI × Health'}
            </p>
            <p className={`mt-4 max-w-[640px] text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.75 }}>
              {isZh
                ? '医学人工智能、健康数据分析、临床辅助决策与精准健康管理。'
                : 'Medical AI, health data analytics, clinical decision support, and precision health.'}
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
                <span className="inline-block h-0.5 w-6 bg-[#0EA5E9]" />
                <span className={`text-xs font-medium uppercase tracking-[0.2em] ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>{isZh ? '概览' : 'OVERVIEW'}</span>
              </div>
              <h2 className={`mb-6 text-2xl font-semibold tracking-tight ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                {isZh ? '智能医疗系统' : 'Intelligent Healthcare Systems'}
              </h2>
              <p className={`mb-4 text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.8 }}>
                {isZh
                  ? '我们开发面向医疗挑战的 AI 驱动解决方案，涵盖临床决策支持系统、医学知识图谱、健康数据挖掘和精准医学。'
                  : 'We develop AI-driven solutions for healthcare challenges, spanning clinical decision support, medical knowledge graphs, and precision medicine.'}
              </p>
              <p className={`text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.8 }}>
                {isZh
                  ? '通过整合多模态健康数据与最先进的机器学习，我们构建辅助临床医生进行诊断、治疗规划和患者监护的系统。'
                  : 'By integrating multi-modal health data with state-of-the-art ML, we build systems that assist clinicians in diagnosis and treatment planning.'}
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
                    className="rounded-full px-3 py-1 text-xs font-medium text-[#38bdf8]"
                    style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.15)' }}
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
              <span className="inline-block h-0.5 w-6 bg-[#0EA5E9]" />
              <span className={`text-xs font-medium uppercase tracking-[0.2em] ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>{isZh ? '研究主题' : 'FOCUS AREAS'}</span>
            </div>
            <h2 className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>{isZh ? '研究主题' : 'Research Topics'}</h2>
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
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(14,165,233,0.1)]">
                    <Icon className="h-5 w-5 text-[#38bdf8]" />
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
              <span className="inline-block h-0.5 w-6 bg-[#0EA5E9]" />
              <span className={`text-xs font-medium uppercase tracking-[0.2em] ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>{isZh ? '代表性成果' : 'PROJECTS'}</span>
            </div>
            <h2 className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>{isZh ? '代表性成果' : 'Representative Work'}</h2>
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
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-[#38bdf8]" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.15)' }}>
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
