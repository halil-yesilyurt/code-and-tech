'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  // Update query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-lg mx-auto'>
      <div className='relative flex flex-col sm:flex-row w-full gap-2 sm:gap-0'>
        <div className='absolute left-3 top-2.5 sm:top-1/2 sm:-translate-y-1/2 flex items-center pointer-events-none'>
          <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
        </div>
        <input
          type='text'
          id='search-input'
          name='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search articles, tutorials, and insights...'
          className='w-full pl-10 pr-4 py-2 sm:py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500 transition-all duration-200 text-base sm:text-lg truncate'
          style={{ minWidth: 0 }}
        />
        <button
          type='submit'
          className='mt-2 sm:mt-0 sm:absolute sm:inset-y-0 sm:right-0 px-4 py-2 sm:py-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-l-none sm:rounded-r-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base font-semibold cursor-pointer min-w-[90px]'
          style={{ border: 'none' }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
