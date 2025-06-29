import React from 'react';
import Link from 'next/link';
import { getPosts, getCategories, getTags } from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import { decodeHtmlEntities } from '@/lib/wordpress';

export default async function PostsPage() {
  const posts = await getPosts(1, 20);
  const categories = await getCategories();
  const tags = await getTags();
  const popularPosts = posts.slice(0, 3);

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

  const latest = posts[0];
  const rest = posts.slice(1);

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
        {/* Featured Latest Article */}
        <section className="bg-gradient-to-br from-blue-100/60 to-purple-100/60 rounded-3xl shadow-lg p-0 md:p-0 flex flex-col md:flex-row gap-8 items-center mb-8 overflow-hidden">
          {latest._embedded && latest._embedded['wp:featuredmedia'] && latest._embedded['wp:featuredmedia'][0]?.source_url && (
            <img
              src={latest._embedded['wp:featuredmedia'][0].source_url}
              alt={latest.title.rendered}
              className="w-full md:w-1/2 h-64 object-cover md:rounded-l-3xl md:rounded-r-none rounded-t-3xl md:h-full"
            />
          )}
          <div className="flex-1 p-8 md:p-12">
            <div className="flex items-center text-sm text-slate-500 mb-2">
              <time dateTime={latest.date} className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(latest.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              <Link href={`/blog/${latest.slug}`} className="hover:underline">
                {decodeHtmlEntities(latest.title.rendered)}
              </Link>
            </h2>
            <p className="text-slate-700 mb-4 line-clamp-3 text-lg">
              {decodeHtmlEntities(latest.excerpt?.rendered || latest.content?.rendered || '')}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {getCategoryNames(latest).map((cat: string) => (
                <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  #{cat}
                </span>
              ))}
            </div>
            <Link href={`/blog/${latest.slug}`} className="inline-block mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md">Read Article</Link>
          </div>
        </section>
        {/* Grid of Other Articles */}
        <section>
          <div className="grid md:grid-cols-2 gap-8">
            {rest.map((post) => (
              <article key={post.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 overflow-hidden card-hover flex flex-col transition-shadow duration-200">
                {post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url && (
                  <img
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={post.title.rendered}
                    className="w-full h-48 object-cover rounded-t-2xl"
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
                    {decodeHtmlEntities(post.excerpt?.rendered || post.content?.rendered || '')}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getCategoryNames(post).map((cat: string) => (
                      <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        #{cat}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="mt-auto inline-block px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">Read Article</Link>
                </div>
              </article>
            ))}
          </div>
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