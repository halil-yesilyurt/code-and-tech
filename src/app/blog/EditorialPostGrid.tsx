import Link from 'next/link';
import {
  decodeHtmlEntities,
  stripHtml,
  calculateReadingTime,
  type WordPressCategory,
  type WordPressPost,
} from '@/lib/wordpress';

interface EditorialPostGridProps {
  posts: WordPressPost[];
  categories: WordPressCategory[];
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export default function EditorialPostGrid({ posts, categories }: EditorialPostGridProps) {
  return (
    <div className="ct-blog-grid">
      {posts.map((post, index) => {
        const category = categories.find((item) => post.categories?.includes(item.id) && item.slug !== 'uncategorized');
        const summary = stripHtml(post.excerpt?.rendered || post.content?.rendered || '').trim();
        const abstract = summary.length > 156 ? `${summary.slice(0, 156).trimEnd()}…` : summary;
        return (
          <article key={post.id} className="ct-blog-card">
            <div className="ct-blog-card-meta">
              {category ? (
                <Link href={`/category/${category.slug}`} className="ct-blog-card-category">
                  {decodeHtmlEntities(category.name)}
                </Link>
              ) : <span>Article</span>}
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="ct-blog-card-content">
              <h2><Link href={`/blog/${post.slug}`}>{decodeHtmlEntities(post.title.rendered)}</Link></h2>
              {abstract && <p>{abstract}</p>}
            </div>
            <div className="ct-blog-card-bottom">
              <span><time dateTime={post.date}>{formatDate(post.date)}</time> <span aria-hidden="true">·</span> {calculateReadingTime(post.content.rendered)} min</span>
              <Link href={`/blog/${post.slug}`} aria-label={`Read ${decodeHtmlEntities(post.title.rendered)}`}><span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
