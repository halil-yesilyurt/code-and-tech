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
          <nav className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-[110] flex flex-col animate-fade-slide-in transform transition-transform duration-300">
            <button
              className="self-end m-4 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              type="button"
            >
              <svg className="w-7 h-7 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="block px-4 py-3 rounded-lg text-lg font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-ring cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Search Link in Mobile Menu */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-500 mb-4 px-4">Search</h4>
                <Link
                  href="/search"
                  className="block px-4 py-3 rounded-lg text-lg font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-ring cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Articles
                  </div>
                </Link>
              </div>
            </div>
          </nav>
        </>,
        document.body
      )
    : null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group min-w-0">
            <img src="/ct-logo.svg" alt="CT Logo" className="w-14 h-14 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300" />
            <div className="truncate">
              <h1 className="text-xl lg:text-2xl font-bold font-montserrat bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent truncate">
                Code & Tech
              </h1>
              <p className="text-xs text-slate-500 font-medium truncate">Modern Tech Blog</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { href: '/blog', label: 'Blog' },
              { href: '/projects', label: 'Projects' },
              { href: '/interviews', label: 'Interviews' },
              { href: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-ring cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
            {/* Search Icon */}
            <div className="ml-4 pl-4 border-l border-slate-200">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                aria-label="Search"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition cursor-pointer z-[120]"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            type="button"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                    placeholder="Search articles..."
                    className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-3 text-slate-600 hover:text-slate-800 transition-colors duration-200"
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