import Link from 'next/link';

export default function Sidebar({ popularPosts, tags, categories }: { popularPosts: any[]; tags: any[]; categories: any[] }) {
  return (
    <aside className="space-y-6">
      {/* Popular Posts */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
          <h3 className="text-lg font-bold text-slate-900">Popular Posts</h3>
        </div>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/${post.slug}`} 
              className="group block"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {post.title.rendered}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Featured Article</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link 
          href="/blog" 
          className="inline-flex items-center mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          View All Posts
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-slate-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link 
              key={tag.id} 
              href={`/tags/${tag.slug}`} 
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-105"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-slate-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900">Categories</h3>
        </div>
        <div className="space-y-2">
          {categories.map(category => (
            <Link 
              key={category.id} 
              href={`/categories/${category.slug}`} 
              className="flex items-center justify-between p-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
            >
              <span>{category.name}</span>
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
          <p className="text-blue-100 text-sm mb-4">Get the latest tech insights delivered to your inbox</p>
          <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200">
            Subscribe Now
          </button>
        </div>
      </div>
    </aside>
  );
} 