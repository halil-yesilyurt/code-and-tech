import { Suspense } from 'react';
import { searchPosts, getCategories, getTags, getPosts } from '@/lib/wordpress';
import SearchBarWithAutocomplete from '../components/SearchBarWithAutocomplete';
import ArticleCard from '../components/ArticleCard';
import Sidebar from '../components/Sidebar';
import SearchFilters from '../components/SearchFilters';
import SearchPagination from '../components/SearchPagination';
import EditorialPageShell from '../components/EditorialPageShell';

export const metadata = {
  title: 'Search | Code & Tech',
  description: 'Search articles and tutorials on Code & Tech.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://code-and-tech.halilyesilyurt.com/search' },
};

type Params = { [key: string]: string | string[] | undefined };
function value(params: Params, key: string): string {
  const param = params[key];
  return Array.isArray(param) ? (param[0] || '') : (param || '');
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams || {};
  const query = value(params, 'query').trim();
  const categoryFilter = value(params, 'category');
  const tagFilter = value(params, 'tag');
  const dateFilter = value(params, 'date');
  const requestedPage = Number.parseInt(value(params, 'page') || '1', 10) || 1;

  const [categories, tags, allPosts, results] = await Promise.all([
    getCategories(),
    getTags(),
    getPosts(1, 100),
    query ? searchPosts(query, 1, 100) : Promise.resolve([]),
  ]);

  const category = categories.find((item) => item.slug === categoryFilter);
  const tag = tags.find((item) => item.slug === tagFilter);
  const today = new Date();
  const rangeDays = dateFilter === 'today' ? 1
    : dateFilter === 'week' ? 7
    : dateFilter === 'month' ? 30
    : dateFilter === 'year' ? 365 : null;
  const cutoff = rangeDays === null ? null : today.getTime() - rangeDays * 86400000;

  // Filter *before* pagination: the previous page counted only six already-paged
  // results, which made SearchPagination ineffective for larger result sets.
  const filtered = results.filter((post) => (
    (!categoryFilter || !category || post.categories?.includes(category.id)) &&
    (!tagFilter || !tag || post.tags?.includes(tag.id)) &&
    (cutoff === null || new Date(post.date).getTime() >= cutoff)
  ));
  const perPage = 6;
  const totalPages = Math.ceil(filtered.length / perPage);
  const currentPage = Math.max(1, Math.min(requestedPage, Math.max(1, totalPages)));
  const visible = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <EditorialPageShell
      kind="search"
      eyebrow="THE CODE & TECH JOURNAL / DISCOVER"
      title="Search the journal"
      description="Find practical guides, ideas, interviews and engineering insights."
    >
      <div className="ct-p3-search-bar"><SearchBarWithAutocomplete initialQuery={query} /></div>

      {query ? (
        <section className="ct-p3-section" aria-labelledby="search-results-title">
          <div className="ct-p3-section-line">
            <div>
              <h2 id="search-results-title">Search results<span className="ct-sage-period">.</span></h2>
              <p className="ct-p3-query-label">For “{query}”</p>
            </div>
            <span>{filtered.length} results</span>
          </div>

          <div className="ct-p3-search-filters">
            <Suspense fallback={null}>
              <SearchFilters query={query} categories={categories} tags={tags} currentFilters={{
                category: categoryFilter || undefined,
                tag: tagFilter || undefined,
                date: dateFilter || undefined,
                page: currentPage,
              }} />
            </Suspense>
          </div>

          {visible.length ? (
            <>
              <div className="ct-p3-search-results">
                {visible.map((post) => (
                  <ArticleCard key={post.id} post={post} linkBase="/blog/" searchQuery={query} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="ct-p3-pagination">
                  <Suspense fallback={null}><SearchPagination currentPage={currentPage} totalPages={totalPages} /></Suspense>
                </div>
              )}
            </>
          ) : (
            <div className="ct-p3-empty">
              <h3>No results found</h3>
              <p>Try a broader term, another category, or clear the filters.</p>
            </div>
          )}
        </section>
      ) : (
        <section className="ct-p3-search-prompt">
          <p>Start typing to search through articles, tutorials and interviews.</p>
        </section>
      )}

      <section className="ct-p3-discovery" aria-label="Explore more">
        <div className="ct-p3-section-line"><h2>More to discover<span className="ct-sage-period">.</span></h2></div>
        <Sidebar popularPosts={allPosts.slice(0, 3)} tags={tags} categories={categories} />
      </section>
    </EditorialPageShell>
  );
}
