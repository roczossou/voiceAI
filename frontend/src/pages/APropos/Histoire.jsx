import React from 'react';

const PARAGRAPHES = [
  `Je suis Chabel ANANOUNON, entrepreneur, leader jeunesse, gestionnaire de
  projet, planificateur d'événements et créatif digital béninois. Ma passion
  pour l'innovation, la créativité et le leadership m'a conduit à développer
  plusieurs initiatives visant à accompagner les jeunes, promouvoir les
  talents et créer des opportunités durables grâce au numérique.`,
  `Convaincu que la jeunesse africaine constitue la plus grande richesse du
  continent, je mets mes compétences au service de projets innovants qui
  favorisent l'éducation, l'entrepreneuriat, la transformation digitale et le
  développement des compétences.`,
  `Mon ambition est de contribuer à bâtir une nouvelle génération de leaders
  capables d'utiliser la technologie, la créativité et l'innovation comme
  moteurs du développement économique et social.`,
].map((p) => p.replace(/\s+/g, ' ').trim());

export function Histoire() {
  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background mb-16 uppercase text-center md:text-left">MON HISTOIRE</h2>
        
        <div className="grid lg:grid-cols-12 gap-gutter items-start">
          {/* Text Content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {PARAGRAPHES.map((texte, i) => (
              <div key={i} className="bg-surface p-8 border-2 border-primary shadow-lg flex gap-6 hover:-translate-y-1 transition-transform">
                <span className="font-headline-md text-primary text-[32px] font-bold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-body-lg text-body-lg text-on-background leading-relaxed">
                  {texte}
                </p>
              </div>
            ))}
            <div className="bg-primary-container text-on-primary-container p-6 border-2 border-primary mt-4 font-label-sm uppercase tracking-wider text-center">
              RÉCIT COMPLET — &lt;CONTENU À FOURNIR PAR CHABEL&gt;
            </div>
          </div>

          {/* Placeholder Image */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="w-full aspect-[4/5] bg-surface border-4 border-secondary-container shadow-lg flex items-center justify-center p-8 text-center group overflow-hidden">
               <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
               <span className="relative font-label-lg uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors">
                 PORTRAIT SECONDAIRE — &lt;NON FOURNI&gt;
               </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
