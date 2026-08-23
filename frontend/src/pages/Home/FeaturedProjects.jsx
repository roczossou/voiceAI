import React from 'react';
import { Link } from 'react-router-dom';

const PROJECTS = [
  {
    title: 'ANDROCRÉA',
    href: '/androcrea',
    tags: ['FORMATION', 'DIGITAL', 'CRÉATIVITÉ MOBILE'],
    summary: "Former une nouvelle génération de créatifs capables d'utiliser les technologies numériques pour développer leur carrière.",
    stencil: false,
    bgClass: 'bg-on-background',
    colSpan: 'md:col-span-2 md:row-span-2',
    textHover: 'group-hover:text-secondary-container'
  },
  {
    title: "DIGIT'S CRÉA AWARDS",
    href: '/digits-crea-awards',
    tags: ['ÉVÉNEMENTIEL', 'DIGITAL', 'VALORISATION DES TALENTS'],
    summary: 'Événement dédié à la valorisation des talents créatifs à travers un dispositif digital et événementiel.',
    stencil: true,
    bgClass: 'bg-primary',
    colSpan: 'md:col-span-2 md:row-span-1',
    textHover: 'hover:text-secondary-container'
  },
  {
    title: 'MAIRIE DES JEUNES DE COVÈ',
    href: '/leadership',
    tags: ['LEADERSHIP', 'ENGAGEMENT CITOYEN'],
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
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background mb-16 uppercase text-center md:text-left">PROJETS EN AVANT</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-gutter h-auto md:h-[800px]">
          
          {PROJECTS.map((project, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            if (isFirst) {
              return (
                <div key={project.href} className={`${project.colSpan} relative group overflow-hidden ${project.bgClass}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/80 to-transparent z-0"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end z-10">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {project.tags.map((tag, i) => (
                        <span key={tag} className={`${i===0 ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface'} font-label-sm text-label-sm px-3 py-1 uppercase`}>{tag}</span>
                      ))}
                    </div>
                    <h3 className={`font-headline-lg text-headline-lg text-on-primary mb-2 transition-colors ${project.textHover}`}>{project.title}</h3>
                    <p className="font-body-md text-body-md text-on-primary-container mb-4 max-w-md">{project.summary}</p>
                    <Link to={project.href} className="inline-flex items-center gap-2 font-label-lg text-label-lg text-primary-fixed hover:text-white transition-colors">
                      EN SAVOIR PLUS <span className="material-symbols-outlined">arrow_outward</span>
                    </Link>
                  </div>
                </div>
              );
            }

            if (isSecond) {
              return (
                <div key={project.href} className={`${project.colSpan} relative group overflow-hidden ${project.bgClass}`}>
                  <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map(tag => (
                        <span key={tag} className="bg-secondary-container text-on-background font-label-sm text-label-sm px-3 py-1 uppercase">{tag}</span>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-primary mb-2">{project.title}</h3>
                      <p className="font-body-md text-body-md text-on-primary-container mb-4">{project.summary}</p>
                      <Link to={project.href} className={`inline-flex items-center gap-2 font-label-lg text-label-lg text-on-primary transition-colors ${project.textHover}`}>
                        EN SAVOIR PLUS <span className="material-symbols-outlined">arrow_outward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (isThird) {
              return (
                <div key={project.href} className={`${project.colSpan} relative group overflow-hidden ${project.bgClass}`}>
                  <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 bg-gradient-to-t from-surface via-surface/80 to-transparent">
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map(tag => (
                         <span key={tag} className="inline-block bg-on-background text-on-primary font-label-sm text-label-sm px-3 py-1 uppercase self-start">{tag}</span>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-background mb-2">{project.title}</h3>
                      <p className="font-body-sm text-body-md text-on-surface-variant max-w-xs">{project.summary}</p>
                      <Link to={project.href} className="inline-flex items-center gap-2 font-label-lg text-label-lg text-primary transition-colors mt-2">
                        DÉTAILS <span className="material-symbols-outlined">arrow_outward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}

          {/* Project 4: Bottom Right Callout */}
          <Link to="/projets" className="md:col-span-1 md:row-span-1 bg-secondary-container p-8 flex flex-col justify-center items-center text-center hover:bg-on-background hover:text-secondary-container transition-colors group cursor-pointer">
            <span className="material-symbols-outlined text-[48px] mb-4 text-on-background group-hover:text-secondary-container transition-colors">grid_view</span>
            <h3 className="font-headline-md text-headline-md text-on-background group-hover:text-on-primary transition-colors mb-2">TOUS LES PROJETS</h3>
            <p className="font-body-md text-body-md text-on-background/80 group-hover:text-on-primary/80">Explorer les archives</p>
          </Link>

        </div>
      </div>
    </section>
  );
}
