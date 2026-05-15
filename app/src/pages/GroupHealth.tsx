import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft } from 'lucide-react';

export default function GroupHealth() {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center px-4"
      style={{ background: '#050508' }}
    >
      <div className="text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'rgba(14, 165, 233, 0.1)' }}
        >
          <HeartPulse className="h-8 w-8 text-[#38bdf8]" />
        </div>
        <h1 className="mt-6 display-md text-[#F0F0F5]">
          AI for Health
        </h1>
        <p className="mt-3 text-lg text-[#8B8B9E]">
          Medical AI, Clinical Intelligence, Health Informatics
        </p>
        <p className="mt-6 text-sm text-[#55556B]">
          此页面正在建设中，敬请期待...
        </p>
        <p className="mt-1 text-sm text-[#55556B]">
          This page is coming soon.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-[10px] border border-white/15 px-5 py-2.5 text-sm font-medium text-[#F0F0F5] transition-all hover:border-white/25 hover:bg-[rgba(255,255,255,0.05)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
