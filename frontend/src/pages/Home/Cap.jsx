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

const ACCENTS_CAP = [
  { labelColor: 'text-purple-600', dot: 'bg-purple-500 dot-pulse-purple', border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple' },
  { labelColor: 'text-cyan-600', dot: 'bg-cyan-500 dot-pulse-cyan', border: 'border-cyan-200 hover:border-cyan-500', glow: 'glow-cyan' },
  { labelColor: 'text-amber-600', dot: 'bg-amber-500 dot-pulse-amber', border: 'border-amber-200 hover:border-amber-500', glow: 'glow-amber' },
];

function Axe({ label, texte, index }) {
  const ref = useRef(null);
  useTilt(ref, { max: 8, perspective: 1000, lift: 16 });
  const accent = ACCENTS_CAP[index % ACCENTS_CAP.length];

  return (
    <div
      ref={ref}
      data-reveal-item
      className={`group relative flex flex-col justify-between gap-6 rounded-2xl border bg-surface p-8 transition-all duration-300 ${accent.border} ${accent.glow} shadow-sm will-change-transform`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${accent.dot}`} />
          <span className={`font-mono text-xs font-bold tracking-wider ${accent.labelColor}`}>
            {label}
          </span>
        </div>
        <span className="font-mono text-sm font-bold opacity-30 group-hover:opacity-100 transition-opacity">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <p className="font-display text-lg font-medium leading-relaxed text-on-surface">
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
    <section ref={sectionRef} id="cap" className="scroll-mt-[6rem] py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-margin">
        <SectionCartouche label="LE CAP & VISION" />

        <div ref={grilleRef} className="grid gap-6 md:grid-cols-3 mb-12">
          {AXES.map((axe, i) => <Axe key={axe.cle} index={i} {...axe} />)}
        </div>

        <div className="rounded-2xl border border-outline-variant/60 bg-gradient-to-r from-surface-container-low via-surface to-surface-container-low p-8 shadow-sm">
          <p className="mb-3 font-mono text-xs font-bold tracking-wider text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            PROPOSITION DE VALEUR
          </p>
          <p className="max-w-4xl text-base md:text-lg leading-relaxed text-on-surface-variant">{PROPOSITION}</p>
        </div>
      </div>
    </section>
  );
}
