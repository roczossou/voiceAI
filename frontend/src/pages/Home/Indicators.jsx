import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCountUp } from '../../motion';
import { useConductorSection } from '../../components/layout/useConductor';
import { fetchStats } from '../../api/client';

const LABELS = [
  { key: 'projets_realises', label: 'PROJETS RÉALISÉS' },
  { key: 'evenements_organises', label: 'ÉVÉNEMENTS ORGANISÉS' },
  { key: 'personnes_formees', label: 'PERSONNES FORMÉES' },
  { key: 'annees_experience', label: "ANNÉES D'EXPÉRIENCE" },
  { key: 'partenaires', label: 'PARTENAIRES' },
  { key: 'distinctions', label: 'DISTINCTIONS' },
];

function Stat({ label, value, index }) {
  const ref = useRef(null);
  useCountUp(ref, { end: value, delay: index * 0.09 });

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface border-2 border-outline-variant hover:border-secondary-container transition-colors group text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-container/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></div>
      <p ref={ref} className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary group-hover:text-secondary-container transition-colors relative z-10">
        {value == null ? '—' : value}
      </p>
      <p className="font-label-lg text-label-lg font-bold text-on-background uppercase mt-2 relative z-10">
        {label}
      </p>
    </div>
  );
}

export function Indicators() {
  const sectionRef = useConductorSection('indicateurs', 'Indicateurs');
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });

  return (
    <section ref={sectionRef} id="indicateurs" className="py-24 px-margin-mobile md:px-margin-desktop bg-background">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase text-center mb-16 leading-none">
          L'IMPACT <br/>
          <span className="text-secondary-container">EN CHIFFRES</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {LABELS.map(({ key, label }, i) => (
            <Stat key={key} label={label} value={stats?.[key] ?? null} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
