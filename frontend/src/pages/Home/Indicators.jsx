// R01 — Indicateurs. Spec §D.1. Valeurs = champs de back-office (spec §F
// stats), servies par /api/stats/. Tant qu'un champ reste null (chiffre pas
// encore fourni par le client) : "—", et useCountUp ne l'anime pas.
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCountUp } from '../../motion';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
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
    <div className="indicators-item">
      <p ref={ref} className="indicators-value">{value == null ? '—' : value}</p>
      <p className="indicators-label">{label}</p>
    </div>
  );
}

export function Indicators() {
  const sectionRef = useConductorSection('indicateurs', 'Indicateurs');
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });

  return (
    <section ref={sectionRef} id="indicateurs" className="indicators">
      <div className="container">
        <SectionCartouche label="INDICATEURS" />
        <div className="indicators-grid">
          {LABELS.map(({ key, label }, i) => (
            <Stat key={key} label={label} value={stats?.[key] ?? null} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
