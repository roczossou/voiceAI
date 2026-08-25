import React from 'react';
import { Link } from 'react-router-dom';

const PROJECTS = [
  {
    title: 'AndroCréa',
    href: '/androcrea',
    tags: ['Formation', 'Digital', 'Créativité mobile'],
    summary: "Former une nouvelle génération de créatifs capables d'utiliser les technologies numériques pour développer leur carrière.",
    stencil: false,
    bgClass: 'bg-on-background',
    colSpan: 'md:col-span-2 md:row-span-2',
    textHover: 'group-hover:text-secondary-container'
  },
  {
    title: "Digit's Créa Awards",
    href: '/digits-crea-awards',
    tags: ['Événementiel', 'Digital', 'Valorisation des talents'],
    summary: 'Événement dédié à la valorisation des talents créatifs à travers un dispositif digital et événementiel.',
    stencil: true,
    bgClass: 'bg-primary',
    colSpan: 'md:col-span-2 md:row-span-1',
    textHover: 'hover:text-secondary-container'
  },
  {
    title: 'Mairie des jeunes de Covè',
    href: '/leadership',
    tags: ['Leadership', 'Engagement citoyen'],
    summary: 'Mandat citoyen au service de la jeunesse de Covè : actions communautaires, initiatives citoyennes et dialogue avec les institutions.',
    stencil: false,
    bgClass: 'bg-surface',
    colSpan: 'md:col-span-1 md:row-span-1',
    textHover: ''
  },
];

export function FeaturedProjects() {
  return (
    <section className="py-32 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background mb-16 text-center md:text-left">Projets en avant</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[800px]">

          {PROJECTS.map((project, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            if (isFirst) {
              return (
                <div key={project.href} className={`${project.colSpan} relative group overflow-hidden ${project.bgClass} rounded-2xl border border-purple-500/30 glow-purple card-parallax-zoom shadow-xl`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/80 to-transparent z-0"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end z-10">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {project.tags.map((tag, i) => (
                        <span key={tag} className={`${i === 0 ? 'bg-purple-600 text-white' : 'bg-surface text-on-surface'} font-label-sm text-label-sm px-3.5 py-1 rounded-full font-bold shadow-xs `}>{tag}</span>
                      ))}
                    </div>
                    <h3 className={`font-headline-lg text-headline-lg text-on-primary mb-2 transition-colors ${project.textHover}`}>{project.title}</h3>
                    <p className="font-body-md text-body-md text-on-primary-container mb-4 ">{project.summary}</p>
                    <Link to={project.href} className="inline-flex items-center gap-2 font-label-lg text-label-lg text-amber-400 font-bold hover:text-white transition-colors">
                      En savoir plus <span className="material-symbols-outlined">arrow_outward</span>
                    </Link>
                  </div>
                </div>
              );
            }

            if (isSecond) {
              return (
                <div key={project.href} className={`${project.colSpan} relative group overflow-hidden ${project.bgClass} rounded-2xl border border-emerald-500/30 glow-emerald card-parallax-zoom shadow-xl`}>
                  <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map(tag => (
                        <span key={tag} className="bg-emerald-600 text-white font-label-sm text-label-sm px-3.5 py-1 rounded-full font-bold shadow-xs ">{tag}</span>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-primary mb-2 font-bold">{project.title}</h3>
                      <p className="font-body-md text-body-md text-on-primary-container mb-4">{project.summary}</p>
                      <Link to={project.href} className={`inline-flex items-center gap-2 font-label-lg text-label-lg text-amber-400 font-bold transition-colors ${project.textHover}`}>
                        En savoir plus <span className="material-symbols-outlined">arrow_outward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (isThird) {
              return (
                <div key={project.href} className={`${project.colSpan} relative group overflow-hidden ${project.bgClass} rounded-2xl border border-cyan-500/30 glow-cyan card-parallax-zoom shadow-xl`}>
                  <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 bg-gradient-to-t from-surface via-surface/80 to-transparent">
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map(tag => (
                        <span key={tag} className="inline-block bg-cyan-600 text-white font-label-sm text-label-sm px-3.5 py-1 rounded-full font-bold shadow-xs self-start">{tag}</span>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-background mb-2 font-bold">{project.title}</h3>
                      <p className="font-body-sm text-body-md text-on-surface-variant max-w-xs">{project.summary}</p>
                      <Link to={project.href} className="inline-flex items-center gap-2 font-label-lg text-label-lg text-primary font-bold transition-colors mt-2">
                        Détails <span className="material-symbols-outlined">arrow_outward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}

          {/* Project 4: Bottom Right Callout */}
          <Link to="/projets" className="md:col-span-1 md:row-span-1 bg-secondary-container rounded-2xl border border-amber-400/40 glow-amber p-8 flex flex-col justify-center items-center text-center hover:scale-[1.03] transition-all group cursor-pointer shadow-xl">
            <span className="material-symbols-outlined text-[48px] mb-4 text-on-secondary group-hover:scale-110 transition-transform">grid_view</span>
            <h3 className="font-headline-md text-headline-md text-on-secondary font-bold mb-2">Tous les projets</h3>
            <p className="font-body-md text-body-md text-on-secondary/80">Explorer les archives</p>
          </Link>

        </div>
      </div>
    </section>
  );
}
