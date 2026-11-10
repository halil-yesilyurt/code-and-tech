import Link from 'next/link';
import {
  getPosts,
  getCategories,
  getTags,
  getPopularPosts,
  decodeHtmlEntities,
} from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import EditorialPostGrid from './EditorialPostGrid';
import BlogPagination from '../components/BlogPagination';
import './editorial.css';

export const metadata = {
  title: 'Blog | Code & Tech',
  description: 'Latest articles, insights and tutorials on software development, AI, cloud and more at Code & Tech.',
  alternates: { canonical: 'https://code-and-tech.halilyesilyurt.com/blog' },
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) {
  const params = await searchParams;
  const pageParam = Array.isArray(params?.page) ? params.page[0] : params?.page;
  const requestedPage = Number.parseInt(pageParam ?? '1', 10) || 1;
  const perPage = 6;

  const [allPosts, categories, tags, popularPosts] = await Promise.all([
    getPosts(1, 100),
    getCategories(),
    getTags(),
    getPopularPosts(3),
  ]);

  // Preserve the interview category exclusion from the previous blog listing.
  const interviewCategoryIds = new Set(
    categories
      .filter((cat) => decodeHtmlEntities(cat.name).toLowerCase().includes('interview'))
      .map((cat) => cat.id)
  );
  const filteredPosts = allPosts.filter(
    (post) => !post.categories?.some((id) => interviewCategoryIds.has(id))
  );

  const totalPages = Math.ceil(filteredPosts.length / perPage);
  const currentPage = Math.max(1, Math.min(requestedPage, Math.max(1, totalPages)));
  const start = (currentPage - 1) * perPage;
  const pagePosts = filteredPosts.slice(start, start + perPage);

  const topicLinks = categories
    .filter((cat) => cat.count > 0 && !interviewCategoryIds.has(cat.id) && cat.slug !== 'uncategorized')
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return (
    <div className="ct-editorial-page ct-blog-index">
      <div className="ct-blog-intro">
        <div>
          <p className="ct-editorial-eyebrow">THE CODE & TECH JOURNAL / ARTICLES</p>
          <h1>Ideas for people <em>who build.</em></h1>
          <p className="ct-blog-lead">Development notes, practical guides, and clear perspectives on the tools behind modern software.</p>
        </div>
        <div className="ct-blog-tally" aria-label="Article count">
          <strong>{filteredPosts.length}</strong>
          <span>Published articles</span>
        </div>
      </div>

      <nav className="ct-blog-topics" aria-label="Browse topics">
        <span className="ct-blog-topics-title">Browse by topic</span>
        <Link href="/blog" className="ct-topic-current" aria-current="page">All articles</Link>
        {topicLinks.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`}>{decodeHtmlEntities(cat.name)}</Link>
        ))}
        <Link className="ct-all-topics" href="/categories">All topics ↗</Link>
      </nav>

      <section className="ct-blog-results" aria-labelledby="ct-blog-results-title">
        <div className="ct-blog-results-heading">
          <div>
            <span className="ct-editorial-eyebrow">THE ARCHIVE</span>
            <h2 id="ct-blog-results-title">Latest writing<span className="ct-sage-period">.</span></h2>
          </div>
          <span className="ct-blog-page-count">{filteredPosts.length ? `Page ${currentPage} of ${totalPages}` : 'No articles'}</span>
        </div>
        {filteredPosts.length ? (
          <>
            <EditorialPostGrid posts={pagePosts} categories={categories} />
            <div className="ct-blog-pagination">
              <BlogPagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          </>
        ) : (
          <p className="ct-blog-empty">No posts available. Check back soon for new articles.</p>
        )}
      </section>

      <section className="ct-blog-discovery" aria-labelledby="ct-discovery-title">
        <div className="ct-blog-discovery-heading">
          <span className="ct-editorial-eyebrow">FURTHER READING</span>
          <h2 id="ct-discovery-title">Explore more<span className="ct-sage-period">.</span></h2>
        </div>
        <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
      </section>
    </div>
  );
}
