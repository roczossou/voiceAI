import React from 'react';
import portraitImg from '../../assets/portrait-cutout.png';

const METIERS = [
  'Entrepreneur',
  'Leader jeunesse',
  'Gestionnaire de projet',
  'Planificateur d’événements',
  'Créatif digital'
];

export function AProposHero() {
  return (
    <section className="relative w-full min-h-[90vh] py-24 flex items-center bg-primary overflow-hidden">
      {/* Background Watermark & Animated Glow Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-display-lg font-black text-white/5 whitespace-nowrap pointer-events-none select-none z-0">
        PARCOURS
      </div>
      <div className="absolute top-[5%] right-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-purple-500/20 via-cyan-500/20 to-amber-500/20 rounded-full blur-3xl animate-spin-slow pointer-events-none z-0" />

      {/* Asymmetric Color Block / Backdrop */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-secondary-container/20 backdrop-blur-3xl hidden lg:block transform -skew-x-12 translate-x-16 z-0"></div>

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10 w-full mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Text Content */}
          <div className="lg:col-span-7 text-on-primary space-y-8">
            <div className="hero-anim-badge">
              <span className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary font-label-sm text-label-sm px-4 py-1.5 rounded-full tracking-widest border border-black/20 shadow-md">
                {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 dot-pulse-emerald inline-block" /> */}
                <span>PROFIL &amp; VISION</span>
              </span>
            </div>

            <div className="hero-anim-title">
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg font-extrabold leading-tight">
                À propos <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-secondary-container to-purple-300">de moi</span>
              </h1>
            </div>

            {/* Badges métiers fluides avec accents colorés réactifs */}
            <div className="hero-anim-text flex flex-wrap items-center gap-2 pt-2">
              {METIERS.map((metier, idx) => {
                const colors = [
                  'bg-purple-500/10 text-purple-200 border-purple-400/30 hover:bg-purple-500/20',
                  'bg-emerald-500/10 text-emerald-200 border-emerald-400/30 hover:bg-emerald-500/20',
                  'bg-cyan-500/10 text-cyan-200 border-cyan-400/30 hover:bg-cyan-500/20',
                  'bg-amber-500/10 text-amber-200 border-amber-400/30 hover:bg-amber-500/20',
                  'bg-rose-500/10 text-rose-200 border-rose-400/30 hover:bg-rose-500/20',
                ];
                const colorClass = colors[idx % colors.length];
                return (
                  <React.Fragment key={metier}>
                    <span className={`${colorClass} border px-4 py-2 rounded-full font-medium text-sm md:text-base whitespace-nowrap backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-sm`}>
                      {metier}
                    </span>
                    {idx < METIERS.length - 1 && (
                      <span className="text-secondary-container font-bold text-xs hidden sm:inline">•</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Vision & Mission Bento Cards avec card-sheen-beam */}
            <div className="hero-anim-btn grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-surface text-on-surface p-6 rounded-2xl border border-purple-200 card-sheen-beam glow-purple transition-all shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">visibility</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-purple-500 dot-pulse-purple" /> */}
                </div>
                <h3 className="font-headline-md text-headline-md text-[22px] font-bold mb-2 text-on-surface">Vision</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Être une référence africaine en matière de leadership, d'innovation, de créativité, de gestion de projet et de développement des talents.</p>
              </div>

              <div className="bg-surface text-on-surface p-6 rounded-2xl border border-emerald-200 card-sheen-beam glow-emerald transition-all shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">flag</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dot-pulse-emerald" /> */}
                </div>
                <h3 className="font-headline-md text-headline-md text-[22px] font-bold mb-2 text-on-surface">Mission</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Accompagner les jeunes, les organisations et les entreprises dans la création de projets innovants, le développement des compétences et la transformation digitale.</p>
              </div>
            </div>
          </div>

          {/* Image Content avec Flottaison 3D */}
          <div className="hero-anim-portrait lg:col-span-5 relative mt-12 lg:mt-0">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-4 border-surface bg-surface shadow-2xl z-20 animate-hero-float">
              <img alt="Portrait Chabel" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src={portraitImg} fetchPriority="high" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-container rounded-full z-10 blur-xl opacity-60"></div>
            <div className="absolute top-12 -right-6 w-24 h-24 border-2 border-black/20 rounded-full z-30 flex items-center justify-center bg-surface/90 backdrop-blur-md shadow-2xl">
              <span className="font-label-sm text-label-sm text-on-surface text-center font-bold">ZOU<br />BÉNIN</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
