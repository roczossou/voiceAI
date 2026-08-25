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

const ACCENTS = [
  { border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple', num: 'text-purple-600' },
  { border: 'border-emerald-200 hover:border-emerald-500', glow: 'glow-emerald', num: 'text-emerald-600' },
  { border: 'border-cyan-200 hover:border-cyan-500', glow: 'glow-cyan', num: 'text-cyan-600' },
];

export function Histoire() {
  return (
    <section className="py-xl bg-gradient-to-b from-surface-container-lowest to-surface border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Section header */}
        <div className="mb-lg border-l-4 border-primary pl-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mon histoire</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Parcours, vision et motivations d'un créatif digital engagé.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-md items-start">
          {/* Text Content */}
          <div className="lg:col-span-8 flex flex-col gap-md">
            {PARAGRAPHES.map((texte, i) => {
              const acc = ACCENTS[i % ACCENTS.length];
              return (
                <div
                  key={i}
                  className={`bg-surface p-lg border ${acc.border} ${acc.glow} rounded-xl card-sheen-beam shadow-sm flex gap-md hover:-translate-y-1 transition-transform`}
                >
                  <span className={`font-headline-md text-[28px] font-bold shrink-0 ${acc.num} opacity-70`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface leading-relaxed flex-1 min-w-0">
                    {texte}
                  </p>
                </div>
              );
            })}

            <div className="bg-surface p-md rounded-xl border border-outline-variant/60 flex items-center gap-sm shadow-sm">
              <span className="material-symbols-outlined text-primary">auto_stories</span>
              <span className="font-label-bold text-body-sm text-on-surface-variant tracking-wider">
                Récit complet disponible sur demande
              </span>
            </div>
          </div>

          {/* Decorative side panel */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-surface border border-amber-200 rounded-xl p-lg glow-amber shadow-md flex flex-col gap-md">
              <div className="flex items-center gap-sm mb-xs">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">emoji_people</span>
                </div>
                <h3 className="font-headline-md text-body-lg font-bold text-on-surface">En bref</h3>
              </div>
              {[
                { icon: 'place', label: 'Covè, Bénin' },
                { icon: 'work', label: 'Entrepreneur & Créatif' },
                { icon: 'school', label: 'Licence Maintenance Industrielle' },
                { icon: 'star', label: '5+ années d\'expérience' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-sm border-b border-amber-100 pb-sm last:border-0">
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">{icon}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
