import { NextResponse } from 'next/server';
import { getPosts, getCategories } from '@/lib/wordpress';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://code-and-tech.halilyesilyurt.com";

export async function GET() {
  try {
    // Fetch latest 100 blog posts (adjust per needs)
    const [posts, categories] = await Promise.all([
      getPosts(1, 100).catch(() => []),
      getCategories().catch(() => []),
    ]);

    // Build sitemap entries
    const staticPages = [
      '',
      'blog',
      'interviews',
      'projects',
      'categories',
      'contact',
      'terms',
      'privacy-policy',
      'cookie-policy',
    ];

    const urls = [
      ...staticPages.map((page) => `${BASE_URL}/${page}`),
      // Category pages follow the actual taxonomy (not stale root aliases).
      ...categories.filter((category) => category.count > 0).map((category) => `${BASE_URL}/category/${encodeURIComponent(category.slug)}`),
      // Blog posts with lastmod - use /blog/ prefix
      ...posts.map((post: any) => ({ loc: `${BASE_URL}/blog/${post.slug}`, lastmod: post.modified || post.date })),
    ];

    const urlEntries = urls
      .map((item) => {
        if (typeof item === 'string') {
          return `<url><loc>${item}</loc></url>`;
        }
        return `<url><loc>${item.loc}</loc><lastmod>${new Date(item.lastmod).toISOString()}</lastmod></url>`;
      })
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    // Always return valid XML, even on error
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${BASE_URL}</loc></url>\n</urlset>`;
    return new NextResponse(fallback, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
} 