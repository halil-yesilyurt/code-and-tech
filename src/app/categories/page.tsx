import React from 'react';
export const metadata = {
  title: 'All Categories | Code & Tech',
  description: 'Browse all technology categories covered by Code & Tech blog.'
};
import { getCategories, getTags, getPosts, WordPressCategory, decodeHtmlEntities } from '@/lib/wordpress';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';

function buildCategoryTree(categories: WordPressCategory[]): (WordPressCategory & { children: WordPressCategory[] })[] {
  const map: { [id: number]: WordPressCategory & { children: WordPressCategory[] } } = {};
  categories.forEach((cat) => (map[cat.id] = { ...cat, children: [] }));
  const tree: (WordPressCategory & { children: WordPressCategory[] })[] = [];
  categories.forEach((cat) => {
    if (cat.parent && map[cat.parent]) {
      map[cat.parent].children.push(map[cat.id]);
    } else {
      tree.push(map[cat.id]);
    }
  });
  return tree;
}

function renderCategoryTree(
  tree: (WordPressCategory & { children: WordPressCategory[] })[],
  level = 0
): React.ReactNode {
  return (
    <ul className={level === 0 ? 'pl-0' : 'pl-6'}>
      {tree.map((cat, idx) => (
        <li key={cat.id} className={`mb-3 ${level > 0 ? 'ml-6' : ''}`}>
          <div className="flex items-center space-x-2">
            <Link 
              href={`/category/${cat.slug}`}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              #{decodeHtmlEntities(cat.name)}
            </Link>
          </div>
          {cat.children && cat.children.length > 0 && (
            <>
              <hr className="my-2 border-slate-200" />
              {renderCategoryTree(cat.children as (WordPressCategory & { children: WordPressCategory[] })[], level + 1)}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function CategoriesPage() {
  const categories: WordPressCategory[] = await getCategories();
  const tags = await getTags();
  const posts = await getPosts(1, 10);
  const popularPosts = posts.slice(0, 3);
  const sortedCategories = categories.slice().sort((a, b) => a.name.localeCompare(b.name));
  const tree = buildCategoryTree(categories);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3 space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <header className="mb-8">
            <h1 className="font-geist text-3xl md:text-4xl font-bold text-slate-900 mb-4">All Categories</h1>
            <p className="font-montserrat text-slate-600">
              Browse all {categories.length} categories
            </p>
          </header>
          <div className="font-montserrat">
            {renderCategoryTree(tree)}
          </div>
        </div>
      </main>
      <aside className="lg:col-span-1">
        <div className="sticky top-8">
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
}
