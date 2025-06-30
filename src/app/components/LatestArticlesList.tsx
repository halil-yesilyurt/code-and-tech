'use client';
import { useState } from 'react';
import ArticleCard from './ArticleCard';

export default function LatestArticlesList({ posts }: { posts: unknown[] }) {
  const INITIAL = 5;
  const LOAD_MORE = 3;
  const [visible, setVisible] = useState(INITIAL);
  const handleShowMore = () => setVisible((v) => v + LOAD_MORE);
  const visiblePosts = posts.slice(0, visible);
  const hasMore = visible < posts.length;

  return (
    <>
      <div className='grid gap-8'>
        {visiblePosts.map((post, i) => {
          const p = post as { id: number };
          return (
            <div key={p.id} style={{ animationDelay: `${i * 60}ms` }} className='animate-fade-slide-in'>
              <ArticleCard post={post} linkBase='/' />
            </div>
          );
        })}
      </div>
      {hasMore && (
        <div className='flex justify-center mt-8'>
          <button
            onClick={handleShowMore}
            className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer'
            type='button'
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
}
