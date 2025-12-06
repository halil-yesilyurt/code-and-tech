import React from 'react';
export const metadata = {
  title: 'Interviews | Code & Tech',
  description: 'Interview tips, experiences, guides and more at Code & Tech.'
};
import { getPosts, getCategories, getTags, getPopularPosts, decodeHtmlEntities } from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import InterviewArticlesGrid from '../components/InterviewArticlesGrid';

export default async function InterviewsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] }> }) {
  const params = await searchParams;
  const currentPage = parseInt(Array.isArray(params?.page) ? params.page[0] : (params?.page ?? '1'), 10) || 1;
  // No server-side pagination; client-side load more.

  // Fetch all needed data in parallel
  const [allPosts, categories, tags, popularPosts] = await Promise.all([
    getPosts(1, 100),
    getCategories(),
    getTags(),
    getPopularPosts(3)
  ]);

  // Find category IDs that include "interview" in their name (case-insensitive)
  const interviewCategoryIds = categories
    .filter((cat) => decodeHtmlEntities(cat.name).toLowerCase().includes('interview'))
    .map((cat) => cat.id);

  // Keep only posts that belong to at least one interview category ID
  const interviewPosts = allPosts.filter((post) =>
    post.categories?.some((cid) => interviewCategoryIds.includes(cid))
  );

  if (!interviewPosts.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Interviews</h1>
        <p className="text-slate-600 mb-6">No interview-related posts found at the moment. Check back soon!</p>
      </div>
    );
  }

  // Featured section removed to avoid duplicates. Use full list client-side.

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3 space-y-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Interviews</h1>
          <p className="text-lg text-slate-600">Insights, preparation tips, and real-world experiences to help you ace your tech interviews.</p>
        </header>

        <InterviewArticlesGrid posts={interviewPosts} />
      </main>

      <aside className="lg:col-span-1">
        <div className="sticky top-8 space-y-8">
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
} 