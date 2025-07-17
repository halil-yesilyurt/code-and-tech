"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg font-montserrat">CT</span>
            </div>
            <div className="truncate">
              <h1 className="text-xl lg:text-2xl font-bold font-montserrat bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent truncate">
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
      </div>
      {mobileMenuPortal}
    </header>
  );
} 