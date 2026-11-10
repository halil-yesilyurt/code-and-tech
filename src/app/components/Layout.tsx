import Header from './Header';
import Footer from './Footer';
import MotionEnhancer from './MotionEnhancer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1220] text-[#F3F6FB] ct-app-shell">
      <Header />
      <MotionEnhancer />
      <main id="main-content" className="flex-1 container mx-auto px-4 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
} 