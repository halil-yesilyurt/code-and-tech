import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getPostBySlug, 
  getAllPostSlugs, 
  getFeaturedImageUrl, 
  getAuthorInfo, 
  formatDate, 
  stripHtml 
} from '@/lib/wordpress';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const featuredImageUrl = getFeaturedImageUrl(post, 'large');
  const excerpt = post.excerpt?.rendered 
    ? stripHtml(post.excerpt.rendered)
    : stripHtml(post.content.rendered).substring(0, 160);

  return {
    title: post.title.rendered,
    description: excerpt,
    openGraph: {
      title: post.title.rendered,
      description: excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post._embedded?.author?.map(author => author.name) || [],
      images: featuredImageUrl ? [
        {
          url: featuredImageUrl,
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description: excerpt,
      images: featuredImageUrl ? [featuredImageUrl] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const featuredImageUrl = getFeaturedImageUrl(post, 'large');
  const author = getAuthorInfo(post);

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        {featuredImageUrl && (
          <div className="relative h-64 md:h-96 w-full">
            <img
              src={featuredImageUrl}
              alt={post.title.rendered}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              {post.title.rendered}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm md:text-base">
              <time dateTime={post.date} className="drop-shadow">
                {formatDate(post.date)}
              </time>
              {author && (
                <>
                  <span className="drop-shadow">•</span>
                  <span className="drop-shadow">{author.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>
          
          {/* Author Info */}
          {author && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                {author.avatar_urls?.['96'] && (
                  <img
                    src={author.avatar_urls['96']}
                    alt={author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{author.name}</h3>
                  {author.description && (
                    <p className="text-gray-600 mt-1">{author.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Categories and Tags */}
          {(post.categories?.length > 0 || post.tags?.length > 0) && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                {post.categories?.map((categoryId) => (
                  <span 
                    key={categoryId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    Category {categoryId}
                  </span>
                ))}
                {post.tags?.map((tagId) => (
                  <span 
                    key={tagId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    Tag {tagId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
              <Link
                href="/posts"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                View All Posts
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
} 