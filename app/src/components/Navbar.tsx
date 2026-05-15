import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Menu, X, Languages } from 'lucide-react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: lang === 'zh' ? '首页' : 'Home', href: '#home' },
    { label: lang === 'zh' ? '研究方向' : 'Research Groups', href: '#research-groups' },
    { label: lang === 'zh' ? '平台' : 'Platforms', href: '#platforms' },
    { label: lang === 'zh' ? '动态' : 'News', href: '#news' },
    { label: lang === 'zh' ? '联系我们' : 'Contact', href: '#about' },
    { label: 'GitHub', href: 'https://github.com/AGI-FBHC', external: true },
  ];

  function handleNavClick(href: string) {
    setMenuOpen(false);
    if (href.startsWith('#') && isHome) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <motion.header
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 transition-colors"
      style={{
        background: scrolled ? 'rgba(10, 10, 18, 0.9)' : 'rgba(10, 10, 18, 0.65)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-xl bg-white/90 p-1">
            <img src="./logo.png" alt="AGI&FBHC" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-[#F0F0F5]">
            AGI&FBHC
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href.startsWith('#') && isHome
                ? activeSection === link.href.slice(1)
                : false;

            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative px-3 py-2 text-sm font-medium text-[#8B8B9E] transition-colors hover:text-[#F0F0F5]"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="relative px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  color: isActive ? '#A5B4FC' : '#8B8B9E',
                }}
              >
                <span className="hover:text-[#F0F0F5]">{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#06B6D4]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs font-medium text-[#8B8B9E] transition-colors hover:border-white/20 hover:text-[#F0F0F5]"
            aria-label="Toggle language"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>{lang === 'zh' ? 'EN' : '中文'}</span>
          </button>

          <a
            href="https://github.com/AGI-FBHC"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#8B8B9E] transition-colors hover:border-white/20 hover:text-[#F0F0F5]"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8B8B9E] transition-colors hover:text-[#F0F0F5] lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="overflow-hidden lg:hidden"
            style={{
              background: 'rgba(10, 10, 18, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <nav className="flex flex-col px-4 py-3">
              {navLinks.map((link) => {
                if (link.external) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 text-base font-medium text-[#8B8B9E] transition-colors hover:text-[#F0F0F5]"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="py-3 text-left text-base font-medium text-[#8B8B9E] transition-colors hover:text-[#F0F0F5]"
                  >
                    {link.label}
                  </button>
                );
              })}
              <button
                onClick={() => { toggleLang(); setMenuOpen(false); }}
                className="flex items-center gap-2 py-3 text-base font-medium text-[#8B8B9E] transition-colors hover:text-[#F0F0F5]"
              >
                <Languages className="h-4 w-4" />
                {lang === 'zh' ? 'Switch to English' : '切换为中文'}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
