import React from 'react';
import { useConductorSection } from '../../components/layout/useConductor';

export function Methodologie() {
  const sectionRef = useConductorSection('methodologie', 'Méthodologie');

  const outils = [
    { cat: "Design & Créativité", items: ["Adobe Creative Cloud", "Figma", "Canva Pro", "Suite Mobile"] },
    { cat: "Gestion de Projet", items: ["Notion", "Trello", "Asana", "Slack"] },
    { cat: "Bureautique & Tech", items: ["Suite Google", "Microsoft 365", "Diagnostic Industriel"] }
  ];

  return (
    <section ref={sectionRef} id="methodologie" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-secondary-container/20 to-transparent rounded-full blur-3xl z-0"></div>
      
      <div className="max-w-max-width mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase mb-6 leading-none">
            STACK & <br/>
            <span className="text-secondary-container">OUTILS</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            Mon environnement de travail est pensé pour l'efficacité, la collaboration et la créativité. Je combine les meilleurs outils du marché pour délivrer des résultats exceptionnels.
          </p>
          
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <h3 className="font-headline-md font-bold text-black uppercase mb-4 border-b-2 border-secondary-container pb-2 inline-block">Méthodologie</h3>
            <ul className="space-y-4 font-body-md text-on-background">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-secondary-container">insights</span>
                <span><strong>Analyse & Stratégie :</strong> Comprendre le besoin avant d'agir.</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-secondary-container">architecture</span>
                <span><strong>Conception :</strong> Structuration rigoureuse et idéation.</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-secondary-container">rocket_launch</span>
                <span><strong>Exécution & Suivi :</strong> Mise en œuvre, tests et évaluation continue.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          {outils.map((group, idx) => (
            <div key={idx} className="bg-surface-container-low border border-outline-variant p-6 hover:border-secondary-container transition-colors">
              <h4 className="font-headline-sm font-bold text-on-background uppercase mb-4">{group.cat}</h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, i) => (
                  <span key={i} className="font-label-md bg-white border border-outline px-3 py-1 text-on-surface-variant uppercase text-xs font-bold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
