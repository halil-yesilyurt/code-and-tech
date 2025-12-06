import Link from 'next/link';
import SocialMediaLinks from './SocialMediaLinks';

export default function Footer() {
  return (
    <footer className="text-center py-10 border-t border-gray-200 dark:border-gray-800 mt-12 bg-[#F3F4F6] dark:bg-[#0A202C]">
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex justify-center space-x-6 mb-6 text-gray-600 dark:text-gray-400">
          <Link href="/blog" className="hover:text-primary transition-colors cursor-pointer">Blog</Link>
          <Link href="/projects" className="hover:text-primary transition-colors cursor-pointer">Projects</Link>
          <Link href="/interviews" className="hover:text-primary transition-colors cursor-pointer">Interviews</Link>
          <Link href="/contact" className="hover:text-primary transition-colors cursor-pointer">Contact</Link>
        </nav>
        <div className="flex justify-center space-x-6 mb-6 text-gray-500 dark:text-gray-400">
          <SocialMediaLinks variant="footer" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Code & Tech Blog. All rights reserved.</p>
      </div>
    </footer>
  );
} 