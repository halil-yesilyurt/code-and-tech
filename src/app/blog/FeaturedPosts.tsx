'use client';
import Link from 'next/link';
import { decodeHtmlEntities, stripHtml } from '@/lib/wordpress';

type Post = {
  id: number;
  title: { rendered: string };
  date: string;
  slug: string;
  excerpt?: { rendered: string };
  content?: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[];
    'wp:term'?: { id: number; slug: string; name: string }[][];
  };
};

export default function FeaturedPosts({ posts }: { posts: Post[] }) {
  return (
    <section className='grid gap-8'>
      {posts.map((post: Post) => (
        <article
          key={post.id}
          style={{ animationDelay: `${post.id * 10}ms` }}
          className='bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex flex-col animate-fade-slide-in hover:scale-[1.015] hover:shadow-2xl transition-transform duration-300'
        >
          <div className='flex items-center text-sm text-slate-500 mb-2'>
            <time dateTime={post.date} className='flex items-center'>
              <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
          <h2 className='text-2xl font-bold text-slate-900 mb-2'>
            <Link href={`/${post.slug}`} className='hover:underline'>
              {decodeHtmlEntities(post.title.rendered)}
            </Link>
          </h2>
          <p className='text-slate-700 mb-4 line-clamp-3'>{stripHtml(post.excerpt?.rendered || post.content?.rendered || '')}</p>
          <div className='flex flex-wrap gap-2 mb-4'>
            {post._embedded &&
              post._embedded['wp:term'] &&
              post._embedded['wp:term'][0] &&
              post._embedded['wp:term'][0].map((cat) => {
                const category = cat as { id: number; slug: string; name: string };
                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200'
                  >
                    #{category.name}
                  </Link>
                );
              })}
          </div>
          <div className='mt-4'>
            <Link
              href={`/${post.slug}`}
              className='inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors duration-200 group'
            >
              Read Article
              <svg
                className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
