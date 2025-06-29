import Link from 'next/link';
import { getAuthorInfo, formatDate, generateExcerpt, getFeaturedImageUrl } from '@/lib/wordpress';

export default function ArticleCard({ post, linkBase = '/' }: { post: any, linkBase?: string }) {
  const author = getAuthorInfo(post);
  const excerpt = post.excerpt?.rendered
    ? generateExcerpt(post.excerpt.rendered, 150)
    : generateExcerpt(post.content.rendered, 150);
  const thumbnail = getFeaturedImageUrl(post, 'medium');

  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden card-hover">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        {thumbnail && (
          <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden">
            <img 
              src={thumbnail} 
              alt={post.title.rendered} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        {/* Content Section */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Meta Information */}
          <div className="flex items-center text-sm text-slate-500 mb-3">
            <time dateTime={post.date} className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(post.date)}
            </time>
          </div>

          {/* Title */}
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
            <Link href={`${linkBase}${post.slug}`} className="hover:no-underline">
              {post.title.rendered}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>

          {/* Tags (now categories) */}
          {post.categories && post._embedded?.['wp:term']?.[0] && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post._embedded['wp:term'][0].slice(0, 3).map((cat: any) => (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.slug}`} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                >
                  #{cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Read More Button */}
          <div className="flex items-center justify-between">
            <Link 
              href={`${linkBase}${post.slug}`}
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
              {Math.max(1, Math.ceil((post.content?.rendered?.length || 0) / 800))} min read
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 