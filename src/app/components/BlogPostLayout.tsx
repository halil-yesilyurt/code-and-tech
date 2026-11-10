'use client';

import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from './Breadcrumbs';
import Sidebar from './Sidebar';
import SocialShareButtons from './SocialShareButtons';
import ArticleTableOfContents from './ArticleTableOfContents';
import ArticleReadingProgress from './ArticleReadingProgress';
import {
  getFeaturedImageUrl,
  decodeHtmlEntities,
  calculateReadingTime,
  stripHtml,
  type WordPressPost,
  type WordPressTag,
  type WordPressCategory,
} from '@/lib/wordpress';
import { sanitizeHtml } from '@/lib/sanitize';

interface BlogPostLayoutProps {
  post: WordPressPost;
  author: unknown;
  tags: WordPressTag[];
  posts: WordPressPost[];
  categories: WordPressCategory[];
  sidebarTags: WordPressTag[];
  sidebarCategories: WordPressCategory[];
  popularPosts: WordPressPost[];
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

export default function BlogPostLayout({
  post,
  posts,
  categories,
  sidebarTags,
  sidebarCategories,
  popularPosts,
}: BlogPostLayoutProps) {
  const featuredImageUrl = getFeaturedImageUrl(post, 'large');
  const decodedTitle = decodeHtmlEntities(post.title.rendered);
  // Keep the existing sanitization path for recovered WordPress HTML.
  const html = sanitizeHtml(decodeHtmlEntities(post.content.rendered));
  const excerpt = decodeHtmlEntities(stripHtml(post.excerpt?.rendered || ''));
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://code-and-tech.halilyesilyurt.com'}/blog/${post.slug}`;
  const readTime = calculateReadingTime(post.content.rendered);
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const postCategories = categories.filter((category) => post.categories?.includes(category.id));
  const mainCategory = postCategories.find((item) => item.slug !== 'uncategorized');

  return (
    <div className="ct-editorial-page ct-article-view">
      <ArticleReadingProgress articleSlug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title.rendered,
            datePublished: post.date,
            dateModified: post.modified,
            author: { '@type': 'Person', name: 'Halil Yesilyurt' },
            description: post.excerpt?.rendered
              ? stripHtml(post.excerpt.rendered)
              : stripHtml(post.content.rendered).substring(0, 160),
          }).replace(/</g, '\\\\u003c'),
        }}
      />

      <div className="ct-post-breadcrumbs">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: decodedTitle },
        ]} />
      </div>

      <header className="ct-post-header">
        <div className="ct-post-header-inner">
          <p className="ct-editorial-eyebrow">{mainCategory ? decodeHtmlEntities(mainCategory.name) : 'CODE & TECH'} / THE JOURNAL</p>
          <h1>{decodedTitle}</h1>
          {excerpt && <p className="ct-post-dek">{excerpt}</p>}
          <div className="ct-post-meta">
            <span>By Halil Yesilyurt</span>
            <span aria-hidden="true" className="ct-post-meta-divider" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true" className="ct-post-meta-divider" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </header>

      {featuredImageUrl && (
        <div className="ct-post-cover">
          <Image
            src={featuredImageUrl}
            alt={decodedTitle}
            fill
            sizes="(max-width: 900px) 100vw, 1200px"
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="ct-article-columns">
        <article className="ct-article-content">
          <div
            id="ct-post-content"
            className="ct-post-prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <section className="ct-share-panel" aria-label="Share this article">
            <SocialShareButtons
              url={canonicalUrl}
              title={decodedTitle}
              description={excerpt || undefined}
              featuredImage={featuredImageUrl || undefined}
              categories={postCategories.map((category) => decodeHtmlEntities(category.name))}
              readingTime={readTime}
            />
          </section>

          {postCategories.length > 0 && (
            <section className="ct-post-taxonomies" aria-labelledby="ct-categories-heading">
              <p id="ct-categories-heading" className="ct-post-section-label">FILED UNDER</p>
              <div className="ct-post-tags">
                {postCategories.map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    {decodeHtmlEntities(category.name)} <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="ct-related-reading" aria-labelledby="ct-related-heading">
              <div className="ct-related-heading">
                <p className="ct-post-section-label">KEEP READING</p>
                <h2 id="ct-related-heading">You might also like<span className="ct-sage-period">.</span></h2>
              </div>
              <div className="ct-related-list">
                {related.map((item, index) => (
                  <Link href={`/blog/${item.slug}`} key={item.id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{decodeHtmlEntities(item.title.rendered)}</strong>
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <nav className="ct-post-exit" aria-label="Continue exploring">
            <Link href="/blog"><span aria-hidden="true">←</span> All articles</Link>
            <Link href="/">Back to home <span aria-hidden="true">↗</span></Link>
          </nav>
        </article>

        <aside className="ct-article-rail">
          <ArticleTableOfContents articleSlug={post.slug} />
          <div className="ct-rail-note">
            <span className="ct-rail-kicker">THE CODE & TECH JOURNAL</span>
            <p>Technical ideas, explained with clarity.</p>
            <Link href="/blog">Explore the archive <span aria-hidden="true">↗</span></Link>
          </div>
        </aside>
      </div>

      {/* Retain the original discovery + Mailchimp newsletter functionality. */}
      <section className="ct-post-discovery" aria-labelledby="ct-post-discovery-title">
        <div className="ct-post-discovery-heading">
          <p className="ct-post-section-label">FURTHER READING</p>
          <h2 id="ct-post-discovery-title">Elsewhere in the journal<span className="ct-sage-period">.</span></h2>
        </div>
        <Sidebar popularPosts={popularPosts} tags={sidebarTags} categories={sidebarCategories} />
      </section>
    </div>
  );
}
