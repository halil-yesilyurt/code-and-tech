'use client';

import { useState } from 'react';
import Link from 'next/link';
import { decodeHtmlEntities, stripHtml } from '@/lib/wordpress';

export default function BlogPostList({ posts }: { posts: any[] }) {
  // Show 4 initially, then 6 more each time
  const INITIAL = 4;
  const LOAD_MORE = 6;
  const [visible, setVisible] = useState(INITIAL);

  const handleShowMore = () => setVisible(v => v + LOAD_MORE);

  const visiblePosts = posts.slice(0, visible);
  const hasMore = visible < posts.length;

  // Helper to get category names from IDs
  function getCategoryNames(post: any) {
    if (!post.categories || !post._embedded || !post._embedded['wp:term'] || !post._embedded['wp:term'][0]) return [];
    return post._embedded['wp:term'][0].map((cat: any) => cat.name);
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {visiblePosts.map((post, i) => (
          <article
            key={post.id}
            style={{
              animationDelay: `${i * 60}ms`,
            }}
            className="group bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden card-hover flex flex-col transition-shadow duration-200
              animate-fade-slide-in
              hover:scale-[1.025] hover:shadow-2xl transition-transform duration-300"
          >
            {post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url && (
              <img
                src={post._embedded['wp:featuredmedia'][0].source_url}
                alt={post.title.rendered}
                className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex items-center text-sm text-slate-500 mb-2">
                <time dateTime={post.date} className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {decodeHtmlEntities(post.title.rendered)}
                </Link>
              </h3>
              <p className="text-slate-600 mb-3 line-clamp-3">
                {stripHtml(post.excerpt?.rendered || post.content?.rendered || '')}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {getCategoryNames(post).map((cat: string) => (
                  <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    #{cat}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
            type="button"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
} 