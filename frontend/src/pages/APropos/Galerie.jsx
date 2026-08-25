import React from 'react';
import { useConductorSection } from '../../components/layout/useConductor';

export function Galerie() {
  const sectionRef = useConductorSection('galerie', 'Galerie');

  const photos = [
    { type: 'col-span-2 row-span-2', legend: 'Hackathon AndroCréa 2026', accent: 'purple' },
    { type: 'col-span-1 row-span-1', legend: 'Conférence Jeunesse', accent: 'emerald' },
    { type: 'col-span-1 row-span-1', legend: 'Remise de prix', accent: 'cyan' },
    { type: 'col-span-1 row-span-1', legend: 'Session Mentoring', accent: 'amber' },
    { type: 'col-span-1 row-span-1', legend: "Équipe DIGIT'S CRÉA", accent: 'purple' },
  ];

  const ACCENT_MAP = {
    purple: { border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple' },
    emerald: { border: 'border-emerald-200 hover:border-emerald-500', glow: 'glow-emerald' },
    cyan: { border: 'border-cyan-200 hover:border-cyan-500', glow: 'glow-cyan' },
    amber: { border: 'border-amber-200 hover:border-amber-500', glow: 'glow-amber' },
  };

  return (
    <section ref={sectionRef} id="galerie" className="py-xl bg-gradient-to-b from-surface to-surface-container-low border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Section header */}
        <div className="mb-lg border-l-4 border-primary pl-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Dans les coulisses</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Instants capturés au fil des projets, événements et collaborations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-md auto-rows-[200px]">
          {photos.map((photo, idx) => {
            const acc = ACCENT_MAP[photo.accent];
            return (
              <div
                key={idx}
                className={`relative bg-surface-variant overflow-hidden group rounded-xl border ${acc.border} ${acc.glow} card-parallax-zoom shadow-sm ${photo.type}`}
              >
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-[64px]">image</span>
                </div>
                <div className="absolute bottom-sm left-sm right-sm font-mono text-on-surface-variant/40 text-[10px] font-bold tracking-wider text-center">
                  PHOTO EN ATTENTE
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-md">
                  <p className="font-headline-md text-body-lg font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {photo.legend}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
