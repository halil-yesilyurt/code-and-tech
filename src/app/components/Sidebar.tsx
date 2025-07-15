'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { decodeHtmlEntities } from '@/lib/wordpress';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  children?: Category[];
}

interface PopularPost {
  id: number;
  title: { rendered: string };
  slug: string;
  views?: number;
  date: string;
}

// Helper to build category tree
function buildCategoryTree(categories: Category[], parent = 0): Category[] {
  return categories
    .filter(cat => cat.parent === parent)
    .map(cat => ({
      ...cat,
      children: buildCategoryTree(categories, cat.id),
    }));
}

// Recursive render function
function renderCategoriesTree(tree: Category[]): React.ReactNode {
  return (
    <ul className="ml-0">
      {tree.map(cat => (
        <li key={cat.id} className="ml-0">
          <Link 
            href={`/categories/${decodeHtmlEntities(cat.slug)}`} 
            className="flex items-center justify-between p-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
          >
            <span>{decodeHtmlEntities(cat.name)}</span>
            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {cat.children && cat.children.length > 0 && (
            <div className="ml-4 border-l border-slate-200 pl-2">
              {renderCategoriesTree(cat.children)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function shuffleArray(array: any[]) {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Format view count
function formatViewCount(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

export default function Sidebar({ popularPosts, tags, categories }: { popularPosts: PopularPost[]; tags: any[]; categories: any[] }) {
  // Client-side shuffle to avoid hydration errors
  const [shuffled, setShuffled] = useState(categories);
  useEffect(() => {
    const arr = [...categories];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr.slice(0, 10));
  }, [categories]);
  const randomCategories = shuffled;
  
  return (
    <aside className="space-y-6">
      {/* Popular Posts */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
          <h3 className="text-lg font-bold text-slate-900">Popular Posts</h3>
        </div>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/${post.slug}`} 
              className="group block"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-3">
                    {post.title.rendered}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    {post.views !== undefined && (
                      <div className="flex items-center text-xs text-slate-400">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {formatViewCount(post.views)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link 
          href="/blog" 
          className="inline-flex items-center mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          View All Posts
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-slate-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900">Categories</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {randomCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${decodeHtmlEntities(category.slug)}`}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold hover:from-blue-200 hover:to-purple-200 transition-all duration-200 shadow-sm"
            >
              #{decodeHtmlEntities(category.slug)}
            </Link>
          ))}
          <Link href="/categories" className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 ml-2">All Categories</Link>
        </div>
      </div>

      {/* Newsletter Signup (Mailchimp) */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold mb-2">Subscribe to Newsletter</h3>
          <p className="text-blue-100 text-sm mb-4">Get the latest blog posts delivered to your inbox</p>
          <form action="https://gmail.us15.list-manage.com/subscribe/post?u=986c78fd0ebe5113cedbde9ed&amp;id=f69d8b3a8e&amp;f_id=00a69de1f0" method="post" target="_blank" className="flex flex-col gap-2">
            <input type="email" name="EMAIL" required placeholder="Your email address" className="rounded-lg px-3 py-2 text-slate-900 bg-white border-2 border-blue-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-300" />
            <button type="submit" className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200">Subscribe</button>
          </form>
        </div>
      </div>
    </aside>
  );
} 