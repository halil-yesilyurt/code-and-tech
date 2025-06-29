import './globals.css';
import { Montserrat, Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import Layout from './components/Layout';

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat', 
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900']
});
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: 'Code and Tech Blog',
  description: 'A modern headless WordPress blog with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${GeistSans.variable}`}> 
      <body className="font-inter bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
