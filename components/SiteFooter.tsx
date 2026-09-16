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
    /* No inline layout. It all lives in the footer rule in globals.css —
       the band clearance was written in both places once and the inline
       copy won without saying so. */
    <footer>
      {/* data-lum makes BackdropContrast treat this as a PLATE, which it
          is — it is artwork, not copy. Without it the mark kept its paper
          ground while scrolling past and punched a white hole through
          "RICH COLVILL STUDIO." on the way down; with it the ground drops
          away over the lockup and only the rings cross, which is the same
          thing they do over every other image on the site.
          0.941 measured off the file the way scripts/luminance.py does
          (flattened onto paper, greyscale, mean) — well above the 0.45
          flip, so the mark correctly stays ink here. */}
      <img
        src="/brand/wordmark-lockup.svg"
        alt="Rich Colvill Studio. Copyright, all rights reserved."
        width={1386}
        height={305}
        loading="lazy"
        data-lum={0.941}
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
        >
          {STUDIO_EMAIL}
        </a>
      </nav>
    </footer>
  );
}
