'use client';

import { useState } from 'react';
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

export default function BlogPostList({ posts, currentPage, totalPages, onPageChange }: { posts: Post[], currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
  return (
    <>
      <div className='grid md:grid-cols-2 gap-8'>
        {posts.map((post: Post) => (
          <article
            key={post.id}
            style={{
              animationDelay: `${post.id * 20}ms`,
            }}
            className='group bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden card-hover flex flex-col transition-shadow
              animate-fade-slide-in
              hover:scale-[1.025] hover:shadow-2xl duration-300'
          >
            {post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url && (
              <Image
                src={post._embedded['wp:featuredmedia'][0].source_url}
                alt={post.title.rendered}
                width={800}
                height={320}
                className='w-full h-48 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105'
                priority={false}
              />
            )}
            <div className='flex-1 p-6 flex flex-col'>
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
                <span className='mx-2'>•</span>
                <span className='flex items-center'>
                  <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  {calculateReadingTime(post.content?.rendered || '')} min read
                </span>
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200'>
                <Link href={`/${post.slug}`} className='hover:underline'>
                  {decodeHtmlEntities(post.title.rendered)}
                </Link>
              </h3>
              <p className='text-slate-600 mb-3 line-clamp-3'>{stripHtml(post.excerpt?.rendered || post.content?.rendered || '')}</p>
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
              <div className='mt-2'>
                <Link
                  href={`/${post.slug}`}
                  className='inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors duration-200 group'
                >
                  Read Article
                  <svg
                    className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className='flex justify-center mt-8 gap-4'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className='px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          type='button'
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className='px-4 py-2 text-slate-600 font-medium'>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className='px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          type='button'
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}
