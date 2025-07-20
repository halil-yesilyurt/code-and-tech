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
                className="w-4 h-4 mx-2 text-slate-400" 
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
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                {decodeHtmlEntities(item.label)}
              </Link>
            ) : (
              <span className="text-slate-600 font-medium">
                {decodeHtmlEntities(item.label)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 