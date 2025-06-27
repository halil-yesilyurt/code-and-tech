"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
    const userInfo = typeof window !== 'undefined' ? localStorage.getItem('wpUser') : null;
    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('wpUser');
    setUser(null);
  };

  const isAdmin = user && (user.data?.roles?.includes('administrator') || user.user_email === 'admin' || user.roles?.includes('administrator'));
  const adminUrl = WP_API ? `${WP_API.replace(/\/$/, '')}/wp-admin` : '/wp-admin';

  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-200 mb-8 px-2 md:px-0 shadow-sm bg-white/90 backdrop-blur font-inter transition-shadow">
      <div className="flex items-center">
        <span className="font-extrabold text-2xl tracking-tight mr-8 font-montserrat">Code and Tech</span>
        <nav className="hidden md:flex space-x-6 text-[15px] font-semibold text-gray-900 font-inter">
          <Link href="/blog" className="hover:text-blue-700 transition-colors">Blog</Link>
          <Link href="/projects" className="hover:text-blue-700 transition-colors">Projects</Link>
          <Link href="/interviews" className="hover:text-blue-700 transition-colors">Interviews</Link>
          <Link href="/about" className="hover:text-blue-700 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-blue-700 transition-colors">Contact</Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            {isAdmin && (
              <a
                href={adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-blue-700 text-white bg-blue-700 rounded px-4 py-1.5 font-montserrat font-semibold text-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors"
              >
                Go to Admin
              </a>
            )}
            <button
              className="border border-gray-700 rounded px-4 py-1.5 font-montserrat font-semibold text-sm text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              className="border border-gray-700 rounded px-4 py-1.5 font-montserrat font-semibold text-sm text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors"
              onClick={() => { setModalType('login'); setShowModal(true); }}
            >
              Log in
            </button>
            <button
              className="bg-blue-700 text-white rounded px-4 py-1.5 font-montserrat font-semibold text-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors"
              onClick={() => { setModalType('signup'); setShowModal(true); }}
            >
              Create account
            </button>
          </>
        )}
      </div>
      <LoginModal show={showModal} onClose={() => setShowModal(false)} onLoginSuccess={setUser} initialType={modalType} />
    </header>
  );
} 