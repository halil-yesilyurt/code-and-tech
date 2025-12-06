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
  const getTagColor = (index: number) => {
    const colors = [
      'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300',
      'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300',
      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
    ];
    return colors[index % colors.length];
  };

  return (
    <article className="group bg-white dark:bg-gray-800/50 rounded-lg shadow-sm overflow-hidden h-full flex flex-col p-6">
      {/* Meta Information */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
        <time dateTime={p.date} className="flex items-center">
          {formatDate(p.date)}
        </time>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-200">
        <Link href={`${linkBase}${p.slug}`} className="hover:no-underline">
          <SearchResultHighlight 
            text={p.title.rendered} 
            query={searchQuery} 
          />
        </Link>
      </h2>

      {/* Excerpt */}
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
        <SearchResultHighlight 
          text={excerpt} 
          query={searchQuery} 
        />
      </p>

      {/* Tags (now categories) */}
      {p.categories && (p._embedded as any)?.['wp:term']?.[0] && (
        <div className="flex flex-wrap gap-2 text-xs mb-4">
          {(p._embedded as any)['wp:term'][0].slice(0, 3).map((cat: { id: number; slug: string; name: string }, idx: number) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`${getTagColor(idx)} py-1 px-3 rounded-full`}
            >
              #{decodeHtmlEntities(cat.name)}
            </Link>
          ))}
        </div>
      )}

      {/* Read More Button */}
      <div className="mt-auto">
        <Link 
          href={`${linkBase}${p.slug}`}
          className="inline-flex items-center text-primary font-semibold text-sm hover:opacity-80 transition-opacity"
        >
          Read Article
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
} 