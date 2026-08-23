import React from 'react';
import portraitImg from '../../assets/portrait-cutout.png';

const METIERS = 'Entrepreneur · Leader jeunesse · Gestionnaire de projet · Planificateur d’événements · Créatif digital';

export function AProposHero() {
  return (
    <section className="relative w-full min-h-[90vh] py-24 flex items-center bg-primary overflow-hidden">
      {/* Asymmetric Color Block / Backdrop */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-secondary-container hidden lg:block transform -skew-x-12 translate-x-16 z-0"></div>
      
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10 w-full mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 text-on-primary space-y-8">
            <div>
              <span className="inline-block bg-secondary-container text-on-secondary font-label-sm text-label-sm px-3 py-1 rounded-sm uppercase tracking-wider mb-4 border border-on-secondary">PROFIL</span>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg font-extrabold leading-tight uppercase">
                À PROPOS <br/>
                <span className="text-secondary-container">DE MOI.</span>
              </h1>
            </div>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
              {METIERS}
            </p>

            {/* Expertise Bento Grid (Using Vision & Mission here to perfectly map real data to new design) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              <div className="bg-surface text-on-surface p-6 rounded-lg border-2 border-primary hover:translate-y-[-4px] transition-transform shadow-lg">
                <div className="w-10 h-10 bg-primary-container text-on-primary rounded flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-[24px] mb-2 uppercase">Vision</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Être une référence africaine en matière de leadership, d'innovation, de créativité, de gestion de projet et de développement des talents.</p>
              </div>

              <div className="bg-surface text-on-surface p-6 rounded-lg border-2 border-primary hover:translate-y-[-4px] transition-transform shadow-lg">
                <div className="w-10 h-10 bg-secondary-container text-on-secondary rounded flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">flag</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-[24px] mb-2 uppercase">Mission</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Accompagner les jeunes, les organisations et les entreprises dans la création de projets innovants, le développement des compétences et la transformation digitale.</p>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-4 border-surface bg-surface shadow-lg z-20">
              <img alt="Portrait Chabel" className="w-full h-full object-cover" src={portraitImg} fetchPriority="high"/>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-container rounded-full z-10 blur-xl opacity-50"></div>
            <div className="absolute top-12 -right-8 w-24 h-24 border-4 border-on-primary rounded-full z-30 flex items-center justify-center bg-surface/90 backdrop-blur-md">
              <span className="font-label-sm text-label-sm text-on-surface text-center font-bold">ZOU<br/>BÉNIN</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
