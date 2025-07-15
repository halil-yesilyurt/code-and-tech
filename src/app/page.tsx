import { getPosts, getTags, getCategories, getPopularPosts } from '@/lib/wordpress';
import { getTotalViews } from '@/lib/viewStorage';
import SearchBar from './components/SearchBar';
import Link from 'next/link';
import Sidebar from './components/Sidebar';
import LatestArticlesList from './components/LatestArticlesList';
import BlogPostList from './blog/BlogPostList';
import FeaturedPosts from './blog/FeaturedPosts';
import AnimatedCounter from './components/AnimatedCounter';

export default async function Home() {
  // Fetch posts using WordPress API (falls back to sample data if not configured)
  const posts = await getPosts(1, 20);
  const tags = await getTags();
  const categories = await getCategories();
  const popularPosts = await getPopularPosts(3); // Get actual popular posts by views
  const recommendedTags = tags.slice(0, 6);
  const totalViews = getTotalViews();

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          <main className='lg:col-span-3 space-y-8'>
            {/* Hero Section */}
            <section className='text-center py-10 sm:py-16 lg:py-24'>
              <div className='max-w-4xl mx-auto px-2 sm:px-4 lg:px-8'>
                <div className='mb-8'>
                  <h1 className='text-3xl sm:text-4xl lg:text-6xl font-bold font-montserrat mb-4 sm:mb-6 break-words'>
                    <span className='bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent break-words'>
                      Code & Tech
                    </span>
                  </h1>
                  <p className='text-lg sm:text-xl lg:text-2xl text-slate-600 mb-6 sm:mb-8 leading-relaxed break-words'>
                    Discover the latest insights in technology, development, and innovation
                  </p>
                  <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <SearchBar />
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Posts Section */}
            {posts.length > 0 && (
              <section>
                <div className='flex items-center justify-between mb-8'>
                  <div>
                    <h2 className='text-2xl lg:text-3xl font-bold text-slate-900 mb-2'>Latest Articles</h2>
                    <p className='text-slate-600'>Discover our most recent insights and tutorials</p>
                  </div>
                  <Link
                    href='/blog'
                    className='inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200'
                  >
                    View All
                    <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </Link>
                </div>
                <LatestArticlesList posts={posts} />
              </section>
            )}

            {/* Quick Stats */}
            <section className='bg-white rounded-2xl shadow-sm border border-slate-200 p-8'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
                <div>
                  <div className='text-3xl font-bold text-blue-600 mb-2'>
                    <AnimatedCounter value={posts.length} suffix="+" />
                  </div>
                  <div className='text-slate-600'>Articles Published</div>
                </div>
                <div>
                  <div className='text-3xl font-bold text-purple-600 mb-2'>
                    <AnimatedCounter value={categories.length} />
                  </div>
                  <div className='text-slate-600'>Categories</div>
                </div>
                <div>
                  <div className='text-3xl font-bold text-green-600 mb-2'>
                    <AnimatedCounter value={totalViews} suffix="+" />
                  </div>
                  <div className='text-slate-600'>Total Views</div>
                </div>
              </div>
            </section>
          </main>
          <aside className='lg:col-span-1'>
            <div className='sticky top-8'>
              <Sidebar popularPosts={popularPosts} tags={recommendedTags} categories={categories} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
