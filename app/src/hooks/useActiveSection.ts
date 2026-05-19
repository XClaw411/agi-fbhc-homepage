import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const sectionIds = ['home', 'research-groups', 'news', 'platforms', 'about'];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    // 不在首页时，重置为 home 且不设置 observer
    if (!isHome) {
      setActiveSection('');
      return;
    }

    // 在首页时，设置 IntersectionObserver
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [isHome]);

  // 不在首页时返回空字符串
  if (!isHome) {
    return '';
  }

  return activeSection;
}
