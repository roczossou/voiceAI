import React from 'react';
import { useConductorSection } from '../../components/layout/useConductor';

export function Galerie() {
  const sectionRef = useConductorSection('galerie', 'Galerie');

  // Placeholders pour la galerie
  const photos = [
    { type: 'col-span-2 row-span-2', legend: 'Hackathon AndroCréa 2026' },
    { type: 'col-span-1 row-span-1', legend: 'Conférence Jeunesse' },
    { type: 'col-span-1 row-span-1', legend: 'Remise de prix' },
    { type: 'col-span-1 row-span-1', legend: 'Session Mentoring' },
    { type: 'col-span-1 row-span-1', legend: 'Équipe DIGIT\'S CRÉA' },
  ];

  return (
    <section ref={sectionRef} id="galerie" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase text-center mb-16 leading-none">
          DANS LES <br/>
          <span className="text-secondary-container">COULISSES</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.map((photo, idx) => (
            <div key={idx} className={`relative bg-surface-variant overflow-hidden group border-2 border-black ${photo.type}`}>
              {/* Espace réservé pour l'image */}
              <div className="absolute inset-0 flex items-center justify-center font-mono text-on-surface-variant/50">
                [ESPACE PHOTO]
              </div>
              
              {/* Overlay au survol */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="font-headline-sm font-bold text-white uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {photo.legend}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
