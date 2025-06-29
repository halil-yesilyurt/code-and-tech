import React from 'react';
import Link from 'next/link';
import { getPosts, formatDate, getAuthorInfo, generateExcerpt } from '@/lib/wordpress';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import { getCategories, getTags } from '@/lib/wordpress';

export default async function PostsPage() {
  // Fetch posts using WordPress API (falls back to sample data if not configured)
  const posts = await getPosts(1, 20);
  const categories = await getCategories();
  const tags = await getTags();
  const popularPosts = posts.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3 space-y-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Blog</h1>
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={{
                  slug: post.slug,
                  title: post.title.rendered,
                  excerpt: post.excerpt?.rendered ? generateExcerpt(post.excerpt.rendered, 120) : generateExcerpt(post.content.rendered, 120),
                  date: formatDate(post.date),
                  author: getAuthorInfo(post)?.name || 'Unknown',
                  image: null,
                  categories: post.categories || [],
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts available</h3>
            <p className="text-gray-600">
              Check back soon for the latest tech articles and tutorials.
            </p>
          </div>
        )}
      </main>
      <aside className="lg:col-span-1">
        <div className="sticky top-8">
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
} 