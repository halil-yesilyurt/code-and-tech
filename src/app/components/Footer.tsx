import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm font-montserrat">CT</span>
              </div>
              <div>
                <h3 className="text-lg font-bold font-montserrat bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Code & Tech
                </h3>
                <p className="text-xs text-slate-500">Modern Tech Blog</p>
              </div>
            </div>
            <p className="text-slate-600 mb-6 max-w-md">
              Your go-to destination for the latest insights in technology, development, and innovation. 
              Stay ahead with expert analysis and practical tutorials.
            </p>
            <div className="flex space-x-4">
              <a href="https://halilyesilyurt.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </a>
              <a href="https://www.linkedin.com/in/halilyesilyurt/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.601 2.001 3.601 4.601v5.595z"/></svg>
              </a>
              <a href="https://github.com/halil-yesilyurt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="mailto:hi@halilyesilyurt.com" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>

          {/* Footer Navigation Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-blue-600 transition-colors duration-200">Blog</Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-600 hover:text-blue-600 transition-colors duration-200">Projects</Link>
              </li>
              <li>
                <Link href="/interviews" className="text-slate-600 hover:text-blue-600 transition-colors duration-200">Interviews</Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors duration-200">About</Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors duration-200">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Code & Tech. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 