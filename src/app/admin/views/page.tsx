import { getAllViewCounts } from '@/lib/viewStorage';
import { getPosts } from '@/lib/wordpress';

export default async function ViewsAdminPage() {
  const viewCounts = await getAllViewCounts();
  const posts = await getPosts(1, 100);
  
  // Create posts with view counts
  const postsWithViews = posts.map(post => ({
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    views: viewCounts[post.id] || 0,
    date: post.date
  })).slice().sort((a, b) => b.views - a.views);

  const totalViews = Object.values(viewCounts).reduce((sum, count) => sum + (typeof count === 'number' ? count : 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Post View Statistics</h1>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-2xl font-bold text-blue-600">{postsWithViews.length}</div>
              <div className="text-slate-600">Total Posts</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <div className="text-2xl font-bold text-green-600">{totalViews}</div>
              <div className="text-slate-600">Total Views</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="text-2xl font-bold text-purple-600">
                {postsWithViews.length > 0 ? Math.round(totalViews / postsWithViews.length) : 0}
              </div>
              <div className="text-slate-600">Avg Views per Post</div>
            </div>
          </div>

          {/* Posts Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Views</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {postsWithViews.map((post, index) => (
                  <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-md">
                        <div className="font-medium text-slate-900 truncate">{post.title}</div>
                        <div className="text-sm text-slate-500">{post.slug}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">{post.views.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <a 
                        href={`/blog/${post.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Post
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No timestamp available when using KV; could store one if desired */}
        </div>
      </div>
    </div>
  );
} 