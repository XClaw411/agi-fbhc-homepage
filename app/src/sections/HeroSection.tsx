import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, ArrowRight } from 'lucide-react';
import { useParticleField } from '@/hooks/useParticleField';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function HeroSection() {
  const canvasRef = useParticleField();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const { lang } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollIndicator(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  function scrollToResearch() {
    const el = document.getElementById('research-groups');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  const isZh = lang === 'zh';
  const isDark = theme === 'dark';

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
    >
      {/* Layer 1: Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #050508 0%, #0c0c1a 40%, #0a1628 70%, #050508 100%)'
            : 'linear-gradient(180deg, #f0f0f5 0%, #e8e8f0 40%, #e0e8f0 70%, #f0f0f5 100%)',
        }}
      />

      {/* Layer 2: Violet ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 70% 50% at 50% 15%, rgba(124,58,237,0.10) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 70% 50% at 50% 15%, rgba(124,58,237,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Layer 3: Teal ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 50% 40% at 75% 70%, rgba(20,184,166,0.06) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 50% 40% at 75% 70%, rgba(20,184,166,0.04) 0%, transparent 50%)',
        }}
      />

      {/* Layer 4: Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 100%)',
        }}
      />

      {/* Layer 5: Particle canvas */}
      <motion.canvas
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 6: Pulsing glow orbs */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 4 }}>
        <div
          className="absolute animate-pulse-glow"
          style={{
            width: '400px',
            height: '400px',
            top: '20%',
            left: '30%',
            background: isDark
              ? 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
            animationDelay: '0s',
          }}
        />
        <div
          className="absolute animate-pulse-glow"
          style={{
            width: '300px',
            height: '300px',
            top: '60%',
            left: '70%',
            background: isDark
              ? 'radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(20,184,166,0.03) 0%, transparent 70%)',
            animationDelay: '3s',
          }}
        />
        <div
          className="absolute animate-pulse-glow"
          style={{
            width: '500px',
            height: '500px',
            top: '80%',
            left: '40%',
            background: isDark
              ? 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(14,165,233,0.03) 0%, transparent 70%)',
            animationDelay: '6s',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center px-4 text-center sm:px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: easeOutExpo }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="inline-block h-0.5 w-6 bg-[#06B6D4]" />
          <span className={`text-xs font-medium tracking-[0.2em] uppercase ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}>
            {isZh ? '科研团队' : 'RESEARCH GROUP'}
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: easeOutExpo }}
          className="display-xl text-gradient-hero whitespace-nowrap"
        >
          AGI&FBHC Research Group
        </motion.h1>

        {/* Chinese subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: easeOutExpo }}
          className={`mt-5 max-w-[600px] text-lg leading-relaxed ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`}
          style={{ lineHeight: 1.75 }}
        >
          {isZh ? '通用人工智能&食品生物健康交叉研究中心' : 'Artificial General Intelligence & Food-Bio-Health Computing'}
        </motion.p>

        {/* English tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.95, ease: easeOutExpo }}
          className={`mt-3 text-base italic tracking-wider ${isDark ? 'text-[#55556B]' : 'text-[#8a8a9e]'}`}
        >
          {isZh ? '推进面向智能体、生物学与健康的人工智能研究。' : 'Advancing AI for Agents, Biology, and Health.'}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1, ease: easeOutExpo }}
          className={`mt-5 max-w-[580px] text-sm leading-relaxed ${isDark ? 'text-[#8B8B9E]' : 'text-[#4a4a5e]'}`}
          style={{ lineHeight: 1.7 }}
        >
          {isZh
            ? '聚焦通用人工智能行业应用，以及与食品生物健康等学科的交叉创新理论研究。'
            : 'Focusing on industry applications of AGI and interdisciplinary research with food science, biology, and health.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3, ease: easeOutExpo }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={scrollToResearch}
            className="flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            {isZh ? '探索研究方向' : 'Explore Research Groups'}
            <ArrowDown className="h-4 w-4" />
          </button>

          <a
            href="https://github.com/AGI-FBHC"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-[10px] border px-6 py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
              isDark
                ? 'border-white/15 text-[#F0F0F5] hover:border-white/25 hover:bg-[rgba(255,255,255,0.05)]'
                : 'border-black/15 text-[#1a1a2e] hover:border-black/25 hover:bg-[rgba(0,0,0,0.05)]'
            }`}
          >
            <Github className="h-4 w-4" />
            {isZh ? '访问 GitHub' : 'Visit GitHub'}
          </a>

          <a
            href="https://research.agi-fbhc.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors hover:underline hover:underline-offset-4 ${
              isDark ? 'text-[#A5B4FC]' : 'text-[#5b5bd6]'
            }`}
          >
            {isZh ? '进入科研平台' : 'Open Research Platform'}
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollIndicator ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
      >
        <div className={`relative h-10 w-px overflow-hidden ${isDark ? 'bg-[rgba(255,255,255,0.15)]' : 'bg-[rgba(0,0,0,0.15)]'}`}>
          <div className={`absolute left-0 top-0 h-2 w-full animate-scroll-dot ${isDark ? 'bg-[rgba(255,255,255,0.4)]' : 'bg-[rgba(0,0,0,0.4)]'}`} />
        </div>
      </motion.div>
    </section>
  );
}
