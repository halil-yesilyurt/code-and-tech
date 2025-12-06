import { getPosts, getTags, getCategories, getPopularPosts, getTotalPublishedPostsCount, decodeHtmlEntities, stripHtml, getFeaturedImageUrl } from '@/lib/wordpress';
import Sidebar from '@/app/components/Sidebar';
import HomePostList from '@/app/components/HomePostList';
import HeroSlider from '@/app/components/HeroSlider';

export default async function Home() {
  // Fetch posts using WordPress API (falls back to sample data if not configured)
  const posts = await getPosts(1, 20);
  const tags = await getTags();
  const categories = await getCategories();
  const popularPosts = await getPopularPosts(3);
  const recommendedTags = tags.slice(0, 6);

  // Fetch the exact number of published articles
  const totalArticles = await getTotalPublishedPostsCount();

  // Get random posts for hero slider (shuffle and take first 5)
  const shuffledPosts = [...posts].sort(() => Math.random() - 0.5);
  const heroPosts = shuffledPosts.slice(0, Math.min(5, posts.length));

  // Get remaining posts for the grid (all posts, hero will show random ones)
  const remainingPosts = posts; // Show all posts in the grid

  return (
    <div className='my-8'>
      {/* Hero Slider Section */}
      {heroPosts.length > 0 && (
        <HeroSlider posts={heroPosts} />
      )}

      {/* Main Content Grid */}
      <main className='grid grid-cols-1 lg:grid-cols-3 gap-12 my-10'>
        <div className='lg:col-span-2'>
          <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>Latest Articles</h2>
          <HomePostList posts={remainingPosts} />
        </div>
        <aside>
          <div className='sticky top-8'>
            <Sidebar popularPosts={popularPosts} tags={recommendedTags} categories={categories} />
          </div>
        </aside>
      </main>
    </div>
  );
}
