import React from 'react';
import { useConductorSection } from '../../components/layout/useConductor';

export function Methodologie() {
  const sectionRef = useConductorSection('methodologie', 'Méthodologie');

  const etapes = [
    { icon: 'insights', titre: 'Analyse & Stratégie', desc: 'Comprendre le besoin avant d\'agir.' },
    { icon: 'architecture', titre: 'Conception', desc: 'Structuration rigoureuse et idéation créative.' },
    { icon: 'rocket_launch', titre: 'Exécution & Suivi', desc: 'Mise en œuvre, tests et évaluation continue.' },
  ];

  const outils = [
    { cat: "Design & Créativité", icon: 'palette', items: ["Adobe Creative Cloud", "Figma", "Canva Pro", "Suite Mobile"], accent: 'purple' },
    { cat: "Gestion de Projet", icon: 'task_alt', items: ["Notion", "Trello", "Asana", "Slack"], accent: 'emerald' },
    { cat: "Bureautique & Tech", icon: 'devices', items: ["Suite Google", "Microsoft 365", "Diagnostic Industriel"], accent: 'cyan' }
  ];

  const ACCENT_MAP = {
    purple: { border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple', dot: 'bg-purple-500 dot-pulse-purple', badge: 'bg-purple-500/10 text-purple-700 border-purple-200', iconBg: 'bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' },
    emerald: { border: 'border-emerald-200 hover:border-emerald-500', glow: 'glow-emerald', dot: 'bg-emerald-500 dot-pulse-emerald', badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200', iconBg: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' },
    cyan: { border: 'border-cyan-200 hover:border-cyan-500', glow: 'glow-cyan', dot: 'bg-cyan-500 dot-pulse-cyan', badge: 'bg-cyan-500/10 text-cyan-700 border-cyan-200', iconBg: 'bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white' },
  };

  return (
    <section ref={sectionRef} id="methodologie" className="py-xl bg-gradient-to-b from-surface-container-low to-surface border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Section header */}
        <div className="mb-lg border-l-4 border-primary pl-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Stack & Outils</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Mon environnement de travail pensé pour l'efficacité, la collaboration et la créativité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md items-start">
          {/* Méthodologie */}
          <div className="flex flex-col gap-md">
            <div className="bg-surface border border-purple-200 card-sheen-beam glow-purple rounded-xl p-lg shadow-md">
              <div className="flex items-center justify-between mb-md pb-sm border-b border-purple-100">
                <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Méthodologie éprouvée</h3>
                {/* <span className="w-2.5 h-2.5 rounded-full bg-purple-500 dot-pulse-purple" /> */}
              </div>
              <ul className="flex flex-col gap-sm">
                {etapes.map(({ icon, titre, desc }, i) => (
                  <li key={i} className="flex gap-sm items-start">
                    <div className="w-9 h-9 bg-purple-500/10 text-purple-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </div>
                    <div>
                      <p className="font-label-bold  text-body-sm  text-on-surface tracking-wider">{titre}</p>
                      <p className="font-body-sm text-[12px] text-on-surface-variant">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bandeau synthèse */}
            <div className="bg-surface p-md rounded-xl border border-outline-variant/60 flex flex-wrap items-center justify-around gap-sm text-center shadow-sm">
              {[
                { icon: 'verified', color: 'text-emerald-600', label: '15+ outils maîtrisés' },
                { icon: 'psychology', color: 'text-purple-600', label: 'Approche orientée résultats' },
                { icon: 'auto_awesome', color: 'text-amber-600', label: 'Flexibilité & rigueur' },
              ].map(({ icon, color, label }) => (
                <div key={label} className="flex items-center gap-xs">
                  <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                  <span className="font-label-bold text-body-sm text-on-surface">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outils */}
          <div className="flex flex-col gap-md">
            {outils.map((group, idx) => {
              const acc = ACCENT_MAP[group.accent];
              return (
                <div key={idx} className={`group bg-surface border ${acc.border} ${acc.glow} rounded-xl p-lg card-sheen-beam shadow-sm`}>
                  <div className="flex items-center justify-between mb-md">
                    <div className="flex items-center gap-sm">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${acc.iconBg}`}>
                        <span className="material-symbols-outlined text-[20px]">{group.icon}</span>
                      </div>
                      <h4 className="font-headline-md text-body-lg font-bold text-on-surface">{group.cat}</h4>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${acc.dot}`} />
                  </div>
                  <div className="flex flex-wrap gap-xs">
                    {group.items.map((item, i) => (
                      <span key={i} className={`font-label-bold text-[11px] ${acc.badge} border px-sm py-xs rounded-lg shadow-xs`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
