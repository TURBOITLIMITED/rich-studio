'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* His own labels. CONTACT is the CTA now, not a third link, which is why
   it is not in this list. */
const LINKS = [
  { href: '/about', label: 'ABOUT' },
  { href: '/work', label: 'WORK' },
];

/**
 * A fixed 58px bar: wordmark left, links and a square CTA right.
 *
 * The previous nav was centred, transparent, and hid its wordmark until
 * the visitor was 70% past the hero. The reference the client settled on
 * puts the mark top-left and holds it there on every route, with the
 * contact action as a filled square button on the page margin — so the
 * scroll listener and the reveal state are gone.
 *
 * The CTA points at the /contact ROUTE rather than a mailto:. The address
 * lives in exactly one module (lib/contact.ts) precisely so a second copy
 * cannot drift out of date, and /contact already renders it alongside the
 * three desks and the by-appointment hours.
 *
 * Square by instruction: border-radius 0, matching the reference's
 * buttons. The label is Rich's own word rather than the reference's
 * "REACH OUT" — swap this one string if he prefers theirs.
 */
export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="Primary">
      <Link href="/" className="site-nav-mark">
        <span className="rc-mark" aria-hidden="true" />
        RICH COLVILL
      </Link>

      <div className="site-nav-right">
        <ul className="site-nav-links">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`site-nav-link${active ? ' is-on' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {/* The label rolls on hover; kept because it is the one
                      piece of nav motion that survived the strip. */}
                  <span className="roll">
                    <span data-label={l.label}>{l.label}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/contact" className="site-nav-cta">
          CONTACT
        </Link>
      </div>
    </nav>
  );
}
