import {
  getPosts,
  getCategories,
  getTags,
  getPopularPosts,
  decodeHtmlEntities,
} from '@/lib/wordpress';
import Sidebar from '../components/Sidebar';
import InterviewArticlesGrid from '../components/InterviewArticlesGrid';
import EditorialPageShell from '../components/EditorialPageShell';

export const metadata = {
  title: 'Interviews | Code & Tech',
  description: 'Interview tips, experiences, guides and more at Code & Tech.',
};

export default async function InterviewsPage() {
  const [allPosts, categories, tags, popularPosts] = await Promise.all([
    getPosts(1, 100),
    getCategories(),
    getTags(),
    getPopularPosts(3),
  ]);

  const interviewIds = new Set(
    categories
      .filter((category) => decodeHtmlEntities(category.name).toLowerCase().includes('interview'))
      .map((category) => category.id)
  );
  const interviewPosts = allPosts.filter((post) => post.categories?.some((id) => interviewIds.has(id)));

  return (
    <EditorialPageShell
      kind="interviews"
      eyebrow="THE CODE & TECH JOURNAL / CAREERS"
      title="Interview notes"
      description="Guides, preparation strategies and lessons for navigating technical interviews."
    >
      <section className="ct-p3-section" aria-labelledby="interview-articles-title">
        <div className="ct-p3-section-line">
          <h2 id="interview-articles-title">Interview articles<span className="ct-sage-period">.</span></h2>
          <span>{interviewPosts.length} articles</span>
        </div>
        {interviewPosts.length ? (
          <InterviewArticlesGrid posts={interviewPosts} categories={categories} />
        ) : (
          <div className="ct-p3-empty"><p>No interview-related posts found at the moment. Check back soon.</p></div>
        )}
      </section>
      <section className="ct-p3-discovery" aria-label="Explore more">
        <div className="ct-p3-section-line"><h2>Explore further<span className="ct-sage-period">.</span></h2></div>
        <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
      </section>
    </EditorialPageShell>
  );
}
