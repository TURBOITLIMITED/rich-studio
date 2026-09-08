import type { Metadata } from 'next';
import './globals.css';
import ScrollRoot from '@/components/ScrollRoot';
import ScrollMotion from '@/components/ScrollMotion';
import Wordmark from '@/components/Wordmark';
import RscMark from '@/components/RscMark';
import Ticker from '@/components/Ticker';
import SiteFooter from '@/components/SiteFooter';

/* Copy here is Rich's own, verbatim from richcolvill.com — not invented.
   An earlier build shipped a made-up strapline and a hello@ address that
   does not exist. Contact details live in lib/contact.ts for the same
   reason: one copy cannot drift. */
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
        {/* The wordmark is the LCP element on every route and it is set in
            the bold weight, so that one file is the only font worth
            preloading. The regular weight is used below the fold only. */}
        <link
          rel="preload"
          href="/fonts/NimbusSans-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#main" className="skip-link t-label">
          Skip to content
        </a>

        {/* The mark and the band are furniture that stays on top of
            everything, so they sit outside the scroll container. */}
        <RscMark />
        <Ticker />

        <ScrollRoot>
          {/* The masthead is fixed too, but it has to live INSIDE the
              scroll container. .scroll-root is position:fixed, and a
              fixed element forms its own stacking context whatever its
              z-index — so while the masthead was a body-level sibling it
              painted over every frame on the page and no z-index on the
              frames could reach it. The order Rich asked for, imagery in
              front of the name and copy behind it, was inert. In here it
              is a sibling of the frames and the z-indexes compare.
              Lenis scrolls this container by scrollTop rather than by a
              transform, so position:fixed still resolves to the
              viewport and the masthead stays pinned. */}
          <Wordmark text="Rich Colvill" />
          <main id="main">{children}</main>
          <SiteFooter />
        </ScrollRoot>

        {/* Drives the scale-settle and in-frame parallax on every
            [data-parallax] figure. One rAF loop for the whole page. */}
        <ScrollMotion />
      </body>
    </html>
  );
}
