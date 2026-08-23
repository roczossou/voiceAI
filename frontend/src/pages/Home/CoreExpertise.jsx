import React from 'react';
import { Link } from 'react-router-dom';

export function CoreExpertise() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto bg-surface">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-secondary-container/20 to-transparent blur-2xl rounded-full z-0"></div>
          <div className="relative z-10 border-l-4 border-secondary-container pl-6 py-2">
            <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase mb-4 leading-none">
              DOMAINES <br/>
              <span className="text-secondary-container">D'EXPERTISE</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Des solutions créatives et stratégiques pour transformer le potentiel en puissance.
            </p>
          </div>
        </div>
        <Link to="/services" className="font-label-lg text-label-lg font-bold text-on-background bg-secondary-container px-6 py-3 border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all uppercase whitespace-nowrap">
          VOIR TOUS LES SERVICES
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Service 1 */}
        <div className="bg-white border-2 border-black p-8 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
          <div className="w-16 h-16 bg-secondary-container/10 border border-secondary-container text-secondary-container flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-[32px]">design_services</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-background mb-4 uppercase group-hover:text-secondary-container transition-colors">Créativité Digitale</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Des visuels percutants et une identité de marque mémorable pour vous démarquer.</p>
          <ul className="space-y-3 font-body-md text-body-md text-on-background">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary-container text-[20px]">check</span> Design graphique</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary-container text-[20px]">check</span> Branding</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary-container text-[20px]">check</span> Communication digitale</li>
          </ul>
        </div>
        
        {/* Service 2 */}
        <div className="bg-secondary-container border-2 border-black p-8 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 group relative overflow-hidden">
          {/* Highlight badge for primary service */}
          <div className="absolute top-6 right-[-40px] bg-black text-white font-label-sm text-label-sm font-bold uppercase py-1 px-12 transform rotate-45">FOCUS</div>
          <div className="w-16 h-16 bg-black text-secondary-container flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-[32px]">account_tree</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-black mb-4 uppercase">Gestion de Projet</h3>
          <p className="font-body-md text-body-md text-black/80 mb-6">Coordination et suivi rigoureux pour faire passer vos idées du concept à la réalité.</p>
          <ul className="space-y-3 font-body-md text-body-md text-black font-medium">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-black text-[20px]">check</span> Planification stratégique</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-black text-[20px]">check</span> Événementiel</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-black text-[20px]">check</span> Suivi & Évaluation</li>
          </ul>
        </div>
        
        {/* Service 3 */}
        <div className="bg-white border-2 border-black p-8 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
          <div className="w-16 h-16 bg-secondary-container/10 border border-secondary-container text-secondary-container flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-[32px]">groups</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-background mb-4 uppercase group-hover:text-secondary-container transition-colors">Leadership</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Accompagnement, formation et développement des talents pour maximiser l'impact.</p>
          <ul className="space-y-3 font-body-md text-body-md text-on-background">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary-container text-[20px]">check</span> Formation & Ateliers</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary-container text-[20px]">check</span> Gouvernance jeunesse</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary-container text-[20px]">check</span> Développement personnel</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
