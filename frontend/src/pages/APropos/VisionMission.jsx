// R02/R03 — Vision / Mission. Spec §D.2 : deux blocs jumeaux sur
// --bleu-atelier, textes exacts du dossier (infos.txt §4, repris mot pour mot).
import { useRef } from 'react';
import { useConductorSection } from '../../components/layout/useConductor';
import { useParallax, useTilt } from '../../motion';

const BLOCS = [
  {
    id: 'vision',
    label: 'VISION',
    texte: "Être une référence africaine en matière de leadership, d'innovation, de créativité, de gestion de projet et de développement des talents.",
  },
  {
    id: 'mission',
    label: 'MISSION',
    texte: 'Accompagner les jeunes, les organisations et les entreprises dans la création de projets innovants, le développement des compétences et la transformation digitale.',
  },
];

function Bloc({ index, label, texte }) {
  const ref = useRef(null);
  useTilt(ref, { max: 5, perspective: 1200, lift: 18 });

  return (
    <div
      ref={ref}
      className="flex flex-col gap-[var(--space-6)] border-[length:var(--bd)] border-[color:rgba(228,234,238,.35)] p-[var(--space-10)] will-change-transform"
    >
      <p className="flex items-center gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-75">
        <span className="mark-square inline-block h-[.375rem] w-[.375rem] bg-[var(--jaune-signal)]" />
        {label}
        <span className="ml-auto opacity-60">{String(index + 1).padStart(2, '0')}</span>
      </p>
      <p className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] font-bold uppercase leading-[1.08]">
        {texte}
      </p>
    </div>
  );
}

export function VisionMission() {
  const sectionRef = useConductorSection('vision-mission', 'Vision & mission');
  const ghostRef = useRef(null);
  useParallax(ghostRef, { from: 8, to: -8 });

  return (
    <section
      ref={sectionRef}
      id="vision-mission"
      className="relative scroll-mt-[6rem] overflow-hidden bg-[var(--bleu-atelier)] py-[var(--space-24)] text-[var(--calque)]"
    >
      {/* Même principe que le hero : mot entier, centré, au-dessus du fond
          mais sous les blocs. Sur --bleu-atelier le fantôme est en --calque
          (clair) pour rester lisible comme une masse, pas comme une tache. */}
      <span
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[6%] z-[1] select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[19vw] font-extrabold uppercase leading-none tracking-[-.02em] text-[var(--calque)] opacity-[.08]"
      >
        CAP
      </span>

      <div className="container relative z-10 grid gap-[var(--space-2)] md:grid-cols-2">
        {BLOCS.map((bloc, i) => <Bloc key={bloc.id} index={i} {...bloc} />)}
      </div>
    </section>
  );
}
