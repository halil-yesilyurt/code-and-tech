import React from 'react';
import Link from 'next/link';
import { getPosts, getCategories, getTags, getPopularPosts, stripHtml } from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import { decodeHtmlEntities } from '@/lib/wordpress';
import BlogPostList from './BlogPostList';

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
        <section className="grid gap-8">
          {featured.map((post, i) => (
            <article
              key={post.id}
              style={{ animationDelay: `${i * 80}ms` }}
              className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex flex-col animate-fade-slide-in hover:scale-[1.015] hover:shadow-2xl transition-transform duration-300"
            >
              <div className="flex items-center text-sm text-slate-500 mb-2">
                <time dateTime={post.date} className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {decodeHtmlEntities(post.title.rendered)}
                </Link>
              </h2>
              <p className="text-slate-700 mb-4 line-clamp-3">
                {stripHtml(post.excerpt?.rendered || post.content?.rendered || '')}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {getCategoryNames(post).map((cat: string) => (
                  <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    #{cat}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
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