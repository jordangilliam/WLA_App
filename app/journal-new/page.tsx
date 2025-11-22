import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const JournalPageClient = dynamic(() => import('./JournalPageClient'), {
  ssr: false,
});

export default function JournalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your journal...</p>
          </div>
        </div>
      }
    >
      <JournalPageClient />
    </Suspense>
  );
}

