import { useState, useRef, useEffect } from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;

export default function LoginModal({ show, onClose, onLoginSuccess, initialType = 'login' }: { show: boolean; onClose: () => void; onLoginSuccess: (user: any) => void; initialType?: 'login' | 'signup' }) {
  const [modalType, setModalType] = useState<'login' | 'signup'>(initialType);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  useEffect(() => {
    if (show) setModalType(initialType);
  }, [show, initialType]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${WP_API}/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('wpUser', JSON.stringify(data));
        setSuccess('Logged in successfully!');
        onLoginSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${WP_API}/wp/v2/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.id) {
        setSuccess('Account created! You can now log in.');
        setModalType('login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'login') {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  if (!show) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[6px] transition-all">
      <div ref={modalRef} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-2 sm:mx-0 animate-fade-in-up border border-gray-100 flex flex-col items-center px-8 py-10">
        {/* Close button */}
        <button
          aria-label="Close login modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700 rounded-full p-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 text-center">
          Log in to your <span className="text-blue-700">account</span>
        </h2>
        <p className="text-gray-400 text-sm mb-8 text-center">Lorem ipsum dolor sit amet, consectetur</p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          {modalType === 'signup' && (
            <div className="relative">
              <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleInput}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900 font-inter bg-white/90 shadow-sm"
              />
            </div>
          )}
          <div className="relative">
            <UserIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleInput}
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900 font-inter bg-white/90 shadow-sm"
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInput}
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900 font-inter bg-white/90 shadow-sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <input id="remember" type="checkbox" className="mr-2 rounded border-gray-300 focus:ring-blue-700" />
            <label htmlFor="remember" className="text-xs text-gray-500 select-none">Remember me</label>
          </div>
          {error && <div className="text-red-600 text-sm font-inter">{error}</div>}
          {success && <div className="text-green-700 text-sm font-inter">{success}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-cyan-400 text-white font-montserrat font-semibold py-3 rounded-full shadow-lg hover:from-blue-800 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-60 transition-all text-base tracking-widest mt-2"
            disabled={loading}
          >
            {loading ? 'Please wait...' : modalType === 'login' ? 'LOGIN' : 'SIGN UP'}
          </button>
        </form>
        <div className="w-full flex justify-between items-center mt-4 text-xs text-gray-400">
          <span>Forgot password?</span>
          <button type="button" className="text-blue-600 hover:underline font-semibold">Reset password</button>
        </div>
        {/* Bottom nav */}
        <div className="flex justify-between items-center w-full mt-10 border-t pt-4 text-gray-400 text-sm">
          <button
            className={`flex-1 flex flex-col items-center gap-1 ${modalType === 'login' ? 'text-blue-700 font-bold' : ''}`}
            onClick={() => setModalType('login')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mb-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m10.5 0v10.125c0 1.243-1.007 2.25-2.25 2.25H7.5a2.25 2.25 0 01-2.25-2.25V9m13.5 0h-15" />
            </svg>
            Log in
          </button>
          <button
            className={`flex-1 flex flex-col items-center gap-1 ${modalType === 'signup' ? 'text-blue-700 font-bold' : ''}`}
            onClick={() => setModalType('signup')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mb-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v3.75m9 0v6.375c0 1.243-1.007 2.25-2.25 2.25h-6a2.25 2.25 0 01-2.25-2.25V10.5m10.5 0h-12" />
            </svg>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, typeof window !== 'undefined' ? document.body : (globalThis as unknown as Document)?.body || document.createElement('div'));
} 