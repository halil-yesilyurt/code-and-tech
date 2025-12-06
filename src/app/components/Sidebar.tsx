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

// Newsletter Form Component
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "success" | "error" | "loading">(null);
  const [message, setMessage] = useState("");
  // Mailchimp endpoint and params
  const MC_URL = "https://gmail.us15.list-manage.com/subscribe/post?u=986c78fd0ebe5113cedbde9ed&id=f69d8b3a8e&f_id=00a69de1f0";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    // Mailchimp expects form-encoded data
    const formData = new URLSearchParams();
    formData.append("EMAIL", email);
    try {
      await fetch(MC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        mode: "no-cors", // Mailchimp does not return CORS headers
      });
      setStatus("success");
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("There was an error. Please try again later.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        name="EMAIL"
        required
        placeholder="Your email address"
        className="rounded-md px-3 py-2 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={status === "loading" || status === "success"}
      />
      <button
        type="submit"
        className="w-full bg-primary text-gray-900 font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
        disabled={status === "loading" || status === "success"}
      >
        {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed" : "Subscribe"}
      </button>
      {message && (
        <div className={`text-sm mt-2 ${status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{message}</div>
      )}
    </form>
  );
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
      {/* Random Posts */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Random Posts</h2>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/${post.slug}`} 
              className="flex items-center p-3 border border-teal-500/50 rounded-lg hover:bg-teal-500/10 dark:hover:bg-teal-500/20 transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 bg-primary text-gray-900 font-bold rounded-full mr-4 flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {decodeHtmlEntities(post.title.rendered)}
              </span>
            </Link>
          ))}
        </div>
        <Link 
          href="/blog" 
          className="w-full mt-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block text-center"
        >
          View All Posts
        </Link>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {randomCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${decodeHtmlEntities(category.slug)}`}
              className="bg-teal-100 dark:bg-teal-900/80 text-teal-800 dark:text-teal-200 py-1.5 px-4 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            >
              #{decodeHtmlEntities(category.slug)}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup (Mailchimp) - Keep existing functionality */}
      <div className="bg-teal-700/20 dark:bg-teal-900/40 rounded-lg p-6">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Subscribe to Newsletter</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Get the latest blog posts delivered to your inbox</p>
          <NewsletterForm />
        </div>
      </div>
    </aside>
  );
} 