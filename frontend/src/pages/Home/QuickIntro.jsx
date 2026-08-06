// R02 — Présentation rapide. Spec §D.1. Texte repris intégralement de
// infos.txt §2.2 « Présentation personnelle » — les deux premiers paragraphes
// (le troisième, plus « vision/ambition », est réservé à /a-propos).
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { ButtonTertiaire } from '../../components/ui/Button';
import { SiteLink } from '../../components/ui/SiteLink';
import { RevealMask } from '../../motion';

export function QuickIntro() {
  const sectionRef = useConductorSection('presentation', 'Présentation');

  return (
    <section ref={sectionRef} id="presentation" className="quick-intro">
      <div className="container">
        <SectionCartouche label="PRÉSENTATION" />
        <div className="quick-intro-text">
          <p>
            <RevealMask as="span" unit="lines">
              Je suis Chabel ANANOUNON, entrepreneur, leader jeunesse, gestionnaire de
              projet, planificateur d&apos;événements et créatif digital béninois. Ma
              passion pour l&apos;innovation, la créativité et le leadership m&apos;a
              conduit à développer plusieurs initiatives visant à accompagner les
              jeunes, promouvoir les talents et créer des opportunités durables grâce
              au numérique.
            </RevealMask>
          </p>
          <p>
            <RevealMask as="span" unit="lines">
              Convaincu que la jeunesse africaine constitue la plus grande richesse du
              continent, je mets mes compétences au service de projets innovants qui
              favorisent l&apos;éducation, l&apos;entrepreneuriat, la transformation
              digitale et le développement des compétences.
            </RevealMask>
          </p>
        </div>
        <ButtonTertiaire as={SiteLink} href="/a-propos">LIRE MON HISTOIRE COMPLÈTE</ButtonTertiaire>
      </div>
    </section>
  );
}
