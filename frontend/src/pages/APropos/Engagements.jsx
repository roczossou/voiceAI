import React from 'react';
import { useConductorSection } from '../../components/layout/useConductor';

export function Engagements() {
  const sectionRef = useConductorSection('engagements', 'Engagements');

  const engagements = [
    {
      titre: "Premier Adjoint au Maire des Jeunes",
      organisation: "Commune de Covè",
      description: "Engagement dans le développement communautaire et la gouvernance jeunesse locale.",
      icon: "account_balance",
      accent: 'purple',
    },
    {
      titre: "Initiatives Communautaires",
      organisation: "Actions sociales",
      description: "Organisation d'activités citoyennes et de sensibilisation pour les jeunes.",
      icon: "diversity_3",
      accent: 'emerald',
    },
    {
      titre: "Formation & Ateliers",
      organisation: "Renforcement de capacités",
      description: "Sessions gratuites pour initier les jeunes aux métiers du numérique.",
      icon: "school",
      accent: 'cyan',
    }
  ];

  const ACCENT_MAP = {
    purple: { border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple', iconBg: 'bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white', title: 'group-hover:text-purple-600', org: 'text-purple-600', dot: 'bg-purple-500 dot-pulse-purple' },
    emerald: { border: 'border-emerald-200 hover:border-emerald-500', glow: 'glow-emerald', iconBg: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white', title: 'group-hover:text-emerald-600', org: 'text-emerald-600', dot: 'bg-emerald-500 dot-pulse-emerald' },
    cyan: { border: 'border-cyan-200 hover:border-cyan-500', glow: 'glow-cyan', iconBg: 'bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white', title: 'group-hover:text-cyan-600', org: 'text-cyan-600', dot: 'bg-cyan-500 dot-pulse-cyan' },
  };

  return (
    <section ref={sectionRef} id="engagements" className="py-xl bg-gradient-to-b from-surface-container-lowest to-surface border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Section header */}
        <div className="mb-lg border-l-4 border-primary pl-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Engagements & Citoyenneté</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Actions concrètes au service de la jeunesse et de la communauté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {engagements.map((eng, idx) => {
            const acc = ACCENT_MAP[eng.accent];
            return (
              <div key={idx} className={`group bg-surface border ${acc.border} ${acc.glow} rounded-xl p-lg card-sheen-beam shadow-sm flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-md">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${acc.iconBg}`}>
                      <span className="material-symbols-outlined text-[24px]">{eng.icon}</span>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${acc.dot}`} />
                  </div>
                  <h3 className={`font-headline-md text-body-lg font-bold text-on-surface mb-xs transition-colors ${acc.title}`}>
                    {eng.titre}
                  </h3>
                  <p className={`font-label-bold text-[11px] tracking-wider mb-sm ${acc.org}`}>{eng.organisation}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{eng.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
