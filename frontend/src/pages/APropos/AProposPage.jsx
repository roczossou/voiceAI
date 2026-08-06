// /a-propos — spec §D.2, augmentée de la section #parcours (spec §D.3),
// fusionnée ici sur décision du client (2026-08-02) plutôt qu'en route
// /parcours séparée : une seule page, un seul point d'entrée conducteur.
// Plan (méthode C.12) :
//   1. Sections : R01 Mon histoire · Mon parcours (académique, formations
//      complémentaires, expériences, #competences) · R02/R03 Vision/Mission ·
//      R04 Valeurs · R05 Manifeste · R06 CTA (réutilisé de l'accueil, contenu
//      identique par la spec).
//   2. Composants réutilisés : SiteLayout, SectionCartouche, RevealMask,
//      useRevealRise/useParallax, CTA (pages/Home).
//   3. Spécifique à cette page : timeline expériences + panneaux compétences
//      (fetch API), grille valeurs à révélation hover, deux blocs
//      Vision/Mission jumeaux.
//   4. Contenu manquant (partie G, item 8 : récit complet, manifeste ;
//      item 5 : expériences) : bloc <> visible, aucune invention.
//   5. Cette page est une PAGE NOUVELLE au sens de CLAUDE.md (au-delà de
//      Home/`/projets`) : stylée en TailwindCSS avec valeurs arbitraires
//      pointant vers les tokens existants, pas de fichier CSS dédié.
//   6. Vérifié : 360px sans débordement, focus visible, reduce-motion,
//      thème sombre, conducteur recalculé au resize (sections a-propos +
//      parcours toutes deux enregistrées).
//   7. Effet retiré : pas de stagger revealRise sur la grille Valeurs (non
//      demandé par la spec pour cette section — seul le survol l'est).
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { RevealSection } from '../../motion';
import { AProposHero } from './AProposHero';
import { Histoire } from './Histoire';
import { Parcours } from './Parcours';
import { VisionMission } from './VisionMission';
import { Valeurs } from './Valeurs';
import { Manifeste } from './Manifeste';
import { CTA } from '../Home/CTA';

// Le hero est délibérément exclu de RevealSection : il est déjà à l'écran au
// chargement, une animation « d'entrée au scroll » n'aurait rien à révéler.
// Il garde sa propre révélation de titre (RevealMask).
//
// L'enveloppe est posée ici, à la page, et non dans chaque composant : le CTA
// est partagé avec l'accueil et ne doit pas hériter de cette animation là-bas.
//
// Une variante différente par section (retour client : « pas la même animation
// à chaque fois »), en alternant les axes — horizontal, vertical, et deux
// bascules en perspective. Les variantes 3D (`tilt3d`, `swing`) sont placées
// sur les sections les plus graphiques, où le relief se lit le mieux.
export function AProposPage() {
  return (
    <SiteLayout>
      <AProposHero />
      <RevealSection variant="slideLeft"><Histoire /></RevealSection>
      <RevealSection variant="rise"><Parcours /></RevealSection>
      <RevealSection variant="tilt3d"><VisionMission /></RevealSection>
      <RevealSection variant="swing"><Valeurs /></RevealSection>
      <RevealSection variant="slideRight"><Manifeste /></RevealSection>
      <ProchaineEtape courante="/a-propos" />
      <RevealSection variant="zoom"><CTA /></RevealSection>
    </SiteLayout>
  );
}
