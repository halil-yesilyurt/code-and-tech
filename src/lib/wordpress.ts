// WordPress API Integration Utilities
// This will replace the sample data with real WordPress content

import he from 'he';

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>[];
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls: {
        [key: string]: string;
      };
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      date: string;
      slug: string;
      type: string;
      link: string;
      title: {
        rendered: string;
      };
      author: number;
      caption: {
        rendered: string;
      };
      alt_text: string;
      media_type: string;
      mime_type: string;
      media_details: {
        width: number;
        height: number;
        sizes: {
          [key: string]: {
            file: string;
            width: number;
            height: number;
            mime_type: string;
            source_url: string;
          };
        };
      };
      source_url: string;
    }>;
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, unknown>[];
  parent: number;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, unknown>[];
}

// Get WordPress API URL from environment variables
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

// Fallback to sample data if WordPress API is not configured
const USE_SAMPLE_DATA = !WORDPRESS_API_URL;

// Helper to safely parse JSON and log errors
async function safeJsonParse(response: Response, context: string) {
  try {
    return await response.json();
  } catch (err) {
    const text = await response.text();
    console.error(`[WordPress API] Failed to parse JSON in ${context}. Response text:`, text);
    throw err;
  }
}

/**
 * Fetch posts from WordPress REST API with embedded content
 * Falls back to sample data if WordPress is not configured
 */
export async function getPosts(page: number = 1, perPage: number = 10): Promise<WordPressPost[]> {
  if (USE_SAMPLE_DATA) {
    // Return sample data for development
    return getSamplePosts().map((post) => ({
      ...post,
      title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
      excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
      content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
    }));
  }
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/posts?_embed&page=${page}&per_page=${perPage}&status=publish`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      const text = await response.text();
      console.warn('WordPress API error, falling back to sample data:', response.status, text);
      return getSamplePosts().map((post) => ({
        ...post,
        title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
        excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
        content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
      }));
    }
    const posts: WordPressPost[] = await safeJsonParse(response, 'getPosts');
    return posts.map((post) => ({
      ...post,
      title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
      excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
      content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
    }));
  } catch (error) {
    console.error('Error fetching posts from WordPress:', error);
    return getSamplePosts().map((post) => ({
      ...post,
      title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
      excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
      content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
    }));
  }
}

/**
 * Fetch a single post by slug
 * Falls back to sample data if WordPress is not configured
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  if (USE_SAMPLE_DATA) {
    const post = getSamplePostBySlug(slug);
    return post
      ? {
          ...post,
          title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
          excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
          content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
        }
      : null;
  }

  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/posts?slug=${slug}&_embed&status=publish`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn('WordPress API error, falling back to sample data:', response.status);
      const post = getSamplePostBySlug(slug);
      return post
        ? {
            ...post,
            title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
            excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
            content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
          }
        : null;
    }

    const posts: WordPressPost[] = await safeJsonParse(response, 'getPostBySlug');
    const post = posts.length > 0 ? posts[0] : null;
    return post
      ? {
          ...post,
          title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
          excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
          content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
        }
      : null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    const post = getSamplePostBySlug(slug);
    return post
      ? {
          ...post,
          title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
          excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
          content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
        }
      : null;
  }
}

/**
 * Fetch all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  if (USE_SAMPLE_DATA) {
    return ['getting-started-with-nextjs', 'future-of-headless-cms', 'building-scalable-apis-nodejs'];
  }

  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/posts?per_page=100&status=publish&_fields=slug`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn('WordPress API error, falling back to sample slugs');
      return ['getting-started-with-nextjs', 'future-of-headless-cms', 'building-scalable-apis-nodejs'];
    }

    const posts: { slug: string }[] = await safeJsonParse(response, 'getAllPostSlugs');
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return ['getting-started-with-nextjs', 'future-of-headless-cms', 'building-scalable-apis-nodejs'];
  }
}

/**
 * Get featured image URL from embedded media
 */
export function getFeaturedImageUrl(post: WordPressPost, size: string = 'medium'): string | null {
  if (!post._embedded?.['wp:featuredmedia']?.[0]) {
    return null;
  }

  const media = post._embedded['wp:featuredmedia'][0];
  const sizes = media.media_details?.sizes;

  if (sizes && sizes[size]) {
    return sizes[size].source_url;
  }

  return media.source_url || null;
}

/**
 * Get author information from embedded author data
 */
export function getAuthorInfo(post: WordPressPost) {
  if (!post._embedded?.author?.[0]) {
    return null;
  }

  return post._embedded.author[0];
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Strip HTML tags from content for excerpts
 */
export function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, '').trim());
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const stripped = stripHtml(content);
  if (stripped.length <= maxLength) {
    return stripped;
  }
  return stripped.substring(0, maxLength).trim() + '...';
}

/**
 * Calculate reading time in minutes for a given HTML string (200 wpm)
 */
export function calculateReadingTime(html: string): number {
  // Remove HTML tags and decode entities
  const text = stripHtml(html);
  // Count words
  const words = text.trim().split(/\s+/).length;
  // Average reading speed: 200 words per minute
  return Math.max(1, Math.ceil(words / 200));
}

// Sample data functions for fallback
function getSamplePosts(): WordPressPost[] {
  return [
    {
      id: 1,
      date: '2024-01-15T00:00:00',
      date_gmt: '2024-01-15T00:00:00',
      guid: { rendered: 'https://example.com/?p=1' },
      modified: '2024-01-15T00:00:00',
      modified_gmt: '2024-01-15T00:00:00',
      slug: 'getting-started-with-nextjs',
      status: 'publish',
      type: 'post',
      link: 'https://example.com/getting-started-with-nextjs',
      title: { rendered: 'Getting Started with Next.js' },
      content: {
        rendered: '<h2>Introduction</h2><p>Next.js is a powerful React framework...</p>',
        protected: false,
      },
      excerpt: {
        rendered: 'Learn how to build modern web applications with Next.js, React, and TypeScript.',
        protected: false,
      },
      author: 1,
      featured_media: 0,
      comment_status: 'open',
      ping_status: 'open',
      sticky: false,
      template: '',
      format: 'standard',
      meta: [],
      categories: [1],
      tags: [1, 2],
      _embedded: {
        author: [
          {
            id: 1,
            name: 'CodeAndTech Team',
            url: '',
            description: '',
            link: 'https://example.com/author/admin',
            slug: 'admin',
            avatar_urls: {},
          },
        ],
      },
    },
    {
      id: 2,
      date: '2024-01-10T00:00:00',
      date_gmt: '2024-01-10T00:00:00',
      guid: { rendered: 'https://example.com/?p=2' },
      modified: '2024-01-10T00:00:00',
      modified_gmt: '2024-01-10T00:00:00',
      slug: 'future-of-headless-cms',
      status: 'publish',
      type: 'post',
      link: 'https://example.com/future-of-headless-cms',
      title: { rendered: 'The Future of Headless CMS' },
      content: {
        rendered: '<h2>What is a Headless CMS?</h2><p>A headless CMS is...</p>',
        protected: false,
      },
      excerpt: {
        rendered: 'Explore how headless CMS architecture is revolutionizing content management.',
        protected: false,
      },
      author: 1,
      featured_media: 0,
      comment_status: 'open',
      ping_status: 'open',
      sticky: false,
      template: '',
      format: 'standard',
      meta: [],
      categories: [2],
      tags: [3, 4],
      _embedded: {
        author: [
          {
            id: 1,
            name: 'CodeAndTech Team',
            url: '',
            description: '',
            link: 'https://example.com/author/admin',
            slug: 'admin',
            avatar_urls: {},
          },
        ],
      },
    },
    {
      id: 3,
      date: '2024-01-05T00:00:00',
      date_gmt: '2024-01-05T00:00:00',
      guid: { rendered: 'https://example.com/?p=3' },
      modified: '2024-01-05T00:00:00',
      modified_gmt: '2024-01-05T00:00:00',
      slug: 'building-scalable-apis-nodejs',
      status: 'publish',
      type: 'post',
      link: 'https://example.com/building-scalable-apis-nodejs',
      title: { rendered: 'Building Scalable APIs with Node.js' },
      content: {
        rendered: '<h2>Introduction to Node.js APIs</h2><p>Node.js is an excellent choice...</p>',
        protected: false,
      },
      excerpt: {
        rendered: 'Discover best practices for creating robust and scalable APIs using Node.js.',
        protected: false,
      },
      author: 1,
      featured_media: 0,
      comment_status: 'open',
      ping_status: 'open',
      sticky: false,
      template: '',
      format: 'standard',
      meta: [],
      categories: [3],
      tags: [5, 6],
      _embedded: {
        author: [
          {
            id: 1,
            name: 'CodeAndTech Team',
            url: '',
            description: '',
            link: 'https://example.com/author/admin',
            slug: 'admin',
            avatar_urls: {},
          },
        ],
      },
    },
  ];
}

function getSamplePostBySlug(slug: string): WordPressPost | null {
  const posts = getSamplePosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getPageBySlug(slug: string) {
  // Use the configured WordPress URL instead of a hard-coded domain
  if (!WORDPRESS_API_URL) {
    console.warn('WORDPRESS_API_URL is not set – returning null for getPageBySlug');
    return null;
  }
  const apiUrl = `${WORDPRESS_API_URL}/wp/v2/pages?slug=${slug}`;
  const res = await fetch(apiUrl, { next: { revalidate: 60 } });
  if (!res.ok) {
    console.error('Failed to fetch page:', res.status, await res.text());
    return null;
  }
  const pages = await safeJsonParse(res, 'getPageBySlug');
  return pages.length > 0 ? pages[0] : null;
}

export async function getTags(): Promise<WordPressTag[]> {
  if (USE_SAMPLE_DATA) {
    return [
      { id: 1, count: 10, description: '', link: '', name: 'Technology', slug: 'technology', taxonomy: 'post_tag', meta: [] },
      { id: 2, count: 8, description: '', link: '', name: 'Productivity', slug: 'productivity', taxonomy: 'post_tag', meta: [] },
      { id: 3, count: 5, description: '', link: '', name: 'AI', slug: 'ai', taxonomy: 'post_tag', meta: [] },
      { id: 4, count: 4, description: '', link: '', name: 'Dev Tools', slug: 'dev-tools', taxonomy: 'post_tag', meta: [] },
      { id: 5, count: 3, description: '', link: '', name: 'Tutorials', slug: 'tutorials', taxonomy: 'post_tag', meta: [] },
      { id: 6, count: 2, description: '', link: '', name: 'Reviews', slug: 'reviews', taxonomy: 'post_tag', meta: [] },
    ].map((tag) => ({
      ...tag,
      name: decodeHtmlEntities(tag.name),
      slug: decodeHtmlEntities(tag.slug),
    }));
  }
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/tags?per_page=20`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      const text = await response.text();
      console.warn('WordPress API error fetching tags, falling back to sample data:', response.status, text);
      return [];
    }
    const tags: WordPressTag[] = await safeJsonParse(response, 'getTags');
    return tags.map((tag) => ({
      ...tag,
      name: decodeHtmlEntities(tag.name),
      slug: decodeHtmlEntities(tag.slug),
    }));
  } catch (error) {
    console.error('Error fetching tags from WordPress:', error);
    return [];
  }
}

export async function getCategories(): Promise<WordPressCategory[]> {
  // console.log('WORDPRESS_API_URL:', WORDPRESS_API_URL, 'USE_SAMPLE_DATA:', USE_SAMPLE_DATA);
  if (USE_SAMPLE_DATA) {
    return [
      { id: 1, count: 10, description: '', link: '', name: 'Frontend', slug: 'frontend', taxonomy: 'category', meta: [], parent: 0 },
      { id: 2, count: 8, description: '', link: '', name: 'Backend', slug: 'backend', taxonomy: 'category', meta: [], parent: 0 },
      { id: 3, count: 5, description: '', link: '', name: 'Dev Tools', slug: 'dev-tools', taxonomy: 'category', meta: [], parent: 0 },
      { id: 4, count: 4, description: '', link: '', name: 'Performance', slug: 'performance', taxonomy: 'category', meta: [], parent: 0 },
      { id: 5, count: 3, description: '', link: '', name: 'AI', slug: 'ai', taxonomy: 'category', meta: [], parent: 0 },
      { id: 6, count: 2, description: '', link: '', name: 'Tutorials', slug: 'tutorials', taxonomy: 'category', meta: [], parent: 0 },
    ].map((cat) => ({
      ...cat,
      name: decodeHtmlEntities(cat.name),
      slug: decodeHtmlEntities(cat.slug),
    }));
  }
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/categories?per_page=100`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      const text = await response.text();
      console.warn('WordPress API error fetching categories:', response.status, text);
      return [];
    }
    const categories: WordPressCategory[] = await safeJsonParse(response, 'getCategories');
    // console.log('Fetched categories:', categories);
    return categories.map((cat) => ({
      ...cat,
      name: decodeHtmlEntities(cat.name),
      slug: decodeHtmlEntities(cat.slug),
    }));
  } catch (error) {
    console.error('Error fetching categories from WordPress:', error);
    return [];
  }
}

export function decodeHtmlEntities(str: string) {
  return he.decode(str);
}

/**
 * Search posts by query string
 * Falls back to sample data if WordPress is not configured
 */
export async function searchPosts(query: string, page: number = 1, perPage: number = 10): Promise<WordPressPost[]> {
  if (USE_SAMPLE_DATA) {
    // Simple search in sample data (title, excerpt, content)
    const q = query.toLowerCase();
    return getSamplePosts()
      .filter(
        (post) =>
          post.title.rendered.toLowerCase().includes(q) ||
          post.excerpt.rendered.toLowerCase().includes(q) ||
          post.content.rendered.toLowerCase().includes(q)
      )
      .map((post) => ({
        ...post,
        title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
        excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
        content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
      }));
  }

  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/posts?_embed&search=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&status=publish`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.warn('WordPress API error, falling back to sample data:', response.status);
      return getSamplePosts()
        .filter(
          (post) =>
            post.title.rendered.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.rendered.toLowerCase().includes(query.toLowerCase()) ||
            post.content.rendered.toLowerCase().includes(query.toLowerCase())
        )
        .map((post) => ({
          ...post,
          title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
          excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
          content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
        }));
    }

    const posts: WordPressPost[] = await safeJsonParse(response, 'searchPosts');
    return posts.map((post) => ({
      ...post,
      title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
      excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
      content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
    }));
  } catch (error) {
    console.error('Error searching posts from WordPress:', error);
    return getSamplePosts()
      .filter(
        (post) =>
          post.title.rendered.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.rendered.toLowerCase().includes(query.toLowerCase()) ||
          post.content.rendered.toLowerCase().includes(query.toLowerCase())
      )
      .map((post) => ({
        ...post,
        title: { ...post.title, rendered: decodeHtmlEntities(post.title.rendered) },
        excerpt: { ...post.excerpt, rendered: decodeHtmlEntities(post.excerpt.rendered) },
        content: { ...post.content, rendered: decodeHtmlEntities(post.content.rendered) },
      }));
  }
}

/**
 * Get popular posts ordered by view count
 * Falls back to recent posts if view tracking is not available
 */
export async function getPopularPosts(limit: number = 10): Promise<WordPressPost[]> {
  // Without view metrics, just return a random selection of published posts.
  const all = await getPosts(1, 100);
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, limit);
}

/**
 * Fetch the total number of published posts from WordPress REST API
 * Falls back to sample data count if WordPress is not configured
 */
export async function getTotalPublishedPostsCount(): Promise<number> {
  if (USE_SAMPLE_DATA) {
    return getSamplePosts().length;
  }
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/posts?per_page=1&status=publish`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      const text = await response.text();
      console.warn('WordPress API error, falling back to sample data:', response.status, text);
      return getSamplePosts().length;
    }
    // The total count is in the X-WP-Total header
    const total = response.headers.get('X-WP-Total');
    return total ? parseInt(total, 10) : 0;
  } catch (error) {
    console.error('Error fetching total published posts count from WordPress:', error);
    return getSamplePosts().length;
  }
}

// View tracking was removed; keep the function for legacy imports but make it a no-op.
export async function trackPostView(_postId: number): Promise<void> {
  // Intentionally left blank
}
