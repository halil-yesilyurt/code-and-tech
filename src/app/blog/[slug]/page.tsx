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