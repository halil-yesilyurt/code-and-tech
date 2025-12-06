import React from 'react';
export const metadata = {
  title: 'Blog | Code & Tech',
  description: 'Latest articles, insights and tutorials on software development, AI, cloud and more at Code & Tech.'
};
import { getPosts, getCategories, getTags, getPopularPosts, decodeHtmlEntities } from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import BlogPostList from './BlogPostList';
// FeaturedPosts removed
import BlogPagination from '../components/BlogPagination';

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] }> }) {
  const params = await searchParams;
  const currentPage = parseInt(Array.isArray(params?.page) ? params.page[0] : (params?.page ?? '1'), 10) || 1;
  const perPage = 6;

  const allPosts = await getPosts(1, 100);
  const categories = await getCategories();

  // Identify category IDs whose name contains "interview"
  const interviewCategoryIds = categories
    .filter((cat) => decodeHtmlEntities(cat.name).toLowerCase().includes('interview'))
    .map((cat) => cat.id);

  // Filter out posts that belong to any interview category
  const filteredPosts = allPosts.filter(
    (post) => !post.categories?.some((cid) => interviewCategoryIds.includes(cid))
  );

  const totalPages = Math.ceil(filteredPosts.length / perPage);

  const start = (currentPage - 1) * perPage;
  const pagePosts = filteredPosts.slice(start, start + perPage);

  const tags = await getTags();
  const popularPosts = await getPopularPosts(3);

  if (!filteredPosts.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts available</h3>
        <p className="text-gray-600">Check back soon for the latest tech articles and tutorials.</p>
      </div>
    );
  }

  // Featured only on first page, already defined above

  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-10">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Latest Articles</h2>
        <BlogPostList posts={pagePosts} />
        <div className="mt-10">
          <BlogPagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
      <aside>
        <div className="sticky top-8">
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </main>
  );
} 