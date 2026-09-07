import type { Metadata } from 'next';
import WorkGrid from '@/components/WorkGrid';
import SiteFooter from '@/components/SiteFooter';
import { ALL_WORK } from '@/lib/work';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected branding, design and creative production work — Silverstone, Absolut, Odeon, Wall’s, By Bryony, Alton Towers, Network Rail and more.',
};

export default function WorkIndex() {
  return (
    <>
      {/* The reference sets one giant title with the count as a small
          superscript beside it, then goes straight into the grid — no
          eyebrow label, no standfirst, no category index, no filters.
          The count is real, so it reads (31) rather than the reference's
          (10); that is content, not design. */}
      <header className="page-head sheet">
        {/* The count sits BESIDE the h1, not inside it. lib/motion.ts runs
            SplitText over [data-split], and a nested <sup> came back
            duplicated — one empty copy plus the real one — with its
            vertical-align pushing the line box past the mask SplitText
            wraps each line in, which clipped the type. The split target
            stays pure text; the count is positioned here instead. */}
        <div className="page-shout-row">
          <h1 className="t-display page-shout" data-split>ALL WORK</h1>
          <span className="page-count">({ALL_WORK.length})</span>
        </div>
      </header>

      <WorkGrid items={ALL_WORK} />

      <SiteFooter />
    </>
  );
}
