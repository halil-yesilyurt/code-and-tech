import Link from 'next/link';

export default function Sidebar({ popularPosts, tags, categories }: { popularPosts: any[]; tags: any[]; categories: any[] }) {
  return (
    <aside className="bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2 inline-block"></span>
          Popular
        </h3>
        <ul className="space-y-2 text-sm">
          {popularPosts.map(post => (
            <li key={post.id}>
              <Link href={`/${post.slug}`} className="hover:text-blue-600">
                {post.title.rendered}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/blog" className="text-green-600 text-xs mt-2 inline-block hover:underline">See the full list</Link>
      </div>
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Recommended Topic</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full hover:bg-blue-100">
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full hover:bg-blue-200">
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
} 