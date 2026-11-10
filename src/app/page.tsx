import Link from 'next/link';
import HomePostList from '@/app/components/HomePostList';
import FeaturedStoriesSlider from '@/app/components/FeaturedStoriesSlider';
import {
  getPosts,
  getCategories,
  decodeHtmlEntities,
} from '@/lib/wordpress';
import './home.css';

export default async function Home() {
  // Content stays on the existing archive-backed interface. Do not assume
  // featured images exist: the recovered posts currently have no media.
  const [posts, categories] = await Promise.all([getPosts(1, 20), getCategories()]);
  const lead = posts[0];
  const supporting = posts.slice(4, 6);
  const latest = posts.slice(6);
  const topics = categories
    .filter((category) => category.count > 0 && category.slug !== 'uncategorized')
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="ct-home">
      <section className="ct-intro" aria-labelledby="ct-page-title">
        <div className="ct-intro-copy">
          <p className="ct-eyebrow"><span className="ct-status-dot" /> THE CODE & TECH JOURNAL</p>
          <h1 id="ct-page-title">A closer look at <span>the modern web.</span></h1>
          <p className="ct-intro-description">
            Thoughtful articles on software development, WordPress, and the tools and ideas shaping how we build.
          </p>
          <div className="ct-intro-actions">
            <Link href="/blog" className="ct-button ct-button-primary">
              Explore articles <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/projects" className="ct-text-link">View projects <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="ct-intro-index" aria-label="Editorial focus">
          <p className="ct-index-label">WHAT WE WRITE ABOUT</p>
          <div><span>01 /</span> Engineering</div>
          <div><span>02 /</span> WordPress</div>
          <div><span>03 /</span> The wider web</div>
          <p className="ct-index-caption">Practical thinking. Clear explanations. No noise.</p>
        </div>
      </section>

      {topics.length > 0 && (
        <nav className="ct-topic-nav" aria-label="Explore by topic">
          <span className="ct-topic-label">Explore topics</span>
          <div className="ct-topic-links">
            {topics.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                {decodeHtmlEntities(category.name)} <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
          <Link href="/categories" className="ct-topic-all">All topics <span aria-hidden="true">→</span></Link>
        </nav>
      )}

      {lead && (
        <section className="ct-featured-section" aria-labelledby="ct-featured-title">
          <div className="ct-section-heading">
            <div>
              <p className="ct-section-kicker">THE EDITOR'S DESK</p>
              <h2 id="ct-featured-title">Featured reading<span className="ct-heading-period">.</span></h2>
            </div>
            <Link href="/blog" className="ct-section-link">All articles <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="ct-featured-grid">
            <FeaturedStoriesSlider posts={posts.slice(0, 4)} />
            <div className="ct-supporting-grid">
              {supporting.map((post, index) => (
                <article className="ct-supporting-article" key={post.id}>
                  <div className="ct-feature-topline"><span>{`0${index + 2} / ${postCategory(post, categories)}`}</span><span aria-hidden="true">↗</span></div>
                  <h3><Link href={`/blog/${post.slug}`}>{decodeHtmlEntities(post.title.rendered)}</Link></h3>
                  <div className="ct-supporting-meta"><time dateTime={post.date}>{postDate(post.date)}</time><span>Article</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ct-latest-section" aria-labelledby="ct-latest-title">
        <div className="ct-section-heading">
          <div>
            <p className="ct-section-kicker">FROM THE ARCHIVE</p>
            <h2 id="ct-latest-title">Latest articles<span className="ct-heading-period">.</span></h2>
          </div>
          <Link href="/blog" className="ct-section-link">Browse the archive <span aria-hidden="true">↗</span></Link>
        </div>
        {latest.length > 0 ? (
          <HomePostList posts={latest} categories={categories} />
        ) : (
          <p className="ct-empty-state">New articles are on the way.</p>
        )}
      </section>

      <section className="ct-continue-section" aria-label="Explore more">
        <div><span className="ct-section-kicker">KEEP EXPLORING</span><h2>Curiosity is a good place to start.</h2></div>
        <Link href="/blog" className="ct-button ct-button-outline">Visit the archive <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
