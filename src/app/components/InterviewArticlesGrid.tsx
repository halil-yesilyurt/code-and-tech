'use client';
import { useState } from 'react';
import ArticleCard from './ArticleCard';

export default function InterviewArticlesGrid({ posts }: { posts: unknown[] }) {
  const INITIAL = 4;
  const LOAD_MORE = 4;
  const [visible, setVisible] = useState(INITIAL);
  const visiblePosts = posts.slice(0, visible);
  const hasMore = visible < posts.length;

  return (
    <>
      <div className="flex flex-wrap -mx-4">
        {visiblePosts.map((post: any, idx: number) => (
          <div key={post.id} className="w-full md:w-1/2 px-4 mb-8 animate-fade-slide-in" style={{ animationDelay: `${idx * 60}ms` }}>
            <ArticleCard post={post} linkBase="/" />
          </div>
        ))}
      </div>
      {hasMore && (
        <div className='text-center mt-10'>
          <button
            onClick={() => setVisible((v) => v + LOAD_MORE)}
            className='bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block cursor-pointer'
            type='button'
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
} 