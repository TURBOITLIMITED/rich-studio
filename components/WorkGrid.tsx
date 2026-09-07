'use client';

import Link from 'next/link';
import RegisteredImage from './RegisteredImage';
import { useDropTransition } from './DropTransition';
import { thumbSet, type WorkItem } from '@/lib/work';

/**
 * A uniform two-up grid of work.
 *
 * This used to carry the whole browser: a heading, DISCIPLINES and
 * INDUSTRIES facet buttons, a live count, an empty state, and a repeating
 * [7,5,4,8,6,6,...] span pattern so the grid broke without randomising.
 * The reference the client settled on has none of that — every tile is the
 * same width and the work carries the rhythm — so all of it is gone and
 * the component takes one prop.
 *
 * Both callers (the homepage and the archive) now render an identical
 * grid, which is why there is no `variant`.
 */
export default function WorkGrid({ items }: { items: WorkItem[] }) {
  const drop = useDropTransition();

  if (items.length === 0) return null;

  return (
    <section className="work sheet" id="work">
      <ul className="work-grid grid12" data-reveal="stagger">
        {items.map((w, i) => (
          <li key={w.slug} className="work-tile">
            <Link
              href={`/work/${w.slug}`}
              className="work-link"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                drop(
                  `/work/${w.slug}`,
                  e.currentTarget.querySelector<HTMLElement>('.work-thumb'),
                  w.thumb,
                );
              }}
            >
              <RegisteredImage
                src={w.thumb}
                srcSet={thumbSet(w.thumb)}
                /* Two up above 560px, one up below — so the tile is half
                   the measure on desktop and the whole of it on a phone. */
                sizes="(max-width: 560px) 100vw, 50vw"
                alt={`${w.client} — ${w.title}`}
                className="work-thumb"
                /* Nothing here is above the fold on a phone. Eagerly
                   fetching three 1600px heroes was starving the fonts
                   that the text LCP is waiting on. */
                priority={false}
              />
              <div className="work-cap">
                <span className="t-mono t-mono-b work-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="t-caps work-title">{w.title}</span>
                <span className="t-mono work-facet">
                  {[...w.disciplines, ...w.industries].slice(0, 2).join(' / ')}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
