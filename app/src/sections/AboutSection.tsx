import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export default function AboutSection() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const stats = [
    { value: '3', label: isZh ? '研究方向' : 'Research Groups', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)' },
    { value: '7', label: isZh ? '导师人数' : 'Faculty Members', color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.1)' },
    { value: '100+', label: isZh ? 'IEEE 论文' : 'IEEE Trans. Papers', color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.1)' },
    { value: '10+', label: isZh ? '省级奖项' : 'Provincial Awards', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  ];

  const facultyMembers = [
    { name: '邓赵红', role: isZh ? '负责人' : 'Leader' },
    { name: '王士同', role: isZh ? '团队成员' : 'Member' },
    { name: '桑庆兵', role: isZh ? '团队成员' : 'Member' },
    { name: '肖志勇', role: isZh ? '团队成员' : 'Member' },
    { name: '宁乔', role: isZh ? '团队成员' : 'Member' },
    { name: '卞则康', role: isZh ? '团队成员' : 'Member' },
    { name: '左云', role: isZh ? '团队成员' : 'Member' },
  ];

  const honors = isZh
    ? [
      '江苏省 333 二层次人才 3 人次',
      '江苏省杰青 1 人次',
      '教育部新世纪优秀人才 2 人次',
      '教育部科技进步一等奖',
      '国家重点研发计划等国家级项目',
      '江苏省优秀博士/硕士论文 10 余次',
    ]
    : [
      'Jiangsu 333 Talents (Level 2): 3',
      'Jiangsu Outstanding Young Scholar: 1',
      'MOE New Century Talent: 2',
      'MOE Science & Technology Progress Award (1st Prize)',
      'National Key R&D Programs',
      'Jiangsu Outstanding Dissertations: 10+',
    ];

  return (
    <section id="about" className="relative py-16 lg:py-24" style={{ background: '#0A0A12' }}>
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
              {isZh ? '关于我们' : 'ABOUT US'}
            </span>
          </div>
          <h2 className="display-lg text-[#F0F0F5]">
            {isZh ? '关于 AGI&FBHC' : 'About AGI&FBHC'}
          </h2>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            {/* Team Name */}
            <h3 className="mb-3 text-lg font-semibold text-[#F0F0F5]">
              {isZh
                ? '通用人工智能&食品生物健康交叉研究中心'
                : 'AGI & Food-Bio-Health Computing Research Center'}
            </h3>

            {/* Main description from the display board */}
            <p
              className="max-w-[520px] text-base text-[#8B8B9E]"
              style={{ lineHeight: 1.8 }}
            >
              {isZh
                ? '本团队主要聚焦于通用人工智能行业应用，以及与食品生物健康等学科的交叉创新理论研究。曾获教育部科技进步一等奖等奖励，牵头承担国家重点研发计划等国家级项目，发表权威期刊 IEEE Trans. 系列论文 100 余篇，培育江苏省优秀博士/硕士论文 10 余次。'
                : 'Our team focuses on industry applications of AGI and interdisciplinary research with food science, biology, and health. We have won the First Prize of MOE Science & Technology Progress Award, led national key R&D programs, published 100+ IEEE Trans. papers, and trained 10+ outstanding dissertations.'}
            </p>

            {/* Faculty Members */}
            <div className="mt-6">
              <h4 className="mb-2.5 text-sm font-medium text-[#F0F0F5]">
                {isZh ? '团队成员' : 'Faculty Members'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {facultyMembers.map((member) => (
                  <span
                    key={member.name}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: member.role === (isZh ? '负责人' : 'Leader')
                        ? 'rgba(124, 58, 237, 0.12)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${member.role === (isZh ? '负责人' : 'Leader')
                        ? 'rgba(124, 58, 237, 0.25)'
                        : 'rgba(255, 255, 255, 0.08)'}`,
                      color: member.role === (isZh ? '负责人' : 'Leader') ? '#A78BFA' : '#8B8B9E',
                    }}
                  >
                    {member.name}
                    {member.role === (isZh ? '负责人' : 'Leader') && (
                      <span className="text-[10px] opacity-70">{isZh ? '负责人' : 'Leader'}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Honors */}
            <div className="mt-5">
              <h4 className="mb-2.5 text-sm font-medium text-[#F0F0F5]">
                {isZh ? '人才与荣誉' : 'Honors & Awards'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {honors.map((honor) => (
                  <span
                    key={honor}
                    className="rounded-full px-2.5 py-0.5 text-xs text-[#8B8B9E]"
                    style={{
                      background: 'rgba(20, 184, 166, 0.08)',
                      border: '1px solid rgba(20, 184, 166, 0.15)',
                    }}
                  >
                    {honor}
                  </span>
                ))}
              </div>
            </div>

            {/* External links */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="https://github.com/AGI-FBHC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#A5B4FC] transition-colors hover:underline"
              >
                GitHub
              </a>
              <a
                href="https://huggingface.co/AGI-FBHC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#A5B4FC] transition-colors hover:underline"
              >
                HuggingFace
              </a>
              <a
                href="mailto:dengzhaohong@jiangnan.edu.cn"
                className="flex items-center gap-1 text-sm text-[#A5B4FC] transition-colors hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                dengzhaohong@jiangnan.edu.cn
              </a>
            </div>
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <span
                  className="text-3xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <p className="mt-1 text-sm text-[#8B8B9E]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
