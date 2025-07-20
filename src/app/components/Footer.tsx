import Link from 'next/link';
import SocialMediaLinks from './SocialMediaLinks';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-8 items-center md:items-start text-center md:text-left">
          {/* Brand Section */}
          <div className="md:col-span-2 min-w-0 flex flex-col items-center md:items-start">
            <div className="flex flex-wrap items-center space-x-2 mb-4 min-w-0 justify-center md:justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm font-montserrat">CT</span>
              </div>
              <div className="truncate">
                <h3 className="text-lg font-bold font-montserrat bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent truncate">
                  Code & Tech
                </h3>
                <p className="text-xs text-slate-500 truncate">Modern Tech Blog</p>
              </div>
            </div>
            <p className="text-slate-600 mb-6 max-w-md">
              Your go-to destination for the latest insights in technology, development, and innovation. 
              Stay ahead with expert analysis and practical tutorials.
            </p>
            <SocialMediaLinks variant="footer" />
          </div>

          {/* Footer Navigation Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-slate-900 mb-4">Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">Blog</Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">Projects</Link>
              </li>
              <li>
                <Link href="/interviews" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">Interviews</Link>
              </li>

              <li>
                <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-center">
          <p className="text-slate-600 text-sm truncate mb-2 md:mb-0">
            © {new Date().getFullYear()} Code & Tech. All rights reserved.
          </p>
          <div className="flex flex-wrap space-x-6 mt-2 md:mt-0 justify-center md:justify-end">
            <Link href="/privacy-policy" className="text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200 cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200 cursor-pointer">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200 cursor-pointer">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 