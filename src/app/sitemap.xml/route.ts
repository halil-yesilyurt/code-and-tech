import { NextResponse } from 'next/server';
import { getAllPostSlugs, getCategories } from '@/lib/wordpress';

const SITE_URL = 'https://code-and-tech.vercel.app';

export async function GET() {
  try {
    // Fetch all blog post slugs
    const postSlugs = await getAllPostSlugs().catch(() => []);

    // Fetch all projects
    const res = await fetch(`${SITE_URL}/api/projects`).catch(() => null);
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
      ...postSlugs.map((slug) => `${SITE_URL}/blog/${slug}`),
      ...projects.map((p: { id: string }) => `${SITE_URL}/projects#${p.id}`),
      ...categories.map((cat) => `${SITE_URL}/category/${cat.slug}`),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `<url><loc>${url}</loc></url>`).join('\n')}\n</urlset>`;

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