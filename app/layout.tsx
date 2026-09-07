import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import SiteNav from '@/components/SiteNav';
import MotionProvider from '@/components/MotionProvider';

/* Copy here is Rich's own, verbatim from richcolvill.com — not invented.
   The previous build shipped a made-up strapline and a hello@ address
   that does not exist. */
export const metadata: Metadata = {
  metadataBase: new URL('https://richcolvill.com'),
  title: {
    default: '®RICH COLVILL — Branding / Design / Creative Production Studio',
    template: '%s — ®RICH COLVILL',
  },
  description:
    'We help businesses stand out through creative production. A team of creative creatures focussed on executing high end branding, visuals and roll-out. Over 25 years working with Silverstone, Absolut, Odeon, Wall’s, Vivienne Westwood, Molton Brown and more.',
  openGraph: {
    title: '®RICH COLVILL',
    description:
      'Branding / Design / Creative production studio. Over 25 years of high end branding, visuals and roll-out.',
    url: 'https://richcolvill.com',
    siteName: '®RICH COLVILL',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '®RICH COLVILL',
    description: 'Branding / Design / Creative production studio.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        {/* The LCP element is the wordmark TEXT, and 92% of its time was
            render delay waiting on these two faces. Preloading them is the
            single biggest mobile win available. */}
        <link
          rel="preload"
          href="/fonts/HelveticaCondensed-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        {/* Switzer ships as discrete weights, so preloading it means naming
            the ones above the fold rather than one variable file: 800 for
            display, 400 for the copy beneath it. Together they are 35KB
            against the 90KB Archivo variable they replace. */}
        <link
          rel="preload"
          href="/fonts/switzer/switzer-800.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/switzer/switzer-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#main" className="skip-link t-mono">
          Skip to content
        </a>

        {/* The fixed nav must sit outside #smooth-content, or
            ScrollSmoother's transform drags it up the page. */}
        <SiteNav />
        <MotionProvider />

        <SmoothScroll>
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
