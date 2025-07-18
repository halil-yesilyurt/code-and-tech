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

export const metadata = {
  title: 'Code & Tech | Modern Tech Blog',
  description: 'Code & Tech is your go-to source for the latest technology news, in-depth tutorials, software development guides, and expert insights on innovation, coding, and digital trends. Stay ahead in the tech world with our comprehensive resources and practical tips.',
  metadataBase: new URL('https://code-and-tech.vercel.app'),
  openGraph: {
    title: 'Code & Tech | Modern Tech Blog',
    description: 'Discover expert tutorials, news, and resources on software development, AI, cloud, and emerging technologies.',
    type: 'website',
    url: 'https://code-and-tech.vercel.app',
  },
};

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
              name: metadata.title,
              description: metadata.description,
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
        <link rel="icon" href="/ct-logo.svg" type="image/svg+xml" />
      </head>
      <body className="font-inter bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen antialiased">
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
