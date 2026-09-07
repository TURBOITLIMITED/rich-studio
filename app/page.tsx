import Link from 'next/link';
import Masthead from '@/components/Masthead';
import StatementHold from '@/components/StatementHold';
import ExpandPlate from '@/components/ExpandPlate';
import WorkReel from '@/components/WorkReel';
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

      {/* The lead project comes on press: held, and opening from a small
          sheet to the full bleed as you scroll through it. */}
      <ExpandPlate item={FEATURED[0]} />

      {/* The rest of the featured work runs sideways while the page is
          held. FEATURED[0] is dropped — it has just had a full screen to
          itself in the plate above. */}
      <WorkReel items={FEATURED.slice(1)} />

      <div className="sheet home-cta-row">
        <Link href="/work" className="cta-square">
          VIEW ALL WORK
        </Link>
      </div>

      <SiteFooter />
    </>
  );
}
