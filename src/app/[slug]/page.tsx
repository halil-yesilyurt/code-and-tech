import { getPostBySlug, getPageBySlug, getCategories, getPosts } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import ArticleCard from '../components/ArticleCard';

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Try to match a category first
  const categories = await getCategories();
  const category = categories.find((cat: any) => cat.slug === slug);

  if (category) {
    // Fetch posts in this category
    const allPosts = await getPosts(1, 100); // Adjust as needed for pagination
    const postsInCategory = allPosts.filter((post: any) => post.categories && post.categories.includes(category.id));
    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Category: {category.name}</h1>
        {postsInCategory.length > 0 ? (
          <div className="space-y-8">
            {postsInCategory.map((post: any) => (
              <ArticleCard key={post.id} post={post} linkBase="/posts/" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts found in this category.</p>
        )}
      </main>
    );
  }

  // Fallback: Try to fetch a post first
  let content = await getPostBySlug(slug);
  let type = 'post';
  if (!content) {
    // If not found, try to fetch a page
    content = await getPageBySlug(slug);
    type = 'page';
  }
  if (!content) {
    notFound();
  }
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{content.title.rendered}</h1>
      <article className="prose prose-lg" dangerouslySetInnerHTML={{ __html: content.content.rendered }} />
      <p className="mt-8 text-xs text-gray-400">Source: WordPress {type}</p>
    </main>
  );
} 