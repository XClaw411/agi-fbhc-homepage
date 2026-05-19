import HeroSection from '@/sections/HeroSection';
import ResearchGroups from '@/sections/ResearchGroups';
import PlatformsSection from '@/sections/PlatformsSection';
import UpdatesSection from '@/sections/UpdatesSection';
import AboutSection from '@/sections/AboutSection';

export default function Home() {
  return (
    <>
      <HeroSection />

      <ResearchGroups />

      <PlatformsSection />

      {/* Platforms → Updates */}
      <div
        className="relative h-24 w-full"
        style={{
          background: 'linear-gradient(180deg, #0A0A12 0%, #080810 50%, #050508 100%)',
        }}
      />

      <UpdatesSection />

      {/* Updates → About */}
      <div
        className="relative h-24 w-full"
        style={{
          background: 'linear-gradient(180deg, #050508 0%, #080810 50%, #0A0A12 100%)',
        }}
      />

      <AboutSection />
    </>
  );
}
