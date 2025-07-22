import Link from 'next/link';
import { formatDate, generateExcerpt, getFeaturedImageUrl, WordPressPost, calculateReadingTime, decodeHtmlEntities } from '@/lib/wordpress';
import Image from 'next/image';
import SearchResultHighlight from './SearchResultHighlight';

export default function ArticleCard({ 
  post, 
  linkBase = '/', 
  searchQuery = '' 
}: { 
  post: unknown, 
  linkBase?: string,
  searchQuery?: string 
}) {
  const p = post as WordPressPost;

  const excerpt = p.excerpt?.rendered
    ? generateExcerpt(p.excerpt.rendered, 150)
    : generateExcerpt(p.content?.rendered || '', 150);
  const thumbnail = getFeaturedImageUrl(p, 'medium');
  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden card-hover">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        {thumbnail && (
          <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden">
            <Image
              src={thumbnail}
              alt={p.title.rendered}
              width={800}
              height={320}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              priority={false}
            />
          </div>
        )}
        
        {/* Content Section */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Meta Information */}
          <div className="flex items-center text-sm text-slate-500 mb-3">
            <time dateTime={p.date} className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(p.date)}
            </time>
          </div>

          {/* Title */}
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
            <Link href={`${linkBase}${p.slug}`} className="hover:no-underline">
              <SearchResultHighlight 
                text={p.title.rendered} 
                query={searchQuery} 
              />
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
            <SearchResultHighlight 
              text={excerpt} 
              query={searchQuery} 
            />
          </p>

          {/* Tags (now categories) */}
          {p.categories && (p._embedded as any)?.['wp:term']?.[0] && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(p._embedded as any)['wp:term'][0].slice(0, 3).map((cat: { id: number; slug: string; name: string }) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                >
                  #{decodeHtmlEntities(cat.name)}
                </Link>
              ))}
            </div>
          )}

          {/* Read More Button */}
          <div className="flex items-center justify-between">
            <Link 
              href={`${linkBase}${p.slug}`}
              className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors duration-200 group-hover:translate-x-1"
            >
              Read Article
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            {/* Reading Time Estimate */}
            <div className="flex items-center text-xs text-slate-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {calculateReadingTime(p.content?.rendered || '')} min read
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 