// Section « Cap » — vision, mission, ambition, proposition de valeur.
// Ajoutée le 2026-08-03 (demande client : enrichir l'accueil).
//
// Écart assumé à la spec §D.1, qui fige l'accueil en R00–R07 : cette section
// s'intercale après R02. Validée par le client, comme les précédentes
// dérogations (voir CLAUDE.md).
//
// Tous les textes sont des reprises LITTÉRALES du dossier — infos.txt §4
// (vision / mission / ambition / signature) et §2.4 (proposition de valeur).
// Ne pas les reformuler : ce sont les mots de Chabel.
import { useRef } from 'react';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { useRevealStagger, useTilt } from '../../motion';

const AXES = [
  {
    cle: 'vision',
    label: 'VISION',
    texte: "Être une référence africaine en matière de leadership, d'innovation, de créativité, de gestion de projet et de développement des talents.",
  },
  {
    cle: 'mission',
    label: 'MISSION',
    texte: 'Accompagner les jeunes, les organisations et les entreprises dans la création de projets innovants, le développement des compétences et la transformation digitale.',
  },
  {
    cle: 'ambition',
    label: 'AMBITION',
    texte: 'Construire un écosystème capable de révéler les talents, créer des opportunités et contribuer durablement au développement de l’Afrique.',
  },
];

const PROPOSITION = "À travers mes compétences en gestion de projet, communication digitale, planification d'événements, créativité et leadership, j'accompagne les organisations, les entreprises, les collectivités et les jeunes entrepreneurs dans la conception, la réalisation et la promotion de projets à fort impact.";

function Axe({ label, texte, index }) {
  const ref = useRef(null);
  useTilt(ref, { max: 5, perspective: 1100, lift: 14 });

  return (
    <div
      ref={ref}
      data-reveal-item
      className="flex flex-col gap-[var(--space-5)] border-[length:var(--bd)] border-[color:var(--bordure)] bg-[var(--calque-clair)] p-[var(--space-8)] will-change-transform"
    >
      <p className="flex items-center gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-70">
        <span className="mark-square inline-block h-[.375rem] w-[.375rem] bg-[var(--jaune-signal)]" />
        {label}
        <span className="ml-auto opacity-60">{String(index + 1).padStart(2, '0')}</span>
      </p>
      <p className="font-[family-name:var(--font-display)] text-[1.5rem] font-bold uppercase leading-[1.12]">
        {texte}
      </p>
    </div>
  );
}

export function Cap() {
  const sectionRef = useConductorSection('cap', 'Cap');
  const grilleRef = useRef(null);
  useRevealStagger(grilleRef, { itemCount: AXES.length, distance: 56, stagger: 0.1 });

  return (
    <section ref={sectionRef} id="cap" className="scroll-mt-[6rem] py-[var(--space-24)]">
      <div className="container">
        <SectionCartouche label="LE CAP" />

        <div ref={grilleRef} className="grid gap-[var(--space-4)] md:grid-cols-3">
          {AXES.map((axe, i) => <Axe key={axe.cle} index={i} {...axe} />)}
        </div>

        <div className="mt-[var(--space-10)] border-t-[length:var(--bd)] border-[color:var(--bordure)] pt-[var(--space-8)]">
          <p className="mb-[var(--space-4)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-70">
            PROPOSITION DE VALEUR
          </p>
          <p className="max-w-[62ch] text-[length:var(--fs-body-lg)] leading-[1.6]">{PROPOSITION}</p>
        </div>
      </div>
    </section>
  );
}
