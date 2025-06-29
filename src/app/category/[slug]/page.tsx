import { getCategories, getPosts } from '@/lib/wordpress';
import ArticleCard from '@/app/components/ArticleCard';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const categories = await getCategories();
  const category = categories.find((cat: any) => cat.slug === slug);

  if (!category) {
    notFound();
  }

  const allPosts = await getPosts(1, 100); // Adjust for pagination if needed
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