import { motion } from 'framer-motion';
import { FlaskConical, Mail, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export default function PlatformsSection() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  return (
    <section id="platforms" className="relative py-16 lg:py-24" style={{ background: '#0A0A12' }}>
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
            <span className="text-xs font-medium tracking-[0.2em] text-[#55556B] uppercase">
              {isZh ? '基础设施' : 'INFRASTRUCTURE'}
            </span>
          </div>
          <h2 className="display-lg text-[#F0F0F5]">
            {isZh ? '平台工具' : 'Platforms'}
          </h2>
          <p className="mt-4 text-lg text-[#8B8B9E]" style={{ lineHeight: 1.75 }}>
            {isZh
              ? '课题组自主研发的研究基础设施与工具平台。'
              : 'Research infrastructure and tool platforms developed by the lab.'}
          </p>
        </motion.div>

        {/* Platform Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Research Collaboration Platform */}
          <motion.div variants={cardVariants}>
            <a
              href="https://research.agi-fbhc.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(10, 10, 18, 0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderLeft: '4px solid transparent',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                el.style.borderLeft = '4px solid #6366f1';
                el.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.06)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                el.style.borderLeft = '4px solid transparent';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Left accent border */}
              <div className="absolute left-0 top-0 hidden h-full w-1 bg-gradient-to-b from-indigo-500 to-violet-500" />

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(99,102,241,0.1)]">
                <FlaskConical className="h-7 w-7 text-[#818cf8]" />
              </div>

              <h3 className="mt-5 display-md text-[#F0F0F5]">
                {isZh ? '科研协作平台' : 'Research Collaboration Platform'}
              </h3>
              <p className="mt-1 text-sm italic text-[#55556B]">
                {isZh ? 'AI 辅助的科研协作工作空间' : 'AI-assisted scientific research workspace'}
              </p>

              <div className="my-4 h-px bg-[rgba(255,255,255,0.06)]" />

              <p className="max-w-[400px] text-sm leading-relaxed text-[#8B8B9E]" style={{ lineHeight: 1.7 }}>
                {isZh
                  ? '面向课题组科研协作、文献管理、任务推进与 AI 辅助研究的综合平台。'
                  : 'An integrated platform for team collaboration, literature management, and AI-assisted research.'}
              </p>

              {/* Features */}
              <div className="mt-4 flex flex-col gap-2">
                {(isZh
                  ? ['文献管理与协作', 'AI 辅助研究', '任务与进度跟踪']
                  : ['Literature Management', 'AI-Assisted Research', 'Task & Progress Tracking']
                ).map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#8B8B9E]" />
                    <span className="text-sm text-[#8B8B9E]">{f}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-[10px] border border-white/15 px-5 py-2.5 text-sm font-medium text-[#F0F0F5] transition-all group-hover:border-white/25 group-hover:bg-[rgba(255,255,255,0.05)]">
                {isZh ? '进入平台' : 'Open Platform'}
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </a>
          </motion.div>

          {/* XClaw Email */}
          <motion.div variants={cardVariants}>
            <a
              href="https://email.agi-fbhc.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(10, 10, 18, 0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderLeft: '4px solid transparent',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                el.style.borderLeft = '4px solid #f59e0b';
                el.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.06)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                el.style.borderLeft = '4px solid transparent';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(245,158,11,0.1)]">
                <Mail className="h-7 w-7 text-[#fbbf24]" />
              </div>

              <h3 className="mt-5 display-md text-[#F0F0F5]">
                {isZh ? 'XClaw 智能邮件订阅' : 'XClaw Intelligent Email Subscription'}
              </h3>
              <p className="mt-1 text-sm italic text-[#55556B]">
                {isZh ? '个性化学术信息推送' : 'Personalized academic information delivery'}
              </p>

              <div className="my-4 h-px bg-[rgba(255,255,255,0.06)]" />

              <p className="max-w-[400px] text-sm leading-relaxed text-[#8B8B9E]" style={{ lineHeight: 1.7 }}>
                {isZh
                  ? '面向科研人员的智能邮件推送系统，支持个性化订阅、RSS 聚合、AI 智能筛选与定时推送。'
                  : 'Smart email delivery system for researchers with personalized subscriptions, RSS aggregation, and AI filtering.'}
              </p>

              {/* Features */}
              <div className="mt-4 flex flex-col gap-2">
                {(isZh
                  ? ['个性化订阅', 'RSS 聚合', 'AI 智能筛选']
                  : ['Personalized Subscriptions', 'RSS Aggregation', 'AI Smart Filtering']
                ).map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#8B8B9E]" />
                    <span className="text-sm text-[#8B8B9E]">{f}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-[10px] border border-white/15 px-5 py-2.5 text-sm font-medium text-[#F0F0F5] transition-all group-hover:border-white/25 group-hover:bg-[rgba(255,255,255,0.05)]">
                {isZh ? '进入 XClaw' : 'Open XClaw'}
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
