// Accueil — sections R00–R07 (spec §D.1).
//
// Refonte du 2026-08-03 : les sections reçoivent les révélations d'entrée
// variées mises au point sur /a-propos (voir PLAN-REFONTE-VISUELLE.md).
//   · Le hero est exclu : il est déjà à l'écran au chargement, et il CONSERVE
//     sa trame millimétrée — décision client (« laisse le papier sur le hero,
//     il ne sort pas trop »). Elle n'a été retirée que sur /a-propos.
//   · Testimonials et RecentBlog rendent `null` tant que les données réelles
//     n'existent pas ; l'enveloppe est alors un div vide, sans impact.
//   · Le CSS fait main de cette page (home.css) n'est PAS converti en
//     Tailwind : ce serait du remaniement sans gain visuel sur une page déjà
//     validée. Seul le markup neuf (section de rebond) est en Tailwind.
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { RevealSection } from '../../motion';
import { Hero } from './Hero';
import { Indicators } from './Indicators';
import { QuickIntro } from './QuickIntro';
import { Cap } from './Cap';
import { Domains } from './Domains';
import { ServicesApercu } from './ServicesApercu';
import { PublicCible } from './PublicCible';
import { FeaturedProjects } from './FeaturedProjects';
import { Testimonials } from './Testimonials';
import { RecentBlog } from './RecentBlog';
import { CTA } from './CTA';
import './home.css';

export function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <RevealSection variant="tilt3d"><Indicators /></RevealSection>
      <RevealSection variant="slideLeft"><QuickIntro /></RevealSection>
      <RevealSection variant="rise"><Cap /></RevealSection>
      <RevealSection variant="slideRight"><Domains /></RevealSection>
      <RevealSection variant="tilt3d"><ServicesApercu /></RevealSection>
      <RevealSection variant="slideLeft"><PublicCible /></RevealSection>
      <RevealSection variant="swing"><FeaturedProjects /></RevealSection>
      <RevealSection variant="slideRight"><Testimonials /></RevealSection>
      <RevealSection variant="rise"><RecentBlog /></RevealSection>
      <ProchaineEtape courante="/" />
      <RevealSection variant="zoom"><CTA /></RevealSection>
    </SiteLayout>
  );
}
