import { Suspense } from 'react';
import { AnimatedAuth } from '@/components/Auth/AnimatedAuth';

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-lg font-semibold">Loading...</div>
      </div>
    }>
      <AnimatedAuth />
    </Suspense>
  );
}
