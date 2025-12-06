'use client';
import Link from 'next/link';
import { decodeHtmlEntities } from '@/lib/wordpress';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg 
                className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-primary font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {decodeHtmlEntities(item.label)}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-full whitespace-normal">
                {decodeHtmlEntities(item.label)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 