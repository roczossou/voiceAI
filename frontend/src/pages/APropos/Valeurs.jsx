// R04 — Mes valeurs. Spec §D.2 : grille de 12 cellules, définition qui remonte
// au survol. Bordures en --bordure, pas --cuivre : déviation client du
// 2026-07-31 documentée dans CLAUDE.md (le --cuivre en trait/bordure a été
// retiré partout sauf le conducteur).
import { useRef } from 'react';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { useTilt } from '../../motion';

const VALEURS = [
  { nom: 'EXCELLENCE', definition: 'Le travail livré doit tenir devant un jury.' },
  { nom: 'LEADERSHIP', definition: 'Décider, assumer, entraîner.' },
  { nom: 'INNOVATION', definition: "Chercher la solution qui n'existe pas encore ici." },
  { nom: 'CRÉATIVITÉ', definition: "Trouver l'angle que personne n'a vu." },
  { nom: 'DISCIPLINE', definition: 'Les délais sont une promesse.' },
  { nom: 'INTÉGRITÉ', definition: 'Dire ce qui est, même quand ça coûte.' },
  { nom: 'ENGAGEMENT', definition: 'Un projet commencé est un projet terminé.' },
  { nom: 'IMPACT', definition: 'Ce qui ne change rien ne compte pas.' },
  { nom: 'COLLABORATION', definition: 'Aucune initiative sérieuse ne se porte seul.' },
  { nom: 'RESPONSABILITÉ', definition: 'Répondre de ses choix devant ceux qui suivent.' },
  { nom: 'VISION', definition: 'Travailler pour dans cinq ans, agir aujourd’hui.' },
  { nom: 'PROFESSIONNALISME', definition: 'Le sérieux se voit dans les détails.' },
];

function ValeurCell({ nom, definition }) {
  // Inclinaison au pointeur : la cellule survolée se soulève du plan de la
  // grille (2026-08-03). `lift` reste faible — au-delà, les cellules
  // voisines se chevauchent et la grille perd sa lecture de planche.
  const cellRef = useRef(null);
  useTilt(cellRef, { max: 8, perspective: 700, lift: 14 });

  return (
    <div
      ref={cellRef}
      className="group relative overflow-hidden min-h-[8rem] border-r-[length:var(--trait)] border-b-[length:var(--trait)] border-[color:var(--bordure)] p-[var(--space-5)] flex items-end will-change-transform hover:z-10 hover:bg-[var(--calque-clair)] focus-within:outline-2 focus-within:outline-[var(--jaune-signal)]"
    >
      <span className="relative font-[family-name:var(--font-display)] text-[1.5rem] font-bold uppercase leading-none transition-colors duration-150 group-hover:text-[var(--jaune-signal)]">
        {nom}
      </span>
      <div
        className="absolute inset-0 z-10 flex items-center bg-[var(--graphite)] p-[var(--space-5)]
          text-[var(--calque)] font-mono text-[length:var(--fs-mono-lg)]
          translate-y-full transition-transform duration-[220ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)]
          group-hover:translate-y-0 group-focus-within:translate-y-0 max-md:translate-y-0"
      >
        {definition}
      </div>
    </div>
  );
}

export function Valeurs() {
  const sectionRef = useConductorSection('valeurs', 'Mes valeurs');

  return (
    <section ref={sectionRef} id="valeurs" className="scroll-mt-[6rem] py-[var(--space-24)]">
      <div className="container">
        <SectionCartouche label="MES VALEURS" />
        <div className="grid grid-cols-2 md:grid-cols-4 border-t-[length:var(--trait)] border-l-[length:var(--trait)] border-[color:var(--bordure)]">
          {VALEURS.map((valeur) => <ValeurCell key={valeur.nom} {...valeur} />)}
        </div>
      </div>
    </section>
  );
}
