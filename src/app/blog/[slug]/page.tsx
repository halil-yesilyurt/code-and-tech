import { notFound } from 'next/navigation';
import { 
  getPostBySlug, 
  getAllPostSlugs, 
  getFeaturedImageUrl, 
  getAuthorInfo, 
  stripHtml,
  getPosts,
  getCategories,
  getTags,
  getPopularPosts,
  trackPostView
} from '@/lib/wordpress';
import BlogPostLayout from '../../components/BlogPostLayout';

interface PostPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] }>;
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://code-and-tech.halilyesilyurt.com";
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: `${baseUrl}/blog/${slug}`,
      },
    };
  }

  const featuredImageUrl = getFeaturedImageUrl(post, 'large');
  const excerpt = post.excerpt?.rendered 
    ? stripHtml(post.excerpt.rendered)
    : stripHtml(post.content.rendered).substring(0, 160);

  // Improved SEO description
  const seoDescription = `${excerpt} | Read in-depth analysis, coding tutorials, and expert insights on Code & Tech.`;

  return {
    metadataBase: new URL(baseUrl),
    title: post.title.rendered,
    description: seoDescription,
    keywords: (post._embedded as any)?.['wp:term']?.[0]?.map((tag: any) => tag.name) || [],
    authors: post._embedded?.author?.map(author => author.name) || ['Halil Yesilyurt'],
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title.rendered,
      description: seoDescription,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post._embedded?.author?.map(author => author.name) || ['Halil Yesilyurt'],
      siteName: 'Code & Tech',
      locale: 'en_US',
      images: featuredImageUrl ? [
        {
          url: featuredImageUrl,
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        }
      ] : [
        {
          url: '/screenshot-1.png',
          width: 1200,
          height: 630,
          alt: 'Code & Tech - Modern Tech Blog',
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description: seoDescription,
      creator: '@haliilyesilyurt',
      site: '@haliilyesilyurt',
      images: featuredImageUrl ? [featuredImageUrl] : ['/screenshot-1.png'],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // Track the post view
  await trackPostView(post.id);

  const author = getAuthorInfo(post);
  const posts = await getPosts(1, 20);
  const categories = await getCategories();
  const tags = await getTags();
  const popularPosts = await getPopularPosts(3);

  return (
    <BlogPostLayout
      post={post}
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