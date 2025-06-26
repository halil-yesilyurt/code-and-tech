import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-200 mb-8">
      <div className="text-2xl font-bold text-gray-900">
        <Link href="/">Code and Tech</Link>
      </div>
      <nav className="space-x-6 text-gray-700 font-medium">
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        <Link href="/projects" className="hover:text-blue-600">Projects</Link>
        <Link href="/interviews" className="hover:text-blue-600">Interviews</Link>
        <Link href="/about" className="hover:text-blue-600">About</Link>
        <Link href="/contact" className="hover:text-blue-600">Contact</Link>
      </nav>
    </header>
  );
} 