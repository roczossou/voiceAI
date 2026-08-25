import React from 'react';
import { useConductorSection } from '../../components/layout/useConductor';

export function Passions() {
  const sectionRef = useConductorSection('passions', 'Passions');

  const passions = [
    { name: "Technologie & Innovation", icon: "memory", accent: 'purple' },
    { name: "Lecture & Apprentissage", icon: "menu_book", accent: 'emerald' },
    { name: "Engagement Communautaire", icon: "volunteer_activism", accent: 'cyan' },
    { name: "Arts Visuels & Design", icon: "palette", accent: 'amber' }
  ];

  const ACCENT_MAP = {
    purple: { border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple', icon: 'text-purple-600', iconBg: 'bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white', dot: 'bg-purple-500 dot-pulse-purple', title: 'group-hover:text-purple-600' },
    emerald: { border: 'border-emerald-200 hover:border-emerald-500', glow: 'glow-emerald', icon: 'text-emerald-600', iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white', dot: 'bg-emerald-500 dot-pulse-emerald', title: 'group-hover:text-emerald-600' },
    cyan: { border: 'border-cyan-200 hover:border-cyan-500', glow: 'glow-cyan', icon: 'text-cyan-600', iconBg: 'bg-cyan-500/10 group-hover:bg-cyan-600 group-hover:text-white', dot: 'bg-cyan-500 dot-pulse-cyan', title: 'group-hover:text-cyan-600' },
    amber: { border: 'border-amber-200 hover:border-amber-500', glow: 'glow-amber', icon: 'text-amber-600', iconBg: 'bg-amber-500/10 group-hover:bg-amber-600 group-hover:text-white', dot: 'bg-amber-500 dot-pulse-amber', title: 'group-hover:text-amber-600' },
  };

  return (
    <section ref={sectionRef} id="passions" className="py-xl bg-gradient-to-b from-surface to-surface-container-lowest border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Section header */}
        <div className="mb-lg border-l-4 border-primary pl-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Centres d'intérêt</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Les passions qui alimentent ma créativité et mon engagement au quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md">
          {passions.map((p, idx) => {
            const c = ACCENT_MAP[p.accent];
            return (
              <div
                key={idx}
                className={`group bg-surface border ${c.border} ${c.glow} rounded-xl p-lg flex flex-col items-center gap-sm text-center card-pop-elastic shadow-sm`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${c.iconBg} ${c.icon}`}>
                  <span className="material-symbols-outlined text-[28px]">{p.icon}</span>
                </div>
                <span className={`font-headline-md text-body-lg font-bold text-on-surface transition-colors ${c.title}`}>
                  {p.name}
                </span>
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
