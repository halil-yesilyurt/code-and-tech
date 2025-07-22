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
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setVisible((v) => v + LOAD_MORE)}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
} 