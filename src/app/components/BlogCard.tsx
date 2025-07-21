'use client';
import Link from 'next/link';
import { decodeHtmlEntities } from '@/lib/wordpress';
import Image from 'next/image';

export default function BlogCard({ post }: { post: unknown }) {
  const { slug, title, excerpt, date, author, image } = post as any;
  const p = post as { categories?: string[] };
  
  const decodedTitle = decodeHtmlEntities(title);
  const decodedExcerpt = decodeHtmlEntities(excerpt);

  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden card-hover">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden bg-slate-100">
          {image ? (
            <Image 
              src={image} 
              alt={decodedTitle} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              width={192}
              height={256}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Meta Information */}
          <div className="flex items-center text-sm text-slate-500 mb-3">
            {p.categories && (
              <>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {p.categories[0]}
                </span>
                <span className="mx-3">•</span>
              </>
            )}
            <time dateTime={date} className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {date}
            </time>
          </div>

          {/* Title */}
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
            <Link href={`/${slug}`} className="hover:no-underline">
              {decodedTitle}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {decodedExcerpt}
          </p>

          {/* Author and Read More */}
          <div className="flex items-center justify-between">
            {author && (
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                  {author.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700">{author}</span>
              </div>
            )}
            
            <Link 
              href={`/${slug}`}
              className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors duration-200 group-hover:translate-x-1"
            >
              Read Article
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
} 