import { Suspense } from 'react';
import Link from 'next/link';
import { searchPosts } from '@/lib/wordpress';

export const metadata = {
  title: 'Search | Code & Tech',
  description: 'Search articles, tutorials and projects on Code & Tech.'
};

function getQueryFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {
  if (!searchParams || !searchParams.query) return '';
  if (Array.isArray(searchParams.query)) return searchParams.query[0] || '';
  return searchParams.query;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const query = getQueryFromSearchParams(resolvedSearchParams || {});

  if (!query) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No search query provided</h1>
        <p>Try searching for something using the search bar above.</p>
      </div>
    );
  }

  const results = await searchPosts(query);

  return (
    <div className="max-w-2xl mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">Search Results for: <span className="text-blue-600">{query}</span></h1>
      <Suspense fallback={<div>Loading results...</div>}>
        {results.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-slate-600">
            <p>No results found for <b>{query}</b>.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {results.map(post => (
              <li key={post.id} className="bg-white rounded-xl shadow p-6">
                <Link href={`/${post.slug}`} className="text-xl font-semibold text-blue-700 hover:underline">
                  {post.title.rendered}
                </Link>
                <div className="text-slate-600 mt-2" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              </li>
            ))}
          </ul>
        )}
      </Suspense>
    </div>
  );
} 