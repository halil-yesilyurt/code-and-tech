import Link from 'next/link';
import {
  getCategories,
  getTags,
  getPosts,
  decodeHtmlEntities,
  type WordPressCategory,
} from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import EditorialPageShell from '../components/EditorialPageShell';

export const metadata = {
  title: 'All Categories | Code & Tech',
  description: 'Browse all technology categories covered by Code & Tech blog.',
  alternates: { canonical: 'https://code-and-tech.halilyesilyurt.com/categories' },
};

type CategoryNode = WordPressCategory & { children: CategoryNode[] };

function categoryTree(categories: WordPressCategory[]): CategoryNode[] {
  const nodes = new Map(categories.map((category) => [category.id, { ...category, children: [] as CategoryNode[] }]));
  const roots: CategoryNode[] = [];
  for (const category of categories) {
    const node = nodes.get(category.id)!;
    if (category.parent && category.parent !== category.id && nodes.has(category.parent)) {
      nodes.get(category.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots.sort((a, b) => a.name.localeCompare(b.name));
}

function CategoryBranch({ category }: { category: CategoryNode }) {
  return (
    <li className="ct-p3-category-item">
      <Link href={`/category/${category.slug}`}>
        <span>{decodeHtmlEntities(category.name)}</span>
        <span className="ct-p3-category-count">{category.count} <span aria-hidden="true">↗</span></span>
      </Link>
      {category.children.length > 0 && (
        <ul className="ct-p3-category-children">
          {category.children.map((child) => <CategoryBranch category={child} key={child.id} />)}
        </ul>
      )}
    </li>
  );
}

export default async function CategoriesPage() {
  const [categories, tags, posts] = await Promise.all([
    getCategories(),
    getTags(),
    getPosts(1, 10),
  ]);
  const tree = categoryTree(categories);

  return (
    <EditorialPageShell
      kind="categories"
      eyebrow="THE CODE & TECH JOURNAL / DISCOVER"
      title="Explore topics"
      description="Find articles by discipline, interest or the technology you're working with."
    >
      <section className="ct-p3-section" aria-labelledby="categories-list-title">
        <div className="ct-p3-section-line">
          <h2 id="categories-list-title">All categories<span className="ct-sage-period">.</span></h2>
          <span>{categories.length} topics</span>
        </div>
        <div className="ct-p3-category-grid">
          {tree.map((category) => (
            <div className="ct-p3-category-group" key={category.id}>
              <ul><CategoryBranch category={category} /></ul>
            </div>
          ))}
        </div>
      </section>
      <section className="ct-p3-discovery" aria-label="Other reading">
        <div className="ct-p3-section-line"><h2>Recommended reading<span className="ct-sage-period">.</span></h2></div>
        <Sidebar popularPosts={posts.slice(0, 3)} tags={tags} categories={categories} />
      </section>
    </EditorialPageShell>
  );
}
