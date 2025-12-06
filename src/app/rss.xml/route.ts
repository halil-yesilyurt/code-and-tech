import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/wordpress';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://code-and-tech.halilyesilyurt.com';

export async function GET() {
  // Fetch latest posts (adjust count as needed)
  const posts = await getPosts(1, 20);

  const rssItems = posts.map((post: any) => `
    <item>
      <title>${escapeXml(post.title.rendered)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt?.rendered || ''}]]></description>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Code and Tech Blog</title>
      <link>${SITE_URL}</link>
      <description>Latest articles from Code and Tech Blog</description>
      <language>en</language>
      ${rssItems}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'\"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
} 