import './globals.css';
import { Montserrat, Inter } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata = {
  title: 'Code and Tech Blog',
  description: 'A modern headless WordPress blog with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}> 
      <body className="font-inter bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
