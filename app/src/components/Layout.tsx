import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '@/contexts/ThemeContext';

export default function Layout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ background: isDark ? '#050508' : '#f0f0f5' }}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
