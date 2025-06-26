import Link from 'next/link';
import { getAuthorInfo, formatDate, generateExcerpt, getFeaturedImageUrl } from '@/lib/wordpress';

export default function ArticleCard({ post, linkBase = '/' }: { post: any, linkBase?: string }) {
  const author = getAuthorInfo(post);
  const excerpt = post.excerpt?.rendered
    ? generateExcerpt(post.excerpt.rendered, 120)
    : generateExcerpt(post.content.rendered, 120);
  const thumbnail = getFeaturedImageUrl(post, 'medium');

  return (
    <article className="flex items-start gap-4 bg-white rounded-lg shadow mb-6 p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex-1">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          {author && <span>{author.name}</span>}
          <span className="mx-2">•</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          <Link href={`${linkBase}${post.slug}`} className="hover:text-blue-600 transition-colors duration-200">
            {post.title.rendered}
          </Link>
        </h2>
        <p className="text-gray-600 mb-2">{excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-1">
          {post.tags && post.tags.length > 0 && post._embedded?.['wp:term']?.[1]?.map((tag: any) => (
            <span key={tag.id} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      {thumbnail && (
        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <img src={thumbnail} alt={post.title.rendered} className="object-cover w-full h-full" />
        </div>
      )}
    </article>
  );
} 