'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Spinner from './components/Spinner';

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-slate-600 mb-6 max-w-lg">
        An unexpected error occurred while loading the application. You can try again or go
        back to the homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
        >
          Go Home
        </Link>
      </div>
      <div className="mt-8 opacity-40">
        <Spinner size={4} />
      </div>
    </div>
  );
} 