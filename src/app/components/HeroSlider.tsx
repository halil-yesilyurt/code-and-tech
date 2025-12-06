'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { decodeHtmlEntities, stripHtml, getFeaturedImageUrl, WordPressPost } from '@/lib/wordpress';

interface HeroSliderProps {
  posts: WordPressPost[];
}

export default function HeroSlider({ posts }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [animationKey, setAnimationKey] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || posts.length <= 1) return;

    const interval = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, posts.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
    setAnimationKey(prev => prev + 1); // Force animation restart
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of manual navigation
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    setAnimationKey(prev => prev + 1); // Force animation restart
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % posts.length);
    setAnimationKey(prev => prev + 1); // Force animation restart
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Reset animation key when currentIndex changes (for auto-play)
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentIndex]);

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const featuredImage = getFeaturedImageUrl(currentPost, 'large');
  const excerpt = stripHtml(currentPost.excerpt?.rendered || currentPost.content?.rendered || '').substring(0, 150);

  return (
    <section className='bg-teal-700/20 dark:bg-teal-900/40 p-4 sm:py-8 sm:px-16 md:py-12 rounded-lg my-8 relative overflow-hidden'>  
      {/* Slide Content with Slide and Fade Animation */}
      <div className='relative min-h-[400px] sm:min-h-[350px] md:min-h-[300px]'>
        {posts.map((post, index) => {
          const isActive = index === currentIndex;
          const featuredImage = getFeaturedImageUrl(post, 'large');
          const excerpt = stripHtml(post.excerpt?.rendered || post.content?.rendered || '').substring(0, 150);
          
          // Calculate animation classes based on position and direction
          const getAnimationClass = () => {
            if (!isActive) {
              // Slide out based on direction
              if (direction === 'right') {
                return 'opacity-0 translate-x-full scale-95';
              } else {
                return 'opacity-0 -translate-x-full scale-95';
              }
            }
            // Active slide - slide in from opposite direction
            return 'opacity-100 translate-x-0 scale-100';
          };

          return (
            <div
              key={`${post.id}-${index}`}
              className={`absolute inset-0 flex flex-col md:flex-row items-center gap-8 transition-all duration-700 ease-in-out ${
                isActive ? 'z-10' : 'z-0 pointer-events-none'
              } ${getAnimationClass()}`}
            >
              <div className={`w-full space-y-3 sm:space-y-4 ${isActive ? '' : 'pointer-events-none'}`}>
                <p 
                  key={`date-${animationKey}`}
                  className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 ${isActive ? 'animate-fade-in' : ''}`}
                >
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h1 
                  key={`title-${animationKey}`}
                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 leading-tight line-clamp-3 ${isActive ? 'animate-slide-up' : ''}`}
                >
                  {decodeHtmlEntities(post.title.rendered)}
                </h1>
                <p 
                  key={`excerpt-${animationKey}`}
                  className={`text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none ${isActive ? 'animate-slide-up-delay' : ''}`}
                >
                  {excerpt}...
                </p>
                <Link 
                  key={`link-${animationKey}`}
                  href={`/${post.slug}`}
                  className={`inline-block bg-primary text-gray-900 font-bold py-2 px-6 rounded-md hover:opacity-90 transition-all duration-300 hover:scale-105 ${isActive ? 'animate-slide-up-delay-2' : ''}`}
                >
                  Read Article
                </Link>
              </div>
              {featuredImage && (
                <div 
                  key={`image-${animationKey}`}
                  className={`w-full md:w-1/3 flex justify-center ${isActive ? 'animate-scale-in' : ''}`}
                >
                  <Image
                    alt={decodeHtmlEntities(post.title.rendered)}
                    className='max-w-xs w-full rounded-lg shadow-lg transition-transform duration-700 hover:scale-105'
                    src={featuredImage}
                    width={400}
                    height={300}
                    priority={index === 0}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            aria-label='Previous slide'
          >
            <svg className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            aria-label='Next slide'
          >
            <svg className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {posts.length > 1 && (
        <div className='flex justify-center gap-2 mt-6 relative z-10'>
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
