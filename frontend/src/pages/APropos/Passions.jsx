import React from 'react';
import { useConductorSection } from '../../components/layout/useConductor';

export function Passions() {
  const sectionRef = useConductorSection('passions', 'Passions');

  const passions = [
    { name: "Technologie & Innovation", icon: "memory" },
    { name: "Lecture & Apprentissage", icon: "menu_book" },
    { name: "Engagement Communautaire", icon: "volunteer_activism" },
    { name: "Arts Visuels & Design", icon: "palette" }
  ];

  return (
    <section ref={sectionRef} id="passions" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-outline-variant">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-headline-lg font-bold text-on-background uppercase text-center mb-12">
          Centres <span className="text-secondary-container">d'intérêt</span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          {passions.map((p, idx) => (
            <div key={idx} className="bg-white border-2 border-black px-6 py-4 flex items-center gap-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:border-secondary-container transition-all group">
              <span className="material-symbols-outlined text-3xl text-secondary-container">{p.icon}</span>
              <span className="font-headline-sm font-bold uppercase text-on-background group-hover:text-secondary-container transition-colors">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
