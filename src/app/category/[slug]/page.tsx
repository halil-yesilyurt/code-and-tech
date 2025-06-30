import { getCategories, getPosts, getTags, decodeHtmlEntities } from '@/lib/wordpress';
import ArticleCard from '@/app/components/ArticleCard';
import Sidebar from '@/app/components/Sidebar';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((cat) => (cat as { slug: string }).slug === slug);

  if (!category) {
    notFound();
  }

  const allPosts = await getPosts(1, 100); // Adjust for pagination if needed
  const postsInCategory = allPosts.filter((post) => {
    const p = post as { categories: number[] };
    return p.categories && p.categories.includes(category.id);
  });
  // Fetch sidebar data
  const tags = await getTags();
  const popularPosts = allPosts.slice(0, 3);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
      <main className='lg:col-span-3'>
        <div className='bg-white rounded-2xl shadow-sm p-6 md:p-8'>
          <header className='mb-8'>
            <h1 className='font-geist text-3xl md:text-4xl font-bold text-slate-900 mb-4'>Category: {decodeHtmlEntities(category.name)}</h1>
            <p className='font-montserrat text-slate-600'>
              {postsInCategory.length} post{postsInCategory.length !== 1 ? 's' : ''} in this category
            </p>
          </header>

          {postsInCategory.length > 0 ? (
            <div className='space-y-8'>
              {postsInCategory.map((post) => {
                const p = post as { id: number };
                return <ArticleCard key={p.id} post={post} linkBase='/' />;
              })}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='text-slate-400 mb-4'>
                <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <h3 className='font-geist text-xl font-semibold text-slate-900 mb-2'>No posts found</h3>
              <p className='font-montserrat text-slate-600'>No posts found in this category.</p>
            </div>
          )}
        </div>
      </main>

      {/* Sidebar */}
      <aside className='lg:col-span-1'>
        <div className='sticky top-8'>
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
}
