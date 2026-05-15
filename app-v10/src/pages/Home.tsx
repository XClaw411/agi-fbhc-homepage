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
      <UpdatesSection />
      <AboutSection />
    </>
  );
}
