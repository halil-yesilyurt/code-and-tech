'use client';

// no useState needed after pagination refactor
import Link from 'next/link';
import { decodeHtmlEntities, stripHtml, calculateReadingTime } from '@/lib/wordpress';
import Image from 'next/image';

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

export default function BlogPostList({ posts }: { posts: Post[] }) {
  const getTagColor = (index: number) => {
    const colors = [
      'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300',
      'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300',
      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {posts.map((post: Post, i) => (
          <article
            key={post.id}
            className='bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm'
          >
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
              <Link href={`/${post.slug}`} className='hover:text-primary transition-colors'>
                {decodeHtmlEntities(post.title.rendered)}
              </Link>
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed'>
              {stripHtml(post.excerpt?.rendered || post.content?.rendered || '').substring(0, 150)}...
            </p>
            <div className='flex flex-wrap gap-2 text-xs'>
              {post._embedded?.['wp:term']?.[0]?.slice(0, 3).map((cat, idx) => {
                const category = cat as { id: number; slug: string; name: string };
                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className={`${getTagColor(idx)} py-1 px-3 rounded-full`}
                  >
                    #{decodeHtmlEntities(category.name)}
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
