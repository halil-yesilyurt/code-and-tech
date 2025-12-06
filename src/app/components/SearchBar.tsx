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
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 w-full'>
      <input
        type='text'
        id='search-input'
        name='search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search articles, tutorials, and insights...'
        className='flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-3 px-4 focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-200 outline-none'
      />
      <button
        type='submit'
        className='bg-primary text-gray-900 font-bold py-3 px-8 rounded-md hover:opacity-90 transition-opacity cursor-pointer'
      >
        Search
      </button>
    </form>
  );
}
