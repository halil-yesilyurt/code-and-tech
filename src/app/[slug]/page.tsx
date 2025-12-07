import { getPostBySlug, getPageBySlug, getCategories, getPosts, getTags, getAuthorInfo, decodeHtmlEntities, stripHtml, getFeaturedImageUrl } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import ArticleCard from '../components/ArticleCard';
import Sidebar from '../components/Sidebar';
import BlogPostLayout from '../components/BlogPostLayout';
import Breadcrumbs from '../components/Breadcrumbs';
import { sanitizeHtml } from '@/lib/sanitize';

// Generate metadata for dynamic pages (posts, categories, pages)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://code-and-tech.halilyesilyurt.com";
  const { slug } = await params;
  
  // Try to fetch a post first
  const post = await getPostBySlug(slug);
  if (post) {
    const featuredImageUrl = getFeaturedImageUrl(post, 'large');
    const excerpt = post.excerpt?.rendered 
      ? stripHtml(post.excerpt.rendered)
      : stripHtml(post.content.rendered).substring(0, 160);
    const seoDescription = `${excerpt} | Read in-depth analysis, coding tutorials, and expert insights on Code & Tech.`;

    return {
      metadataBase: new URL(baseUrl),
      title: post.title.rendered,
      description: seoDescription,
      alternates: {
        canonical: `${baseUrl}/blog/${slug}`,
      },
    };
  }

  // Try to fetch a page
  const page = await getPageBySlug(slug);
  if (page) {
    const excerpt = page.excerpt?.rendered 
      ? stripHtml(page.excerpt.rendered)
      : stripHtml(page.content.rendered).substring(0, 160);

    return {
      metadataBase: new URL(baseUrl),
      title: page.title.rendered,
      description: excerpt || 'Code & Tech',
      alternates: {
        canonical: `${baseUrl}/${slug}`,
      },
    };
  }

  // Try to match a category
  const categories = await getCategories();
  const category = categories.find((cat: { slug: string }) => cat.slug === slug);
  if (category) {
    const name = decodeHtmlEntities(category.name);
    return {
      metadataBase: new URL(baseUrl),
      title: `Category: ${name} | Code & Tech`,
      description: `Discover all posts filed under ${name} on Code & Tech.`,
      alternates: {
        canonical: `${baseUrl}/category/${slug}`,
      },
    };
  }

  // Default fallback
  return {
    metadataBase: new URL(baseUrl),
    title: 'Page Not Found | Code & Tech',
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
  };
}

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-10">
          <main className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-6 md:p-8">
              {/* Breadcrumbs */}
              <Breadcrumbs 
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Blog', href: '/blog' },
                  { label: `Category: ${decodeHtmlEntities(category.name)}` }
                ]} 
              />
              <header className="mb-8">
                <h1 className="font-geist text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Category: {decodeHtmlEntities(category.name)}
                </h1>
                <p className="font-montserrat text-gray-600 dark:text-gray-400">
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
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-geist text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
                  <p className="font-montserrat text-gray-600 dark:text-gray-400">
                    No posts found in this category.
                  </p>
                </div>
              )}
            </div>
          </main>
          
          {/* Sidebar */}
          <aside>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-10">
        <main className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-6 md:p-8 lg:p-12">
            {/* Breadcrumbs */}
            <Breadcrumbs 
              items={[
                { label: 'Home', href: '/' },
                { label: decodeHtmlEntities(content.title.rendered) }
              ]} 
            />
            <header className="mb-8">
              <h1 className="font-geist text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {content.title.rendered}
              </h1>
            </header>
            <article className="font-montserrat prose prose-lg max-w-none prose-headings:font-geist prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:opacity-80 prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.content.rendered) }} />
            </article>
          </div>
        </main>
        
        {/* Sidebar */}
        <aside>
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