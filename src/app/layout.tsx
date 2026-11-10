import './globals.css';
import { Montserrat, Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Script from 'next/script';

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

export function generateMetadata() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://code-and-tech.halilyesilyurt.com";

  return {
  title: 'Code & Tech | Engineering, WordPress & the Modern Web',
  description: 'Code & Tech publishes practical guides and thoughtful articles about software engineering, WordPress, and building for the modern web.',
    metadataBase: new URL(url),
  keywords: ['software engineering', 'WordPress', 'web development', 'programming', 'coding tutorials'],
  authors: [{ name: 'Halil Yesilyurt' }],
  creator: 'Halil Yesilyurt',
  publisher: 'Code & Tech',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Code & Tech | Engineering, WordPress & the Modern Web',
    description: 'Explore practical tutorials, software engineering notes, and WordPress guides from Code & Tech.',
    type: 'website',
      url: url,
    siteName: 'Code & Tech',
    locale: 'en_US',
    images: [
      {
        url: '/screenshot-1.png',
        width: 1200,
        height: 630,
        alt: 'Code & Tech - Modern Tech Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code & Tech | Engineering, WordPress & the Modern Web',
    description: 'Explore practical tutorials, software engineering notes, and WordPress guides from Code & Tech.',
    creator: '@haliilyesilyurt',
    site: '@haliilyesilyurt',
    images: ['/screenshot-1.png'],
  },
  alternates: {
      canonical: url,
  },
};
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${GeistSans.variable}`}> 
      <head>
        {/* JSON-LD Structured Data for WebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Code & Tech | Engineering, WordPress & the Modern Web',
              description: 'Code & Tech publishes practical guides and thoughtful articles about software engineering, WordPress, and building for the modern web.',
              publisher: {
                '@type': 'Organization',
                name: 'Code and Tech Blog',
              },
            }),
          }}
        />
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
        <link rel="icon" href="/favicon-code.svg?v=2" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/ct-logo.svg?v=2" />
      </head>
      <body className="font-inter bg-[#0B1220] text-[#F3F6FB] min-h-screen antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-[#8fcfae] text-[#0b1220] px-4 py-2 rounded"
        >
          Skip to main content
        </a>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        <ErrorBoundary>
          <Layout>{children}</Layout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
