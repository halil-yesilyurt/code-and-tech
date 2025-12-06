'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const GitHubIcon = () => (
  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z' />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' d='M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7' />
  </svg>
);

export default function ProjectImage({ project }: { project: unknown }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const { image, title, description, techStack, github, demo, url, isNew } = project as any;

  // Reset loading state when image changes
  useEffect(() => {
    if (image) {
      setImgLoading(true);
      setImgError(false);

      // Force clear loading state after 5 seconds to prevent stuck loading
      const timeout = setTimeout(() => {
        setImgLoading(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [image]);

  // Check if the card will be wrapped in a link
  const isCardLink = url && typeof url === 'string' && url.trim() !== '';

  const CardContent = (
    <>
      {/* Image Container */}
      <div className='relative w-full h-48 sm:h-52 lg:h-56 bg-white dark:bg-gray-800 overflow-hidden'>
        {isNew && (
          <span className='absolute top-3 left-3 bg-primary text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg'>
            NEW
          </span>
        )}

        {image && !imgError ? (
          <>
            {imgLoading && (
              <div className='absolute inset-0 flex items-center justify-center bg-white z-10'>
                <div className='relative'>
                  <div className='w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin'></div>
                  <div className='absolute inset-0 w-8 h-8 border-2 border-transparent border-t-blue-400 rounded-full animate-ping'></div>
                </div>
              </div>
            )}
            <img
              src={image}
              alt={title || 'Project image'}
              className={`w-full h-full scale-125 object-[50%_0%] object-cover transition-all duration-2000 group-hover:object-[50%_100%] project-image ${
                imgLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => {
                setImgLoading(false);
              }}
              onError={() => {
                setImgError(true);
                setImgLoading(false);
              }}
              loading='lazy'
            />
          </>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-slate-400 group-hover:text-slate-500 transition-colors bg-slate-50'>
            <div className='relative mb-3'>
              <svg className='w-12 h-12 sm:w-16 sm:h-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                />
              </svg>
              <div className='absolute -top-1 -right-1 w-4 h-4 bg-slate-300 rounded-full'></div>
            </div>
            <span className='text-xs sm:text-sm font-medium'>No Preview</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 flex flex-col p-5 sm:p-6'>
        <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight'>
          {title}
        </h2>
        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed overflow-hidden'>{description}</p>

        {/* Tech Stack Tags */}
        {techStack && techStack.length > 0 && (
          <div className='flex flex-wrap gap-1.5 sm:gap-2 mb-5'>
            {techStack.map((tag: string) => (
              <span
                key={tag}
                className='inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className='mt-auto space-y-2 sm:space-y-0 sm:flex sm:gap-3'>
          {github && (
            isCardLink ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(github, '_blank', 'noopener,noreferrer');
                }}
                className='flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm group/btn'
              >
                <GitHubIcon />
                <span className='ml-2'>Code</span>
              </button>
            ) : (
              <a
                href={github}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm group/btn'
              >
                <GitHubIcon />
                <span className='ml-2'>Code</span>
              </a>
            )
          )}
          {demo && (
            isCardLink ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(demo, '_blank', 'noopener,noreferrer');
                }}
                className='flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-md bg-primary text-gray-900 font-medium text-sm hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md group/btn'
              >
                <ExternalLinkIcon />
                <span className='ml-2'>Demo</span>
              </button>
            ) : (
              <a
                href={demo}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-md bg-primary text-gray-900 font-medium text-sm hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md group/btn'
              >
                <ExternalLinkIcon />
                <span className='ml-2'>Demo</span>
              </a>
            )
          )}
        </div>
      </div>
    </>
  );

  // If url exists, wrap the entire card in a link
  // Check if it's an external URL (starts with http:// or https://)
  const isExternalUrl = url && (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://')));
  
  if (url && typeof url === 'string' && url.trim() !== '') {
    if (isExternalUrl) {
      return (
        <a 
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='group bg-white dark:bg-gray-800/50 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-slide-in cursor-pointer no-underline'
        >
          {CardContent}
        </a>
      );
    } else {
      return (
        <Link 
          href={url}
          className='group bg-white dark:bg-gray-800/50 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-slide-in cursor-pointer no-underline'
        >
          {CardContent}
        </Link>
      );
    }
  }

  // Otherwise, render as a regular div
  return (
    <div className='group bg-white dark:bg-gray-800/50 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-slide-in'>
      {CardContent}
    </div>
  );
}
