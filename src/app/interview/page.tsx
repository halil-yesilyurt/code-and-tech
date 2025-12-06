import React from 'react';
export const metadata = {
  title: 'Interview | Code & Tech',
  description: 'Interview tips, experiences, and guides at Code & Tech.'
};
import { getPosts, getCategories, getTags, getPopularPosts, decodeHtmlEntities } from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import BlogPostList from '../blog/BlogPostList';
import BlogPagination from '../components/BlogPagination';

export default async function InterviewPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] }> }) {
  const params = await searchParams;
  const currentPage = parseInt(Array.isArray(params?.page) ? params.page[0] : (params?.page ?? '1'), 10) || 1;
  const perPage = 6;

  // Fetch data
  const [allPosts, categories, tags, popularPosts] = await Promise.all([
    getPosts(1, 100),
    getCategories(),
    getTags(),
    getPopularPosts(3)
  ]);

  // Identify category IDs with name containing "interview"
  const interviewCategoryIds = categories
    .filter((cat) => decodeHtmlEntities(cat.name).toLowerCase().includes('interview'))
    .map((cat) => cat.id);

  // Include only posts that belong to interview category
  const interviewPosts = allPosts.filter((post) =>
    post.categories?.some((cid) => interviewCategoryIds.includes(cid))
  );

  if (!interviewPosts.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No interview posts available</h3>
        <p className="text-gray-600">Check back soon for interview tips and experiences.</p>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(interviewPosts.length / perPage);
  const start = (currentPage - 1) * perPage;
  const pagePosts = interviewPosts.slice(start, start + perPage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3 space-y-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white  mb-3 tracking-tight">Interview</h1>
          <p className="text-lg text-slate-600">All posts related to interview preparation, experiences, and tips.</p>
        </header>

        <BlogPostList posts={pagePosts} />
        <BlogPagination currentPage={currentPage} totalPages={totalPages} />
      </main>
      <aside className="lg:col-span-1">
        <div className="sticky top-8">
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
} 