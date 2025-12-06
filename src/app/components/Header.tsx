"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Portal for mobile menu
  const mobileMenuPortal = typeof window !== 'undefined' && mobileMenuOpen
    ? ReactDOM.createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-800 shadow-2xl z-[110] flex flex-col animate-fade-slide-in transform transition-transform duration-300">
            <button
              className="self-end m-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              type="button"
            >
              <svg className="w-7 h-7 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col py-4 px-6 space-y-2 flex-1 justify-center">
              {[
                { href: '/blog', label: 'Blog' },
                { href: '/projects', label: 'Projects' },
                { href: '/interviews', label: 'Interviews' },
                { href: '/contact', label: 'Contact' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 rounded-lg text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-200 focus-ring cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Search Button in Mobile Menu for small screens */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="min-[400px]:hidden block px-4 py-3 rounded-lg text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-200 focus-ring cursor-pointer text-left"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  Search
                  </div>
              </button>
            </div>
          </nav>
        </>,
        document.body
      )
    : null;

  return (
    <header className="sticky top-0 z-50 bg-[#F3F4F6] dark:bg-[#0A202C] transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group min-w-0">
            <span className="material-icons text-primary text-4xl" aria-hidden="true">code</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white font-montserrat">Code & Tech Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-gray-700 dark:text-gray-300">
            {[
              { href: '/blog', label: 'Blog' },
              { href: '/projects', label: 'Projects' },
              { href: '/interviews', label: 'Interviews' },
              { href: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Icon - Hidden on very small screens, shown in hamburger menu */}
          <div className="hidden min-[400px]:flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              aria-label="Search"
              title="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer z-[120]"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            type="button"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Search Input */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50">
            <div className="container mx-auto px-4 md:px-8 py-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/search?query=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex items-center space-x-3"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, tutorials, and insights..."
                    className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-200 outline-none"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-gray-900 font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      {mobileMenuPortal}
    </header>
  );
} 