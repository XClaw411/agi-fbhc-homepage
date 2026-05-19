import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Globe, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

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

  return (
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
          <p className={`text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
            © 2026 AGI&FBHC Research Group. {isZh ? '保留所有权利。' : 'All rights reserved.'}
          </p>
          <p className={`text-xs ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
            {isZh
              ? '通用人工智能&食品生物健康交叉研究中心 · 江南大学'
              : 'AGI & Food-Bio-Health Computing Research Center · Jiangnan University'}
          </p>
        </div>
      </div>
    </footer>
  );
}
