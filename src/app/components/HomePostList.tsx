'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArticleCover from './ArticleCover';
import {
  decodeHtmlEntities,
  stripHtml,
  type WordPressCategory,
  type WordPressPost,
} from '@/lib/wordpress';

interface HomePostListProps {
  posts: WordPressPost[];
  categories: WordPressCategory[];
}

const INITIAL = 6;
const LOAD_MORE = 6;

function postDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

export default function HomePostList({ posts, categories }: HomePostListProps) {
  const [visible, setVisible] = useState(INITIAL);
  const visiblePosts = posts.slice(0, visible);

  return (
    <>
      <div className="ct-article-grid">
        {visiblePosts.map((post, index) => {
          const category = categories.find((item) => post.categories?.includes(item.id) && item.slug !== 'uncategorized');
          const summary = stripHtml(post.excerpt?.rendered || post.content?.rendered || '').trim();
          const shortSummary = summary.length > 135 ? `${summary.slice(0, 135).trimEnd()}…` : summary;
          return (
            <article className="ct-article-card" key={post.id}>
              <Link className="ct-card-art-link" href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true"><ArticleCover slug={post.slug} title={decodeHtmlEntities(post.title.rendered)} category={category ? decodeHtmlEntities(category.name) : "The Journal"} variant="compact" /></Link>
              <div className="ct-card-topline">
                <span>{category ? decodeHtmlEntities(category.name) : 'Article'}</span>
                <span className="ct-card-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3><Link href={`/blog/${post.slug}`}>{decodeHtmlEntities(post.title.rendered)}</Link></h3>
              {shortSummary && <p>{shortSummary}</p>}
              <div className="ct-card-footer">
                <time dateTime={post.date}>{postDate(post.date)}</time>
                <Link href={`/blog/${post.slug}`} aria-label={`Read ${decodeHtmlEntities(post.title.rendered)}`}>
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {visible < posts.length && (
        <div className="ct-load-more">
          <button type="button" onClick={() => setVisible((count) => Math.min(count + LOAD_MORE, posts.length))}>
            Show more articles <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </>
  );
}
