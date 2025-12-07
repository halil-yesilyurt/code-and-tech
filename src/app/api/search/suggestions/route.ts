import { NextRequest, NextResponse } from 'next/server';
import { getPosts, getCategories, getTags } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Input validation: check length and sanitize
    if (!query || query.length < 2 || query.length > 100) {
      return NextResponse.json({ suggestions: [] }, { status: 400 });
    }

    // Sanitize query: remove potentially dangerous characters
    const sanitizedQuery = query.trim().replace(/[<>]/g, '');
    
    if (sanitizedQuery.length < 2) {
      return NextResponse.json({ suggestions: [] }, { status: 400 });
    }

    // Fetch data for suggestions
    const [posts, categories, tags] = await Promise.all([
      getPosts(1, 10),
      getCategories(),
      getTags()
    ]);

    const searchTerm = sanitizedQuery.toLowerCase();
    const suggestions: Array<{
      type: 'post' | 'category' | 'tag';
      title: string;
      slug: string;
      excerpt?: string;
      url: string;
    }> = [];

    // Search in posts
    posts.forEach(post => {
      if (post.title.rendered.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'post',
          title: post.title.rendered,
          slug: post.slug,
          excerpt: post.excerpt?.rendered,
          url: `/${post.slug}`
        });
      }
    });

    // Search in categories
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'category',
          title: category.name,
          slug: category.slug,
          url: `/category/${category.slug}`
        });
      }
    });

    // Search in tags
    tags.slice(0, 15).forEach(tag => {
      if (tag.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'tag',
          title: tag.name,
          slug: tag.slug,
          url: `/tag/${tag.slug}`
        });
      }
    });

    // Return top 8 suggestions
    return NextResponse.json({
      suggestions: suggestions.slice(0, 8)
    });

  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
} 