import type { Metadata } from 'next';
import DepthCorridor from '@/components/DepthCorridor';
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
      {/* The corridor IS the page head — it carries the h1 and grows it
          while the archive flies past, so the page gets one held moment
          rather than a corridor and then a title under it.

          Its title is deliberately NOT [data-split]: SplitText mangles a
          nested element, and the count inside this one would come back
          duplicated with its line box pushed past the mask. */}
      <DepthCorridor items={ALL_WORK} count={ALL_WORK.length} />

      <WorkGrid items={ALL_WORK} />

      <SiteFooter />
    </>
  );
}
