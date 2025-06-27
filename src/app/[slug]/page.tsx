import { getPostBySlug, getPageBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Try to fetch a post first
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