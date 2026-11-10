'use client';

import { useState } from 'react';
import EditorialPostGrid from '../blog/EditorialPostGrid';
import type { WordPressPost, WordPressCategory } from '@/lib/wordpress';

export default function InterviewArticlesGrid({
  posts,
  categories,
}: {
  posts: WordPressPost[];
  categories: WordPressCategory[];
}) {
  const [visible, setVisible] = useState(4);
  const hasMore = visible < posts.length;

  return (
    <>
      <EditorialPostGrid posts={posts.slice(0, visible)} categories={categories} />
      {hasMore && (
        <div className="ct-p3-more">
          <button type="button" onClick={() => setVisible((count) => Math.min(count + 4, posts.length))}>
            Show more articles <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </>
  );
}
