import { getPosts, getTags, getCategories } from '@/lib/wordpress';
import SearchBar from './components/SearchBar';
import ArticleCard from './components/ArticleCard';
import Link from 'next/link';

export default async function Home() {
  // Fetch posts using WordPress API (falls back to sample data if not configured)
  const posts = await getPosts(1, 10);
  const tags = await getTags();
  const categories = await getCategories();
  console.log('Page categories:', categories);
  const popularPosts = posts.slice(0, 3); // Latest 3 as 'Popular'
  const recommendedTags = tags.slice(0, 6);
  const sidebarCategories = categories.slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold font-montserrat mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Code & Tech
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-8 leading-relaxed">
              Discover the latest insights in technology, development, and innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SearchBar />
              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Updated daily
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Expert insights
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {posts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Latest Articles</h2>
              <p className="text-slate-600">Discover our most recent insights and tutorials</p>
            </div>
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid gap-8">
            {posts.map(post => (
              <ArticleCard key={post.id} post={post} linkBase="/" />
            ))}
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{posts.length}+</div>
            <div className="text-slate-600">Articles Published</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length}</div>
            <div className="text-slate-600">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">{tags.length}</div>
            <div className="text-slate-600">Topics Covered</div>
          </div>
        </div>
      </section>
    </div>
  );
}
