import Header from './Header';
import Footer from './Footer';

const placeholderPosts = [
  { id: 1, slug: 'sample-post', title: { rendered: 'Sample Post' } },
];
const placeholderTags = [
  { id: 1, slug: 'react', name: 'React' },
  { id: 2, slug: 'nextjs', name: 'Next.js' },
];
const placeholderCategories = [
  { id: 1, slug: 'web-dev', name: 'Web Dev' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {children}
      </div>
      <Footer />
    </div>
  );
} 