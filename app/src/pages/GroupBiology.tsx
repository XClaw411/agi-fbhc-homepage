import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dna, ArrowLeft, Microscope, Atom, Database, FlaskConical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function GroupBiology() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isZh = lang === 'zh';
  const isDark = theme === 'dark';

  const researchTopics = [
    { icon: Microscope, title: isZh ? '生物信息学' : 'Bioinformatics', desc: isZh ? '大规模生物序列、基因组和分子结构的计算分析。' : 'Computational analysis of biological sequences, genomes, and molecular structures at scale.' },
    { icon: Atom, title: isZh ? '分子智能' : 'Molecular Intelligence', desc: isZh ? '面向药物发现的 AI 驱动分子表征学习与性质预测。' : 'AI-powered molecular representation learning and property prediction for drug discovery.' },
    { icon: Database, title: isZh ? '生物学基础模型' : 'Biological Foundation Models', desc: isZh ? '面向蛋白质、DNA 和 RNA 序列理解的大规模预训练模型。' : 'Large-scale pre-trained models for protein, DNA, and RNA sequence understanding.' },
    { icon: FlaskConical, title: isZh ? 'AI 生命科学' : 'AI for Life Sciences', desc: isZh ? '面向生物数据建模和生命系统理解的智能系统。' : 'Intelligent systems for biological data modeling and life system understanding.' },
  ];

  const keywords = ['Bioinformatics', 'Protein LLM', 'Molecular AI', 'Drug Discovery', 'Genomics', 'Foundation Models', 'AlphaFold', 'Single-Cell'];

  const projects = [
    { name: isZh ? '蛋白质功能预测' : 'Protein Function Prediction', desc: isZh ? '利用 LLM 提升蛋白质功能预测的准确性和泛化能力。' : 'Leveraging LLMs for enhanced protein function prediction accuracy and generalization.', tag: 'Protein LLM' },
    { name: isZh ? '分子表征学习' : 'Molecular Representation Learning', desc: isZh ? '面向分子性质预测和类药性评估的基础模型。' : 'Foundation models for molecular property prediction and drug-likeness assessment.', tag: 'Molecular AI' },
    { name: isZh ? '基因组序列分析' : 'Genomic Sequence Analysis', desc: isZh ? '使用基于 Transformer 的架构进行大规模基因组数据分析。' : 'Large-scale genomic data analysis using transformer-based architectures.', tag: 'Genomics' },
  ];

  return (
    <div style={{ background: isDark ? '#050508' : '#f0f0f5' }}>
      {/* Hero Banner */}
      <section className="relative flex min-h-[480px] items-end overflow-hidden pb-16 pt-32">
        <div className="absolute inset-0" style={{ background: isDark ? 'linear-gradient(180deg, #080810 0%, #050508 100%)' : 'linear-gradient(180deg, #f8f8fa 0%, #f0f0f5 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(20,184,166,0.12) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(45,212,191,0.06) 0%, transparent 50%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOutExpo }}>
            <Link to="/" className={`mb-6 inline-flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}>
              <ArrowLeft className="h-4 w-4" />
              {isZh ? '返回首页' : 'Back to Home'}
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(20,184,166,0.1)]">
                <Dna className="h-5 w-5 text-[#2dd4bf]" />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#2dd4bf]">
                {isZh ? '研究方向' : 'RESEARCH GROUP'}
              </span>
            </div>
            <h1 className={`display-xl ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>AI for Biology</h1>
            <p className={`mt-2 text-lg ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`}>
              {isZh ? '人工智能 × 生物学' : 'AI × Biology'}
            </p>
            <p className={`mt-4 max-w-[640px] text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.75 }}>
              {isZh
                ? 'AI 驱动的生物数据建模、分子表征与生命系统理解。'
                : 'AI-driven biological data modeling, molecular representation, and understanding of living systems.'}
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
                <span className="inline-block h-0.5 w-6 bg-[#14B8A6]" />
                <span className={`text-xs font-medium uppercase tracking-[0.2em] ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>{isZh ? '概览' : 'OVERVIEW'}</span>
              </div>
              <h2 className={`mb-6 text-2xl font-semibold tracking-tight ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                {isZh ? 'AI 驱动的生命科学研究' : 'AI-Powered Life Science Research'}
              </h2>
              <p className={`mb-4 text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.8 }}>
                {isZh
                  ? '我们开发人工智能方法来解决生命科学中的基础挑战，从蛋白质功能预测和分子性质估计到基因组序列分析和系统生物学。我们的工作将前沿机器学习与领域生物学知识相结合。'
                  : 'We develop AI methods to tackle fundamental challenges in life sciences, from protein function prediction to genomic sequence analysis and systems biology.'}
              </p>
              <p className={`text-base ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`} style={{ lineHeight: 1.8 }}>
                {isZh
                  ? '我们探索大语言模型如何捕捉生物序列的语义和结构模式，实现更准确的预测和在药物发现和精准医学中的新科学发现。'
                  : 'We explore how LLMs can capture semantic and structural patterns of biological sequences, enabling more accurate predictions and novel discoveries.'}
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
                    className="rounded-full px-3 py-1 text-xs font-medium text-[#2dd4bf]"
                    style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.15)' }}
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
              <span className="inline-block h-0.5 w-6 bg-[#14B8A6]" />
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
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(20,184,166,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(20,184,166,0.1)]">
                    <Icon className="h-5 w-5 text-[#2dd4bf]" />
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
              <span className="inline-block h-0.5 w-6 bg-[#14B8A6]" />
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
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-[#2dd4bf]" style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.15)' }}>
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
