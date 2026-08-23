import React from 'react';
import { useConductorSection } from '../../components/layout/useConductor';

export function Engagements() {
  const sectionRef = useConductorSection('engagements', 'Engagements');

  const engagements = [
    {
      titre: "Premier Adjoint au Maire des Jeunes",
      organisation: "Commune de Covè",
      description: "Engagement dans le développement communautaire et la gouvernance jeunesse locale.",
      icon: "account_balance"
    },
    {
      titre: "Initiatives Communautaires",
      organisation: "Actions sociales",
      description: "Organisation d'activités citoyennes et de sensibilisation pour les jeunes.",
      icon: "diversity_3"
    },
    {
      titre: "Formation & Ateliers",
      organisation: "Renforcement de capacités",
      description: "Sessions gratuites pour initier les jeunes aux métiers du numérique.",
      icon: "school"
    }
  ];

  return (
    <section ref={sectionRef} id="engagements" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase mb-16 leading-none border-l-8 border-secondary-container pl-6">
          ENGAGEMENTS <br/>
          <span className="text-secondary-container">& CITOYENNETÉ</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {engagements.map((eng, idx) => (
            <div key={idx} className="bg-white border-2 border-outline-variant p-8 hover:border-black hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
              <div className="w-16 h-16 bg-secondary-container/10 text-secondary-container flex items-center justify-center mb-6 rounded-full border border-secondary-container group-hover:bg-secondary-container group-hover:text-black transition-colors">
                <span className="material-symbols-outlined text-[32px]">{eng.icon}</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-background mb-2 uppercase">{eng.titre}</h3>
              <p className="font-label-lg font-bold text-secondary-container mb-4">{eng.organisation}</p>
              <p className="font-body-md text-body-md text-on-surface-variant">{eng.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
