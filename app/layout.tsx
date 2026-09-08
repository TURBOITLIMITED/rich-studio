import type { Metadata } from 'next';
import './globals.css';
import ScrollRoot from '@/components/ScrollRoot';
import Wordmark from '@/components/Wordmark';
import RscMark from '@/components/RscMark';
import Ticker from '@/components/Ticker';

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

        {/* Fixed furniture sits OUTSIDE the scroll container. That is the
            whole trick of the layout: these three never move, and they
            need no scroll listener to stay put. */}
        <Wordmark text="Rich Colvill" />
        <RscMark />
        <Ticker />

        <ScrollRoot>
          <main id="main">{children}</main>
        </ScrollRoot>
      </body>
    </html>
  );
}
