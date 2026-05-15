import { Link } from 'react-router-dom';
import { Dna, ArrowLeft } from 'lucide-react';

export default function GroupBiology() {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center px-4"
      style={{ background: '#050508' }}
    >
      <div className="text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'rgba(20, 184, 166, 0.1)' }}
        >
          <Dna className="h-8 w-8 text-[#2dd4bf]" />
        </div>
        <h1 className="mt-6 display-md text-[#F0F0F5]">
          AI for Biology
        </h1>
        <p className="mt-3 text-lg text-[#8B8B9E]">
          Bioinformatics, Foundation Models, Molecular Intelligence
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
