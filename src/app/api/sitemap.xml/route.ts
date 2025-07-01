import { NextResponse } from 'next/server';
import { getAllPostSlugs, getCategories } from '@/lib/wordpress';

const SITE_URL = 'https://code-and-tech.vercel.app';

export async function GET() {
  // Fetch all blog post slugs
  const postSlugs = await getAllPostSlugs();

  // Fetch all projects
  const res = await fetch(`${SITE_URL}/api/projects`);
  const projects = res.ok ? await res.json() : [];

  // Fetch all categories
  const categories = await getCategories();

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
    ...postSlugs.map((slug: string) => `${SITE_URL}/blog/${slug}`),
    ...projects.map((p: any) => `${SITE_URL}/projects#${p.id}`),
    ...categories.map((cat: any) => `${SITE_URL}/category/${cat.slug}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (url) => `<url><loc>${url}</loc></url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 