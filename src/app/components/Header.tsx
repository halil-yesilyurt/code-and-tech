"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
    const userInfo = typeof window !== 'undefined' ? localStorage.getItem('wpUser') : null;
    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('wpUser');
    setUser(null);
  };

  const isAdmin = user && (user.data?.roles?.includes('administrator') || user.user_email === 'admin' || user.roles?.includes('administrator'));
  const adminUrl = WP_API ? `${WP_API.replace(/\/$/, '')}/wp-admin` : '/wp-admin';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg font-montserrat">CT</span>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold font-montserrat bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Code & Tech
              </h1>
              <p className="text-xs text-slate-500 font-medium">Modern Tech Blog</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { href: '/blog', label: 'Blog' },
              { href: '/projects', label: 'Projects' },
              { href: '/interviews', label: 'Interviews' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <a
                  href={adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg focus-ring"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Go to Admin
                </a>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 focus-ring"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setModalType('login'); setShowModal(true); }}
                  className="hidden sm:inline-flex items-center px-4 py-2 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-all duration-200 focus-ring"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setModalType('signup'); setShowModal(true); }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg focus-ring"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <LoginModal show={showModal} onClose={() => setShowModal(false)} onLoginSuccess={setUser} initialType={modalType} />
    </header>
  );
} 