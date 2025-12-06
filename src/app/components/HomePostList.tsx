'use client';
import { useState } from 'react';
import BlogPostList from '../blog/BlogPostList';

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

interface HomePostListProps {
  posts: Post[];
}

export default function HomePostList({ posts }: HomePostListProps) {
  const INITIAL = 6;
  const LOAD_MORE = 6;
  const [visible, setVisible] = useState(INITIAL);
  
  const handleShowMore = () => {
    setVisible((v) => Math.min(v + LOAD_MORE, posts.length));
  };
  
  const visiblePosts: Post[] = posts.slice(0, visible);
  const hasMore = visible < posts.length;

  return (
    <>
      <BlogPostList posts={visiblePosts} />
      {hasMore && (
        <div className='text-center mt-10'>
          <button
            onClick={handleShowMore}
            className='bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block'
            type='button'
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
}
