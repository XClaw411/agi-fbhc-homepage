import HeroSection from '@/sections/HeroSection';
import ResearchGroups from '@/sections/ResearchGroups';
import UpdatesSection from '@/sections/UpdatesSection';
import AboutSection from '@/sections/AboutSection';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <HeroSection />

      <ResearchGroups />

      {/* Platforms → Updates */}
      <div
        className="relative h-24 w-full"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #0A0A12 0%, #080810 50%, #050508 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8f8fa 50%, #f0f0f5 100%)',
        }}
      />

      <UpdatesSection />

      {/* Updates → About */}
      <div
        className="relative h-24 w-full"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #050508 0%, #080810 50%, #0A0A12 100%)'
            : 'linear-gradient(180deg, #f0f0f5 0%, #f8f8fa 50%, #ffffff 100%)',
        }}
      />

      <AboutSection />
    </>
  );
}
