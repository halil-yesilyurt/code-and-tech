import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getPosts, getTags, decodeHtmlEntities } from '@/lib/wordpress';
import Sidebar from '@/app/components/Sidebar';
import EditorialPageShell from '@/app/components/EditorialPageShell';
import EditorialPostGrid from '@/app/blog/EditorialPostGrid';

// Keep the existing per-category SEO contract.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    return { title: 'Category | Code & Tech', description: 'Browse articles by category on Code & Tech.' };
  }
  const name = decodeHtmlEntities(category.name);
  return {
    title: `Category: ${name} | Code & Tech`,
    description: `Discover all posts filed under ${name} on Code & Tech.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }>; searchParams?: Promise<any> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const [allPosts, tags] = await Promise.all([getPosts(1, 100), getTags()]);
  const postsInCategory = allPosts.filter((post) => post.categories?.includes(category.id));

  return (
    <EditorialPageShell
      kind="category"
      eyebrow="THE CODE & TECH JOURNAL / TOPICS"
      title={decodeHtmlEntities(category.name)}
      description={`All ${postsInCategory.length} article${postsInCategory.length !== 1 ? 's' : ''} filed under this topic.`}
    >
      <nav className="ct-p3-back-links" aria-label="Category navigation">
        <Link href="/categories">← All topics</Link>
        <Link href="/blog">Browse articles ↗</Link>
      </nav>
      <section className="ct-p3-section" aria-labelledby="topic-results-title">
        <div className="ct-p3-section-line">
          <h2 id="topic-results-title">Related writing<span className="ct-sage-period">.</span></h2>
          <span>{postsInCategory.length} articles</span>
        </div>
        {postsInCategory.length ? (
          <EditorialPostGrid posts={postsInCategory} categories={categories} />
        ) : (
          <div className="ct-p3-empty"><p>No posts found in this category.</p></div>
        )}
      </section>
      <section className="ct-p3-discovery" aria-label="Further reading">
        <div className="ct-p3-section-line"><h2>Explore further<span className="ct-sage-period">.</span></h2></div>
        <Sidebar popularPosts={allPosts.slice(0, 3)} tags={tags} categories={categories} />
      </section>
    </EditorialPageShell>
  );
}
