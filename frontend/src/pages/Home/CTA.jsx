import React from 'react';
import { Link } from 'react-router-dom';

const CTA_LINKS = [
  { label: 'COLLABORER', objet: 'collaboration' },
  { label: 'DEMANDER UN DEVIS', objet: 'devis' },
  { label: 'RÉSERVER UNE FORMATION', objet: 'formation' },
  { label: 'PROPOSER UN PARTENARIAT', objet: 'partenariat' },
];

export function CTA() {
  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop bg-primary text-center border-b-[16px] border-secondary-container relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 bg-surface p-12 md:p-20 shadow-lg">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background mb-10 uppercase leading-none">
          TRAVAILLONS <br/> <span className="text-primary">ENSEMBLE</span>
        </h2>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {CTA_LINKS.map(({ label, objet }, index) => {
            const isPrimary = index === 0;
            if (isPrimary) {
              return (
                <Link key={objet} to={`/contact?objet=${objet}`} className="bg-secondary-container text-on-background font-label-lg text-label-lg px-8 py-5 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg hover:bg-secondary shadow-md">
                  {label}
                  <span className="material-symbols-outlined">send</span>
                </Link>
              );
            }
            return (
              <Link key={objet} to={`/contact?objet=${objet}`} className="bg-transparent text-on-background font-label-lg text-label-lg px-8 py-5 border-2 border-primary hover:bg-primary hover:text-on-primary transition-all">
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
