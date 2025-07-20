import { getPostBySlug, getPageBySlug, getCategories, getPosts, getTags, getAuthorInfo, decodeHtmlEntities } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import ArticleCard from '../components/ArticleCard';
import Sidebar from '../components/Sidebar';
import BlogPostLayout from '../components/BlogPostLayout';
import Breadcrumbs from '../components/Breadcrumbs';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // Try to match a category first
    const categories = await getCategories();
    const category = categories.find((cat: { slug: string }) => cat.slug === slug);

    if (category) {
      // Fetch posts in this category
      const allPosts = await getPosts(1, 100); // Adjust as needed for pagination
      const postsInCategory = allPosts.filter((post: { categories?: number[]; id: number }) => post.categories && post.categories.includes(category.id));
      
      // Fetch sidebar data
      const tags = await getTags();
      const popularPosts = allPosts.slice(0, 3);
      
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <main className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            {/* Breadcrumbs */}
            <Breadcrumbs 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: `Category: ${decodeHtmlEntities(category.name)}` }
              ]} 
            />
            <header className="mb-8">
                <h1 className="font-geist text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Category: {decodeHtmlEntities(category.name)}
                </h1>
                <p className="font-montserrat text-slate-600">
                  {postsInCategory.length} post{postsInCategory.length !== 1 ? 's' : ''} in this category
                </p>
              </header>
              
              {postsInCategory.length > 0 ? (
                <div className="space-y-8">
                  {postsInCategory.map((post: { id: number }) => (
                    <ArticleCard key={post.id} post={post} linkBase="/" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-geist text-xl font-semibold text-slate-900 mb-2">No posts found</h3>
                  <p className="font-montserrat text-slate-600">
                    No posts found in this category.
                  </p>
                </div>
              )}
            </div>
          </main>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
            </div>
          </aside>
        </div>
      );
    }

    // Fallback: Try to fetch a post first
    let content = await getPostBySlug(slug);
    if (content) {
      // It's a blog post, use BlogPostLayout
      const author = getAuthorInfo(content);
      const posts = await getPosts(1, 20);
      const tags = await getTags();
      const categories = await getCategories();
      const popularPosts = posts.slice(0, 3);
      return (
        <BlogPostLayout
          post={content}
          author={author}
          tags={tags}
          posts={posts}
          categories={categories}
          sidebarTags={tags}
          sidebarCategories={categories}
          popularPosts={popularPosts}
        />
      );
    }
    // If not found, try to fetch a page
    content = await getPageBySlug(slug);
    if (!content) {
      notFound();
    }
    // Fetch sidebar data for pages
    const allPosts = await getPosts(1, 20);
    const tags = await getTags();
    const popularPosts = allPosts.slice(0, 3);
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 lg:p-12">
            {/* Breadcrumbs */}
            <Breadcrumbs 
              items={[
                { label: 'Home', href: '/' },
                { label: decodeHtmlEntities(content.title.rendered) }
              ]} 
            />
            <header className="mb-8">
              <h1 className="font-geist text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {content.title.rendered}
              </h1>
            </header>
            <article className="font-montserrat prose prose-lg max-w-none prose-headings:font-geist prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-strong:text-slate-900 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100">
              <div dangerouslySetInnerHTML={{ __html: content.content.rendered }} />
            </article>
          </div>
        </main>
        
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8">
            <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
          </div>
        </aside>
      </div>
    );
  } catch (error) {
    console.error('Error in DynamicPage:', error);
    notFound();
  }
} 