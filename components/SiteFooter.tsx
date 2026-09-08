import Link from 'next/link';
import { STUDIO_EMAIL } from '@/lib/contact';

/**
 * Rich's own wordmark lockup closes the page — "RICH COLVILL STUDIO." set
 * against "COPYRIGHT© ALL RIGHTS RESERVED.", which is how he drew it. It
 * is his Illustrator export, referenced as an <img> rather than inlined:
 * it is 15KB, it appears once per route, and unlike the RSC mark it never
 * needs to take a colour from the page.
 */
export default function SiteFooter() {
  return (
    <footer
      style={{
        paddingInline: 'var(--gutter)',
        paddingTop: 'clamp(60px, 12vh, 150px)',
        paddingBottom: 'clamp(70px, 10vh, 110px)',
        borderTop: '1px solid var(--color-rule)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(28px, 5vh, 56px)',
      }}
    >
      <img
        src="/brand/wordmark-lockup.svg"
        alt="Rich Colvill Studio. Copyright, all rights reserved."
        width={1386}
        height={305}
        loading="lazy"
        style={{ display: 'block', width: '100%', maxWidth: 900, height: 'auto' }}
      />

      <nav
        aria-label="Footer"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 28px', alignItems: 'baseline' }}
      >
        <Link href="/work" className="t-label link-underline">Work</Link>
        <Link href="/about" className="t-label link-underline">About</Link>
        <Link href="/contact" className="t-label link-underline">Contact</Link>
        <a
          href={`mailto:${STUDIO_EMAIL}`}
          className="t-label link-underline"
          style={{ color: 'var(--color-magenta)' }}
        >
          {STUDIO_EMAIL}
        </a>
      </nav>
    </footer>
  );
}
