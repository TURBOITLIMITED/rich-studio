import type { Metadata } from 'next';
import './globals.css';
import ScrollRoot from '@/components/ScrollRoot';
import ScrollMotion from '@/components/ScrollMotion';
import Wordmark from '@/components/Wordmark';
import RscMark from '@/components/RscMark';
import Ticker from '@/components/Ticker';
import BackdropContrast from '@/components/BackdropContrast';
import Intro from '@/components/Intro';
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
    /* data-intro ships in the served HTML so the very first painted frame
       is already the opening state — setting it from an effect would flash
       the finished page first. The inline script below unwinds it before
       paint on every route but the home page, and for reduced motion. */
    <html lang="en-GB" data-intro="boot">
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
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;try{var p=location.pathname;" +
              "var home=p==='/'||p==='/index.html';" +
              "var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;" +
              "if(!home||rm){d.removeAttribute('data-intro')}}catch(e){d.removeAttribute('data-intro')}" +
              // THE BACKSTOP. data-intro ships in the server HTML and, until
              // this existed, ONLY Intro.tsx ever removed it -- while
              // `html[data-intro]:not([data-intro='done']) .scroll-root`
              // sets overflow:hidden. So any failure that stopped that
              // component from running left the page permanently frozen on
              // the hero with scrolling dead: one JS chunk lost to a flaky
              // network, an extension, a hydration error. Reproduced by
              // aborting a single chunk: 6000px of wheel input moved the
              // page 0px. The <noscript> block below only covers JS being
              // DISABLED, which is the one case that was never the problem.
              // This runs inline in <head>, so it fires even when no bundle
              // loads at all. 6s is comfortably past the sequence's own
              // 3.88s finish, and if a slow device is still mid-intro the
              // cost is the masthead snapping to its final position -- a
              // glitch, against a page nobody can scroll.
              "setTimeout(function(){d.removeAttribute('data-intro')},6000);})()",
          }}
        />
        {/* Without JS the sequence can never advance, and the page would sit
            for ever on a centred name over a closed slit. */}
        <noscript>
          <style>{`html[data-intro] .wordmark-layer,
                   html[data-intro] .wordmark-art,
                   html[data-intro] .hero-frame,
                   html[data-intro] .hero-frame video { transform: none !important; clip-path: none !important; }
                   html[data-intro] .mark-layer,
                   html[data-intro] .ticker-layer,
                   html[data-intro] .hero-caption { opacity: 1 !important; }
                   html[data-intro] .scroll-root { overflow-y: scroll !important; }`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="skip-link t-label">
          Skip to content
        </a>

        {/* Furniture: fixed to the viewport, above everything, outside
            the scroll container. Both are clear — no plate behind either
            — so BackdropContrast flips their colour from the measured
            luminance of whatever is passing underneath. */}
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
          <Wordmark />
          <main id="main">{children}</main>
          <SiteFooter />
        </ScrollRoot>

        {/* Drives the scale-settle and in-frame parallax on every
            [data-parallax] figure. One rAF loop for the whole page. */}
        <ScrollMotion />
        <BackdropContrast />
        <Intro />
      </body>
    </html>
  );
}
