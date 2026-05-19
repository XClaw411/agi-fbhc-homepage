import HeroSection from '@/sections/HeroSection';
import ResearchGroups from '@/sections/ResearchGroups';
import PlatformsSection from '@/sections/PlatformsSection';
import UpdatesSection from '@/sections/UpdatesSection';
import AboutSection from '@/sections/AboutSection';

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Gradient transition: Hero → ResearchGroups */}
      <div
        className="relative h-32 w-full"
        style={{
          background: 'linear-gradient(180deg, #050508 0%, #0c0c1a 50%, #080810 100%)',
        }}
      />

      <ResearchGroups />

      {/* Gradient transition: ResearchGroups → Platforms */}
      <div
        className="relative h-32 w-full"
        style={{
          background: 'linear-gradient(180deg, #080810 0%, #0A0A12 50%, #080810 100%)',
        }}
      />

      <PlatformsSection />

      {/* Gradient transition: Platforms → Updates */}
      <div
        className="relative h-32 w-full"
        style={{
          background: 'linear-gradient(180deg, #080810 0%, #050508 50%, #050508 100%)',
        }}
      />

      <UpdatesSection />

      {/* Gradient transition: Updates → About */}
      <div
        className="relative h-32 w-full"
        style={{
          background: 'linear-gradient(180deg, #050508 0%, #080810 50%, #0A0A12 100%)',
        }}
      />

      <AboutSection />
    </>
  );
}
