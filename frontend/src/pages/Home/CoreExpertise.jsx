import React from 'react';
import { Link } from 'react-router-dom';

export function CoreExpertise() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto bg-surface">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 w-full">
        <div className="w-full md: shrink-0 relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-teal-500/10 blur-2xl rounded-full z-0"></div>
          <div className="relative z-10 border-l-4 border-primary pl-6 py-2">
            <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background mb-4 leading-none">
              Domaines <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-amber-500">d'expertise</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant w-full max-w-lg leading-relaxed">
              Des solutions créatives, techniques et stratégiques pour transformer chaque idée en puissance d'impact.
            </p>
          </div>
        </div>
        <Link to="/services" className="font-label-lg text-label-lg font-bold text-white bg-primary hover:bg-primary/90 px-6 py-3.5 rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap">
          <span>Voir tous les services</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Service 1 : Créativité Digitale (Thème Cyan & Émeraude) */}
        <div className="bg-surface border border-outline-variant/80 rounded-2xl p-8 card-extravagant card-shine glow-cyan flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 rounded-xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-[32px]">design_services</span>
              </div>
              {/* <span className="w-3 h-3 rounded-full bg-cyan-500 dot-pulse-cyan" title="Activité Créative" /> */}
            </div>
            <h3 className="font-headline-md text-headline-md text-on-background mb-4 group-hover:text-cyan-600 transition-colors">Créativité Digitale</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Des visuels percutants, des interfaces UI/UX captivantes et une identité de marque mémorable.</p>
          </div>
          <ul className="space-y-3 font-body-md text-body-md text-on-background pt-4 border-t border-outline-variant/50">
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-cyan-500 text-[20px]">check_circle</span> Design graphique &amp; UI/UX</li>
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-cyan-500 text-[20px]">check_circle</span> Identité visuelle &amp; Branding</li>
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-cyan-500 text-[20px]">check_circle</span> Communication digitale</li>
          </ul>
        </div>

        {/* Service 2 : Gestion de Projet (Thème Ambre & Or) */}
        <div className="bg-gradient-to-br from-inverse-surface via-slate-900 to-black text-white border border-amber-500/30 rounded-2xl p-8 card-extravagant card-shine glow-amber flex flex-col justify-between group relative overflow-hidden shadow-2xl">
          {/* Tag Focus Ambre */}
          <div className="absolute top-5 right-5 bg-amber-500 text-slate-950 font-label-bold text-[10px] py-1 px-3 rounded-full font-extrabold tracking-wider flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            FOCUS CŒUR
          </div>
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                <span className="material-symbols-outlined text-[32px]">account_tree</span>
              </div>
            </div>
            <h3 className="font-headline-md text-headline-md text-white mb-4 group-hover:text-amber-400 transition-colors">Gestion de Projet</h3>
            <p className="font-body-md text-body-md text-slate-300 mb-6">Coordination rigoureuse et suivi stratégique pour transformer vos idées en résultats concrets.</p>
          </div>
          <ul className="space-y-3 font-body-md text-body-md text-slate-200 pt-4 border-t border-white/10">
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-amber-400 text-[20px]">check_circle</span> Planification stratégique</li>
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-amber-400 text-[20px]">check_circle</span> Événementiel grand public</li>
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-amber-400 text-[20px]">check_circle</span> Suivi, Évaluation &amp; Agilité</li>
          </ul>
        </div>

        {/* Service 3 : Leadership (Thème Violet Électrique) */}
        <div className="bg-surface border border-outline-variant/80 rounded-2xl p-8 card-extravagant card-shine glow-purple flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-[32px]">groups</span>
              </div>
              <span className="w-3 h-3 rounded-full bg-purple-500 dot-pulse-purple" title="Impact & Leadership" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-background mb-4 group-hover:text-purple-600 transition-colors">Leadership</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Accompagnement, ateliers de facilitation et développement des talents pour maximiser l'impact.</p>
          </div>
          <ul className="space-y-3 font-body-md text-body-md text-on-background pt-4 border-t border-outline-variant/50">
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-purple-500 text-[20px]">check_circle</span> Formation &amp; Facilitation d'ateliers</li>
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-purple-500 text-[20px]">check_circle</span> Gouvernance &amp; Engagement jeunesse</li>
            <li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-purple-500 text-[20px]">check_circle</span> Coaching &amp; Développement personnel</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
