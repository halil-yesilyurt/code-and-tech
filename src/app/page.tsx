import { getPosts, getTags, getCategories } from '@/lib/wordpress';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ArticleCard from './components/ArticleCard';
import Sidebar from './components/Sidebar';

export default async function Home() {
  // Fetch posts using WordPress API (falls back to sample data if not configured)
  const posts = await getPosts(1, 10);
  const tags = await getTags();
  const categories = await getCategories();
  const popularPosts = posts.slice(0, 3); // Latest 3 as 'Popular'
  const recommendedTags = tags.slice(0, 6);
  const sidebarCategories = categories.slice(0, 6);

  return (
    <main className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-8">
        <Header />
        <section className="text-center my-8">
          <h1 className="text-4xl font-bold mb-4">Code and Tech Blog</h1>
          <SearchBar />
        </section>
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="flex-1">
            {posts.map(post => (
              <ArticleCard key={post.id} post={post} linkBase="/" />
            ))}
          </section>
          <aside className="w-full lg:w-1/3">
            <Sidebar popularPosts={popularPosts} tags={recommendedTags} categories={sidebarCategories} />
          </aside>
        </div>
      </div>
    </main>
  );
}
