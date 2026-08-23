import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { RevealSection } from '../../motion';
import { AProposHero } from './AProposHero';
import { Histoire } from './Histoire';
import { Parcours } from './Parcours';
import { Valeurs } from './Valeurs';
import { Manifeste } from './Manifeste';
import { Engagements } from './Engagements';
import { Galerie } from './Galerie';
import { Methodologie } from './Methodologie';
import { Passions } from './Passions';
import { DownloadCV } from './DownloadCV';
import { CTA } from '../Home/CTA';

export function AProposPage() {
  return (
    <SiteLayout>
      <AProposHero />
      <RevealSection variant="slideLeft"><Histoire /></RevealSection>
      <RevealSection variant="rise"><Parcours /></RevealSection>
      <RevealSection variant="swing"><Valeurs /></RevealSection>
      <RevealSection variant="slideRight"><Manifeste /></RevealSection>
      <RevealSection variant="rise"><Engagements /></RevealSection>
      <RevealSection variant="zoom"><Galerie /></RevealSection>
      <RevealSection variant="slideLeft"><Methodologie /></RevealSection>
      <RevealSection variant="rise"><Passions /></RevealSection>
      <RevealSection variant="zoom"><DownloadCV /></RevealSection>
      <ProchaineEtape courante="/a-propos" />
      <RevealSection variant="zoom"><CTA /></RevealSection>
    </SiteLayout>
  );
}
