import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Globe, Mail, ExternalLink, X, Clock, Tag, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const CURRENT_VERSION = '1.0.0';

const changelog = [
  {
    version: '1.0.0',
    date: '2025-05-19',
    changes: [
      '首页全新改版，支持深色/浅色主题切换',
      '新增研究方向子页面（LLM & Agents / AI for Biology / AI for Health）',
      '集成最新动态模块，支持分类筛选与 Markdown 渲染',
      '平台工具卡片展示（科研协作平台、XClaw 邮件订阅）',
      '响应式设计，支持桌面端与移动端访问',
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Footer() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isZh = lang === 'zh';
  const isDark = theme === 'dark';
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <footer
        className={`border-t ${isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-[rgba(0,0,0,0.06)]'}`}
        style={{ background: isDark ? '#0A0A12' : '#f8f8fa' }}
      >
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* Column 1: Brand */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center rounded-xl bg-white/90 p-1">
                  <img src="/logo.png" alt="AGI&FBHC" className="h-5 w-5 object-contain" />
                </div>
                <span className={`text-sm font-semibold tracking-wide ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                  AGI&FBHC
                </span>
              </div>
              <p className={`mt-3 text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                {isZh
                  ? '通用人工智能&食品生物健康交叉研究中心'
                  : 'AGI & Food-Bio-Health Computing Research Center'}
              </p>
              <p className={`mt-1 text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                {isZh
                  ? '江南大学 · 江苏省 333 人才 · 教育部科技进步一等奖'
                  : 'Jiangnan University · Jiangsu 333 Talents · MOE Sci-Tech Progress Award'}
              </p>
              <p className={`mt-2 text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                Advancing AI for Agents, Biology, and Health.
              </p>
            </motion.div>

            {/* Column 2: Research Groups */}
            <motion.div variants={itemVariants}>
              <h4 className={`mb-4 text-sm font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                {isZh ? '研究方向' : 'Research Groups'}
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/groups/llm-agent"
                  className={`text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}
                >
                  {isZh ? '大模型与智能体' : 'LLM & Agents'}
                </Link>
                <Link
                  to="/groups/ai-for-biology"
                  className={`text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}
                >
                  AI for Biology
                </Link>
                <Link
                  to="/groups/ai-for-health"
                  className={`text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}
                >
                  AI for Health
                </Link>
              </div>
            </motion.div>

            {/* Column 3: Platforms & Links */}
            <motion.div variants={itemVariants}>
              <h4 className={`mb-4 text-sm font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                {isZh ? '平台' : 'Platforms'}
              </h4>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://research.agi-fbhc.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}
                >
                  Research Platform
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a
                  href="https://email.agi-fbhc.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}
                >
                  XClaw Email
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a
                  href="https://github.com/AGI-FBHC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}
                >
                  GitHub
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a
                  href="https://huggingface.co/AGI-FBHC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 text-sm transition-colors ${isDark ? 'text-[#8B8B9E] hover:text-[#F0F0F5]' : 'text-[#6B6B7B] hover:text-[#1a1a2e]'}`}
                >
                  HuggingFace
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </motion.div>

            {/* Column 4: Contact */}
            <motion.div variants={itemVariants}>
              <h4 className={`mb-4 text-sm font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                {isZh ? '联系方式' : 'Contact'}
              </h4>
              <div className="flex flex-col gap-2.5">
                <span className={`text-sm ${isDark ? 'text-[#8B8B9E]' : 'text-[#6B6B7B]'}`}>
                  {isZh ? '邓赵红教授' : 'Prof. Deng Zhaohong'}
                </span>
                <a
                  href="mailto:dengzhaohong@jiangnan.edu.cn"
                  className={`text-sm transition-colors hover:underline ${isDark ? 'text-[#A5B4FC]' : 'text-[#5b5bd6]'}`}
                >
                  dengzhaohong@jiangnan.edu.cn
                </a>
                <span className={`text-sm ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                  {isZh ? '江南大学' : 'Jiangnan University'}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://github.com/AGI-FBHC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    isDark
                      ? 'bg-[rgba(255,255,255,0.05)] text-[#8B8B9E] hover:bg-[rgba(255,255,255,0.1)]'
                      : 'bg-[rgba(0,0,0,0.05)] text-[#6B6B7B] hover:bg-[rgba(0,0,0,0.1)]'
                  }`}
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://huggingface.co/AGI-FBHC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    isDark
                      ? 'bg-[rgba(255,255,255,0.05)] text-[#8B8B9E] hover:bg-[rgba(255,255,255,0.1)]'
                      : 'bg-[rgba(0,0,0,0.05)] text-[#6B6B7B] hover:bg-[rgba(0,0,0,0.1)]'
                  }`}
                  aria-label="HuggingFace"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a
                  href="mailto:dengzhaohong@jiangnan.edu.cn"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    isDark
                      ? 'bg-[rgba(255,255,255,0.05)] text-[#8B8B9E] hover:bg-[rgba(255,255,255,0.1)]'
                      : 'bg-[rgba(0,0,0,0.05)] text-[#6B6B7B] hover:bg-[rgba(0,0,0,0.1)]'
                  }`}
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom bar */}
          <div className={`mt-12 flex flex-col items-center justify-between gap-2 border-t pt-6 md:flex-row ${
            isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-[rgba(0,0,0,0.06)]'
          }`}>
            <div className="flex items-center gap-3">
              <p className={`text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                © 2026 AGI&FBHC Research Group. {isZh ? '保留所有权利。' : 'All rights reserved.'}
              </p>
              <button
                onClick={() => setShowAbout(true)}
                className={`text-xs transition-colors hover:underline ${isDark ? 'text-[#55556B] hover:text-[#F0F0F5]' : 'text-[#8a8a9e] hover:text-[#1a1a2e]'}`}
              >
                {isZh ? '关于本站' : 'About'}
              </button>
            </div>
            <p className={`text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
              {isZh
                ? '通用人工智能&食品生物健康交叉研究中心 · 江南大学'
                : 'AGI & Food-Bio-Health Computing Research Center · Jiangnan University'}
            </p>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: isDark ? 'rgba(5, 5, 8, 0.7)' : 'rgba(240, 240, 245, 0.7)',
                backdropFilter: 'blur(12px)',
              }}
              onClick={() => setShowAbout(false)}
            />

            {/* Modal Card */}
            <motion.div
              className="relative z-10 flex max-h-[80vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[20px]"
              style={{
                background: isDark ? 'rgba(10, 10, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(40px)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: isDark
                  ? '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
                  : '0 25px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
              }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#06B6D4]/10">
                    <Tag className="h-4 w-4 text-[#06B6D4]" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                      {isZh ? '关于本站' : 'About This Site'}
                    </h3>
                    <span className={`text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                      v{CURRENT_VERSION}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAbout(false)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isDark ? 'text-[#55556B] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#F0F0F5]' : 'text-[#8a8a9e] hover:bg-[rgba(0,0,0,0.08)] hover:text-[#1a1a2e]'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Version Info */}
                <div className="mb-6 rounded-xl p-4"
                  style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                      {isZh ? '当前版本' : 'Current Version'}
                    </span>
                    <span className="rounded-full bg-[#06B6D4]/10 px-3 py-1 text-xs font-semibold text-[#06B6D4]">
                      v{CURRENT_VERSION}
                    </span>
                  </div>
                  <p className={`mt-2 text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                    {isZh
                      ? 'AGI&FBHC 课题组官方网站，展示研究方向、最新动态与平台工具。'
                      : 'Official website of the AGI&FBHC research group, showcasing research directions, latest updates, and platform tools.'}
                  </p>
                </div>

                {/* Changelog */}
                <h4 className={`mb-4 text-sm font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                  {isZh ? '更新日志' : 'Changelog'}
                </h4>

                <div className="space-y-4">
                  {changelog.map((release) => (
                    <div key={release.version} className="relative pl-5">
                      {/* Timeline line */}
                      <div className="absolute left-[5px] top-2 h-full w-px"
                        style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                      />
                      {/* Dot */}
                      <div className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2"
                        style={{ borderColor: '#06B6D4', background: isDark ? '#0A0A12' : '#ffffff' }}
                      />

                      <div className="pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isDark ? 'text-[#F0F0F5]' : 'text-[#1a1a2e]'}`}>
                            v{release.version}
                          </span>
                          <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                            <Clock className="h-3 w-3" />
                            {release.date}
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {release.changes.map((change, i) => (
                            <li key={i} className={`flex items-start gap-2 text-xs ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`}>
                              <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-[#06B6D4]" />
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-3"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
              >
                <p className={`text-center text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
                  © 2026 AGI&FBHC · {isZh ? '江南大学' : 'Jiangnan University'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
