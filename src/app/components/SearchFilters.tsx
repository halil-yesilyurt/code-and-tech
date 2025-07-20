'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface SearchFiltersProps {
  query: string;
  categories: Category[];
  tags: Tag[];
  currentFilters: {
    category?: string;
    tag?: string;
    date?: string;
    page?: number;
  };
}

export default function SearchFilters({ query, categories, tags, currentFilters }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    params.set('query', query);
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  };

  const hasActiveFilters = currentFilters.category || currentFilters.tag || currentFilters.date;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {isExpanded ? 'Hide' : 'Show'} filters
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {currentFilters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Category: {categories.find(c => c.slug === currentFilters.category)?.name}
              <button
                onClick={() => updateFilters({ category: undefined })}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {currentFilters.tag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Tag: {tags.find(t => t.slug === currentFilters.tag)?.name}
              <button
                onClick={() => updateFilters({ tag: undefined })}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          {currentFilters.date && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Date: {currentFilters.date}
              <button
                onClick={() => updateFilters({ date: undefined })}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <select
              value={currentFilters.category || ''}
              onChange={(e) => updateFilters({ category: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tag
            </label>
            <select
              value={currentFilters.tag || ''}
              onChange={(e) => updateFilters({ tag: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Tags</option>
              {tags.slice(0, 20).map((tag) => (
                <option key={tag.id} value={tag.slug}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date Range
            </label>
            <select
              value={currentFilters.date || ''}
              onChange={(e) => updateFilters({ date: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
} 