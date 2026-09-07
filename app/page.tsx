import Link from 'next/link';
import Masthead from '@/components/Masthead';
import StatementHold from '@/components/StatementHold';
import WorkGrid from '@/components/WorkGrid';
import SiteFooter from '@/components/SiteFooter';
import { FEATURED } from '@/lib/work';

export default function Home() {
  return (
    <>
      {/* PRESERVED BY INSTRUCTION: the press rail of books is the hero and
          stays exactly as it is. Everything below it follows the reference. */}
      <Masthead />

      {/* Kept pinned. PressHero's band hook ends at
          STATEMENT_HOLD_VH * innerHeight + bandOffPx (PressHero.tsx:1075,
          :1093), a distance deliberately shared with this section's own
          '+=140%' so the band and the statement leave together. De-pinning
          the statement silently breaks that, and the white flash it caused
          is the bug we fixed this morning. */}
      <StatementHold />

      {/* The reference runs a uniform two-up of featured work under the
          statement, then a filled square button through to the archive.
          This replaces the industry index that used to sit here — the
          reference has no category list, and that index was the only thing
          linking to ?industry=, whose sole reader has been removed. */}
      <WorkGrid items={FEATURED} />

      <div className="sheet home-cta-row">
        <Link href="/work" className="cta-square">
          VIEW ALL WORK
        </Link>
      </div>

      <SiteFooter />
    </>
  );
}
