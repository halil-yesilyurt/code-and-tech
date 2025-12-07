'use client';
import Link from 'next/link';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import SocialShareButtons from './SocialShareButtons';
import { getFeaturedImageUrl, WordPressPost, WordPressTag, WordPressCategory, decodeHtmlEntities, calculateReadingTime, stripHtml } from '@/lib/wordpress';
import Image from 'next/image';
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

export default function BlogPostLayout({ post, author, tags, posts, categories, sidebarTags, sidebarCategories, popularPosts }: BlogPostLayoutProps) {
  const featuredImageUrl = getFeaturedImageUrl(post, 'large');
  const decodedTitle = decodeHtmlEntities(post.title.rendered);
  const decodedContent = decodeHtmlEntities(post.content.rendered);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://code-and-tech.halilyesilyurt.com";
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  // NOTE: Removed isLoggedIn state and related useEffect block

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title.rendered,
            datePublished: post.date,
            dateModified: post.modified,
            author: {
              "@type": "Person",
              name: "Halil Yesilyurt",
            },
            description: post.excerpt?.rendered ? post.excerpt.rendered.replace(/<[^>]+>/g, "") : stripHtml(post.content.rendered).substring(0, 160),
          }),
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-10">
        <main className="lg:col-span-2">
          <article className="bg-white dark:bg-gray-800/50 rounded-lg overflow-hidden">
            {/* Hero Section */}
            {featuredImageUrl && (
              <div className="relative h-64 md:h-96 w-full">
                <Image
                  src={featuredImageUrl}
                  alt={post.title.rendered}
                  fill
                  className="w-full h-full object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
            )}
            {/* Content Section */}
            <div className="p-6 md:p-8 lg:p-12">
              {/* Breadcrumbs */}
              <Breadcrumbs 
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Blog', href: '/blog' },
                  { label: decodedTitle }
                ]} 
              />
              {/* Header */}
              <header className="mb-8">
                <h1 className="font-geist text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {decodedTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <time dateTime={post.date} className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  {/* {author && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {author.name}
                    </div>
                  )} */}
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {calculateReadingTime(post.content.rendered)} min read
                  </div>
                </div>
              </header>
              {/* Article Content */}
              <div className="font-montserrat prose prose-lg max-w-none prose-headings:font-geist prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:opacity-80 prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(decodedContent) }} />
              </div>
              
              {/* Social Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <SocialShareButtons
                  url={canonicalUrl}
                  title={decodedTitle}
                  description={post.excerpt?.rendered ? decodeHtmlEntities(post.excerpt.rendered) : undefined}
                  featuredImage={featuredImageUrl || undefined}
                  categories={post.categories?.map(catId => {
                    const cat = categories.find((c: WordPressCategory) => c.id === catId);
                    return cat ? cat.name : '';
                  }).filter(Boolean) || []}
                  readingTime={calculateReadingTime(post.content.rendered)}
                />
              </div>
              {/* You May Also Like */}
              {posts && posts.length > 1 && (
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-geist text-lg font-semibold text-gray-900 dark:text-white mb-6 tracking-widest uppercase">You may also like</h4>
                  <ul className="space-y-3">
                    {posts.filter((p: WordPressPost) => p.slug !== post.slug).slice(0, 3).map((p: WordPressPost) => (
                      <li key={p.id} className="flex items-center">
                        <span className="text-primary font-bold mr-2">&bull;</span>
                        <Link href={`/${p.slug}`} className="block font-montserrat text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-primary transition-colors duration-200 uppercase tracking-wide">
                          {p.title.rendered}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Categories Section */}
              {post.categories?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-geist text-lg font-semibold text-gray-900 dark:text-white mb-4 tracking-widest uppercase">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map(catId => {
                      const cat = categories.find((c: WordPressCategory) => c.id === catId);
                      return cat ? (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="inline-block px-4 py-1 bg-teal-100 dark:bg-teal-900/80 text-teal-800 dark:text-teal-200 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
                        >
                          #{cat.name}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start xs:items-center gap-4">
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-primary hover:opacity-80 font-medium transition-opacity duration-200 group"
                  >
                    <svg className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Posts
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center text-primary hover:opacity-80 font-medium transition-opacity duration-200 group"
                  >
                    Back to Home
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </main>
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8">
            <Sidebar popularPosts={popularPosts} tags={sidebarTags} categories={sidebarCategories} />
          </div>
        </aside>
      </div>
    </>
  );
} 