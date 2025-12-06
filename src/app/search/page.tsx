import { Suspense } from 'react';
import { searchPosts, getCategories, getTags, getPosts } from '@/lib/wordpress';
import SearchBarWithAutocomplete from '../components/SearchBarWithAutocomplete';
import ArticleCard from '../components/ArticleCard';
import Sidebar from '../components/Sidebar';
import SearchFilters from '../components/SearchFilters';
import SearchPagination from '../components/SearchPagination';

export const metadata = {
  title: 'Search | Code & Tech',
  description: 'Search articles, tutorials and projects on Code & Tech.'
};

function getQueryFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {
  if (!searchParams || !searchParams.query) return '';
  if (Array.isArray(searchParams.query)) return searchParams.query[0] || '';
  return searchParams.query;
}

function getFiltersFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;
  const tag = Array.isArray(searchParams.tag) ? searchParams.tag[0] : searchParams.tag;
  const date = Array.isArray(searchParams.date) ? searchParams.date[0] : searchParams.date;
  const page = parseInt(Array.isArray(searchParams.page) ? searchParams.page[0] || '1' : searchParams.page || '1');
  
  return { category, tag, date, page };
}

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedSearchParams = await searchParams;
  const query = getQueryFromSearchParams(resolvedSearchParams || {});
  const filters = getFiltersFromSearchParams(resolvedSearchParams || {});
  
  // Fetch data for filters and sidebar
  const [categories, tags, allPosts] = await Promise.all([
    getCategories(),
    getTags(),
    getPosts(1, 100) // For popular posts in sidebar
  ]);

  if (!query) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Search Articles & Tutorials
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Find the latest insights in technology, development, and innovation
            </p>
            <div className="max-w-2xl mx-auto mb-12">
              <SearchBarWithAutocomplete />
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Full-Text Search</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">Search across titles, content, and excerpts</p>
              </div>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Smart Filters</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">Filter by category, tags, and date</p>
              </div>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Fast Results</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">Get instant search results with pagination</p>
              </div>
            </div>
          </div>
        </main>
        <aside className="lg:col-span-1">
          <div className="sticky top-8">
            <Sidebar popularPosts={allPosts.slice(0, 3)} tags={tags} categories={categories} />
          </div>
        </aside>
      </div>
    );
  }

  // Perform search with filters
  const results = await searchPosts(query, filters.page, 6);
  
  // Apply additional filters if specified
  let filteredResults = results;
  if (filters.category) {
    const category = categories.find(cat => cat.slug === filters.category);
    if (category) {
      filteredResults = filteredResults.filter(post => 
        post.categories && post.categories.includes(category.id)
      );
    }
  }
  
  if (filters.tag) {
    const tag = tags.find(t => t.slug === filters.tag);
    if (tag) {
      filteredResults = filteredResults.filter(post => 
        post.tags && post.tags.includes(tag.id)
      );
    }
  }

  const totalResults = filteredResults.length;
  const resultsPerPage = 6;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const currentPage = filters.page;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Search Results
              </h1>
              <p className="text-slate-600 dark:text-gray-400">
                {totalResults} result{totalResults !== 1 ? 's' : ''} for{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">&quot;{query}&quot;</span>
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <SearchBarWithAutocomplete initialQuery={query} />
            </div>
          </div>
          
          {/* Search Filters */}
          <SearchFilters 
            query={query}
            categories={categories}
            tags={tags}
            currentFilters={filters}
          />
        </div>

        {/* Search Results */}
        <Suspense fallback={
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        }>
          {filteredResults.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-600 dark:text-gray-400 mb-6">
                We couldn&apos;t find any articles matching <span className="font-semibold">&quot;{query}&quot;</span>
              </p>
              <div className="space-y-3">
                <p className="text-sm text-slate-500 dark:text-gray-500">Try:</p>
                <ul className="text-sm text-slate-600 dark:text-gray-400 space-y-1">
                  <li>• Using different keywords</li>
                  <li>• Checking your spelling</li>
                  <li>• Using more general terms</li>
                  <li>• Removing filters</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {filteredResults.map(post => (
                  <ArticleCard 
                    key={post.id} 
                    post={post} 
                    linkBase="/" 
                    searchQuery={query}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <SearchPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </>
          )}
        </Suspense>
      </main>
      
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="sticky top-8">
          <Sidebar popularPosts={allPosts.slice(0, 3)} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
} 