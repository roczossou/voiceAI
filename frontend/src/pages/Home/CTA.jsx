import React from 'react';
import { Link } from 'react-router-dom';

const CTA_LINKS = [
  { label: 'Collaborer', objet: 'collaboration' },
  { label: 'Demander un devis', objet: 'devis' },
  { label: 'Réserver une formation', objet: 'formation' },
  { label: 'Proposer un partenariat', objet: 'partenariat' },
];

export function CTA() {
  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop bg-primary text-center relative overflow-hidden">
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/20 via-cyan-500/20 to-amber-500/20 rounded-full blur-3xl animate-spin-slow pointer-events-none z-0" />
      <div className="max-w-4xl mx-auto relative z-10 bg-surface border border-purple-300/40 glow-purple rounded-3xl p-12 md:p-20 shadow-2xl card-sheen-beam">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background mb-10 leading-none">
          Travaillons <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-secondary-container to-purple-600">ensemble</span>
        </h2>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {CTA_LINKS.map(({ label, objet }, index) => {
            const isPrimary = index === 0;
            if (isPrimary) {
              return (
                <Link key={objet} to={`/contact?objet=${objet}`} className="bg-secondary-container text-on-secondary font-label-lg text-label-lg px-8 py-4 rounded-2xl border border-amber-400/40 hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg shadow-md font-bold">
                  {label}
                  <span className="material-symbols-outlined">send</span>
                </Link>
              );
            }
            return (
              <Link key={objet} to={`/contact?objet=${objet}`} className="bg-surface text-on-surface font-label-lg text-label-lg px-8 py-4 rounded-2xl border border-outline-variant hover:border-primary hover:scale-105 transition-all font-bold shadow-xs">
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
