// WordPress API Integration Utilities
// This will replace the sample data with real WordPress content

import he from 'he';
import recoveredPosts from '@/content/recovered-posts.json';
import recoveredTaxonomies from '@/content/recovered-taxonomies.json';

const archivedPosts = recoveredPosts as WordPressPost[];
const archivedCategories = recoveredTaxonomies.categories as WordPressCategory[];
const archivedTags = recoveredTaxonomies.tags as WordPressTag[];


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

// Archive-backed content: no WordPress server or API credentials are required.

/**
 * Fetch posts from WordPress REST API with embedded content
 * Falls back to sample data if WordPress is not configured
 */
export async function getPosts(page: number = 1, perPage: number = 10): Promise<WordPressPost[]> {
  const offset = Math.max(0, page - 1) * perPage;
  return archivedPosts.slice(offset, offset + perPage);
}

/**
 * Fetch a single post by slug
 * Falls back to sample data if WordPress is not configured
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  return archivedPosts.find(post => post.slug === slug) ?? null;
}

/**
 * Fetch all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  return archivedPosts.map(post => post.slug);
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
  return null as any; // Archived WordPress pages are not served by the retired API.
}

export async function getTags(): Promise<WordPressTag[]> {
  return archivedTags;
}

export async function getCategories(): Promise<WordPressCategory[]> {
  return archivedCategories;
}

export function decodeHtmlEntities(str: string) {
  return he.decode(str);
}

/**
 * Search posts by query string
 * Falls back to sample data if WordPress is not configured
 */
export async function searchPosts(query: string, page: number = 1, perPage: number = 10): Promise<WordPressPost[]> {
  const term = query.trim().toLowerCase();
  const results = archivedPosts.filter(post => !term || [post.title.rendered, post.excerpt.rendered, post.content.rendered].some(value => value.toLowerCase().includes(term)));
  const offset = Math.max(0, page - 1) * perPage;
  return results.slice(offset, offset + perPage);
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
  return archivedPosts.length;
}

// View tracking was removed; keep the function for legacy imports but make it a no-op.
export async function trackPostView(_postId: number): Promise<void> {
  // Intentionally left blank
}
