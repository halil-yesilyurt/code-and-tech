'use client';
import Link from 'next/link';
import Sidebar from './Sidebar';
import ViewTracker from './ViewTracker';
import { getFeaturedImageUrl, WordPressPost, WordPressTag, WordPressCategory, decodeHtmlEntities } from '@/lib/wordpress';
import { useEffect } from 'react';

interface BlogPostLayoutProps {
  post: WordPressPost;
  author: any;
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

  useEffect(() => {
    console.log('CLIENT BlogPostLayout raw title:', post.title);
    console.log('CLIENT BlogPostLayout raw content:', post.content);
  }, [post]);

  return (
    <>
      <ViewTracker postId={post.id} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3">
          <article className="bg-white rounded-2xl overflow-hidden">
            {/* Hero Section */}
            {featuredImageUrl && (
              <div className="relative h-64 md:h-96 w-full">
                <img
                  src={featuredImageUrl}
                  alt={post.title.rendered}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
            )}
            {/* Content Section */}
            <div className="p-6 md:p-8 lg:p-12">
              {/* Header */}
              <header className="mb-8">
                <h1 className="font-geist text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  {decodedTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
                  <time dateTime={post.date} className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {post.date}
                  </time>
                  {author && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {author.name}
                    </div>
                  )}
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    5 min read
                  </div>
                </div>
              </header>
              {/* Article Content */}
              <div className="font-montserrat prose prose-lg max-w-none prose-headings:font-geist prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-strong:text-slate-900 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100">
                <div dangerouslySetInnerHTML={{ __html: decodedContent }} />
              </div>
              {/* Author Info */}
              {author && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-xl">
                    {author.avatar_urls?.['96'] && (
                      <img
                        src={author.avatar_urls['96']}
                        alt={author.name}
                        width={64}
                        height={64}
                        className="rounded-full ring-2 ring-white shadow-sm"
                      />
                    )}
                    <div>
                      <h3 className="font-geist text-lg font-semibold text-slate-900">{author.name}</h3>
                      {author.description && (
                        <p className="font-montserrat text-slate-600 mt-1">{author.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* You May Also Like */}
              {posts && posts.length > 1 && (
                <div className="mt-16 pt-8 border-t border-slate-200">
                  <h4 className="font-geist text-lg font-semibold text-slate-900 mb-6 tracking-widest uppercase">You may also like</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {posts.filter((p: WordPressPost) => p.slug !== post.slug).sort(() => 0.5 - Math.random()).slice(0, 3).map((p: WordPressPost) => {
                      const image = getFeaturedImageUrl(p, 'medium');
                      return (
                        <div key={p.id} className="flex flex-col items-center group">
                          <Link href={`/blog/${p.slug}`} className="block w-full h-40 rounded-lg overflow-hidden bg-slate-100 mb-3">
                            {image ? (
                              <img src={image} alt={p.title.rendered} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              </div>
                            )}
                          </Link>
                          <Link href={`/blog/${p.slug}`} className="block text-center font-montserrat text-sm font-semibold text-slate-800 mt-2 group-hover:text-blue-600 transition-colors duration-200 uppercase tracking-wide">
                            {p.title.rendered}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Tags Section */}
              {post.tags?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h4 className="font-geist text-lg font-semibold text-slate-900 mb-4 tracking-widest uppercase">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tagId => {
                      const tag = tags.find((t: WordPressTag) => t.id === tagId);
                      return tag ? (
                        <span key={tag.id} className="inline-block px-4 py-1 border border-slate-300 rounded-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 transition">
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Link
                    href="/posts"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
                  >
                    <svg className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Posts
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
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