'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function SearchPagination({ currentPage, totalPages }: SearchPaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/search?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      // Adjust if we're near the edges
      if (currentPage <= 3) {
        end = Math.min(totalPages, maxVisible);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center">
      <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Pagination">
        {/* Previous Button */}
        <Link
          href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
          className={`relative inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage > 1
              ? 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              : 'text-slate-400 bg-white border border-slate-200 cursor-not-allowed'
          }`}
          onClick={(e) => {
            if (currentPage <= 1) e.preventDefault();
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="sr-only">Previous</span>
        </Link>

        {/* First Page */}
        {pageNumbers[0] > 1 && (
          <>
            <Link
              href={createPageUrl(1)}
              className="relative inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              1
            </Link>
            {pageNumbers[0] > 2 && (
              <span className="relative inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-slate-500">
                ...
              </span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={`relative inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700'
                : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {page}
          </Link>
        ))}

        {/* Last Page */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="relative inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-slate-500">
                ...
              </span>
            )}
            <Link
              href={createPageUrl(totalPages)}
              className="relative inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Next Button */}
        <Link
          href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
          className={`relative inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage < totalPages
              ? 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              : 'text-slate-400 bg-white border border-slate-200 cursor-not-allowed'
          }`}
          onClick={(e) => {
            if (currentPage >= totalPages) e.preventDefault();
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="sr-only">Next</span>
        </Link>
      </nav>
    </div>
  );
} 