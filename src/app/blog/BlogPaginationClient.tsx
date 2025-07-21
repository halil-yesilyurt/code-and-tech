"use client";
import { useRouter } from 'next/navigation';
import BlogPostList from './BlogPostList';

export default function BlogPaginationClient({ posts, currentPage, totalPages }: { posts: any[], currentPage: number, totalPages: number }) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    router.push(url.pathname + url.search);
  };

  return (
    <BlogPostList
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
} 