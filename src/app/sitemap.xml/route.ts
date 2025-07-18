import { NextResponse } from 'next/server';
import { getPosts, getCategories } from '@/lib/wordpress';

const SITE_URL = 'https://code-and-tech.vercel.app';

export async function GET() {
  try {
    // Fetch latest 100 blog posts (adjust per needs)
    const posts = await getPosts(1, 100).catch(() => []);

    // Fetch all projects
    const res = await fetch('https://halilyesilyurt.com/api/projects').catch(() => null);
    const projects = res && res.ok ? await res.json() : [];

    // Fetch all categories
    const categories = await getCategories().catch(() => []);

    // Build sitemap entries
    const staticPages = [
      '',
      'blog',
      'projects',
      'categories',
      'contact',
      'search',
      'terms',
      'privacy-policy',
      'cookie-policy',
      'admin/views',
    ];

    const urls = [
      ...staticPages.map((page) => `${SITE_URL}/${page}`),
      // Blog posts with lastmod
      ...posts.map((post: any) => ({ loc: `${SITE_URL}/blog/${post.slug}`, lastmod: post.modified || post.date })),
      ...projects.map((p: { id: string }) => `${SITE_URL}/projects#${p.id}`),
      ...categories.map((cat) => `${SITE_URL}/category/${cat.slug}`),
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
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}</loc></url>\n</urlset>`;
    return new NextResponse(fallback, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
} 