import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 text-center">
      <img src="/ct-logo.svg" alt="Code & Tech Logo" className="w-24 h-24 md:w-32 md:h-32" />
      <h1 className="mt-4 text-4xl md:text-5xl font-geist font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        404 • Page Not Found
      </h1>
      <p className="mt-4 text-slate-600 max-w-md text-sm md:text-base">
        Sorry, we couldn&apos;t find that page. It may have been moved or deleted.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
      >
        Take Me Home
      </Link>
    </div>
  );
} 