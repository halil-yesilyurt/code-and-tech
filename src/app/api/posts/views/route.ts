import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/wordpress';
import { incrementViewCount, getAllViewCounts } from '@/lib/viewStorage';

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Increment view count using file storage
    const newCount = incrementViewCount(postId);
    
    return NextResponse.json({ 
      success: true, 
      views: newCount 
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get all posts to ensure we have view counts for all
    const posts = await getPosts(1, 100);
    const viewCounts = getAllViewCounts();
    
    // Create a map of post IDs to view counts
    const postsWithViews = posts.map(post => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      views: viewCounts[post.id] || 0,
      date: post.date,
      excerpt: post.excerpt.rendered
    }));
    
    // Sort by views (descending) and return top posts
    const popularPosts = postsWithViews
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    return NextResponse.json({ 
      popularPosts,
      viewCounts 
    });
  } catch (error) {
    console.error('Error getting popular posts:', error);
    return NextResponse.json({ error: 'Failed to get popular posts' }, { status: 500 });
  }
} 