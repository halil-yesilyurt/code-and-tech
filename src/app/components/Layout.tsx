import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] dark:bg-[#0A202C] text-gray-800 dark:text-gray-300">
      <Header />
      <main id="main-content" className="flex-1 container mx-auto px-4 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
} 