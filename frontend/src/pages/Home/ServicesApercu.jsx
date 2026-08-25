import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchServices } from '../../api/client';

const GROUPES = [
  { key: 'services_digitaux', label: 'SERVICES DIGITAUX', icon: 'design_services' },
  { key: 'gestion_de_projet', label: 'GESTION DE PROJET', icon: 'assignment' },
  { key: 'evenementiel', label: 'ÉVÉNEMENTIEL', icon: 'celebration' },
  { key: 'formation', label: 'FORMATION', icon: 'school' },
  { key: 'conseil', label: 'CONSEIL', icon: 'lightbulb' },
];

export function ServicesApercu() {
  const { data: services = [], status } = useQuery({ queryKey: ['services'], queryFn: fetchServices });

  if (status !== 'success' || services.length === 0) return null;

  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto bg-background">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="">
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">Ce que je prends en charge </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Des prestations adaptées à vos besoins pour transformer vos idées en projets concrets et impactants.</p>
        </div>
        <Link to="/services" className="font-label-lg text-label-lg text-primary border-b-2 border-primary pb-1 hover:text-secondary-container transition-colors whitespace-nowrap">VOIR TOUTES LES PRESTATIONS</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {GROUPES.map(({ key, label, icon }, index) => {
          const items = services.filter((s) => s.groupe === key);
          if (items.length === 0) return null;

          const isFocus = index === 1; // Arbitrary focus for design matching
          const containerClasses = isFocus
            ? "bg-surface p-8 hover:shadow-lg transition-all group relative overflow-hidden"
            : "bg-surface p-8 hover:shadow-lg transition-all group";

          const iconClasses = isFocus
            ? "w-16 h-16 bg-secondary-container text-on-background flex items-center justify-center mb-8"
            : "w-16 h-16 bg-primary-container text-on-primary-container flex items-center justify-center mb-8";

          const hoverTitleClass = isFocus ? "group-hover:text-secondary-container" : "group-hover:text-primary";
          const checkIconClass = isFocus ? "text-secondary-container" : "text-primary";

          return (
            <div key={key} className={containerClasses}>
              {isFocus && (
                <div className="absolute top-4 right-[-32px] bg-secondary-container text-on-background font-label-sm text-label-sm py-1 px-10 transform rotate-45">Focus</div>
              )}
              <div className={iconClasses}>
                <span className="material-symbols-outlined text-[32px]">{icon}</span>
              </div>
              <h3 className={`font-headline-md text-headline-md text-on-background mb-4 transition-colors ${hoverTitleClass}`}>{label}</h3>
              <ul className="space-y-3 font-body-md text-body-md text-on-background">
                {items.slice(0, 4).map(item => (
                  <li key={item.titre} className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[20px] ${checkIconClass}`}>check_circle</span>
                    {item.titre}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
