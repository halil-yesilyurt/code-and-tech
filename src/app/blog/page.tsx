import React from 'react';
import Link from 'next/link';
import { getPosts, getCategories, getTags, getPopularPosts, stripHtml } from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import { decodeHtmlEntities } from '@/lib/wordpress';
import BlogPostList from './BlogPostList';
import FeaturedPosts from './FeaturedPosts';

export default async function PostsPage() {
  const posts = await getPosts(1, 20);
  const categories = await getCategories();
  const tags = await getTags();
  const popularPosts = await getPopularPosts(3);

  if (!posts.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts available</h3>
        <p className="text-gray-600">Check back soon for the latest tech articles and tutorials.</p>
      </div>
    );
  }

  // First 3 posts as prominent cards
  const featured = posts.slice(0, 3);
  const rest = posts.slice(3);

  // Helper to get category names from IDs
  function getCategoryNames(post: any) {
    if (!post.categories || !post._embedded || !post._embedded['wp:term'] || !post._embedded['wp:term'][0]) return [];
    return post._embedded['wp:term'][0].map((cat: any) => cat.name);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3 space-y-12">
        {/* Modern Blog Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Blog</h1>
          <p className="text-lg text-slate-600">Insights, tutorials, and the latest in tech—curated for you.</p>
        </header>
        {/* Featured First 3 Articles */}
        <FeaturedPosts posts={featured} />
        {/* Grid of Other Articles with Show More */}
        <section>
          <BlogPostList posts={rest} />
        </section>
      </main>
      <aside className="lg:col-span-1">
        <div className="sticky top-8">
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
} 