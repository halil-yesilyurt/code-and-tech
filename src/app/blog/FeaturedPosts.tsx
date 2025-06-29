'use client';
import Link from 'next/link';
import { decodeHtmlEntities, stripHtml } from '@/lib/wordpress';

export default function FeaturedPosts({ posts }: { posts: any[] }) {
  // Helper to get category names from IDs
  function getCategoryNames(post: any) {
    if (!post.categories || !post._embedded || !post._embedded['wp:term'] || !post._embedded['wp:term'][0]) return [];
    return post._embedded['wp:term'][0].map((cat: any) => cat.name);
  }

  return (
    <section className="grid gap-8">
      {posts.map((post, i) => (
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
  );
} 