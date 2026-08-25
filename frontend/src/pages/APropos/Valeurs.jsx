import React from 'react';

const VALEURS = [
  { nom: 'Excellence', definition: 'Le travail livré doit tenir devant un jury.', icon: 'workspace_premium', accent: 'purple' },
  { nom: 'Leadership', definition: 'Décider, assumer, entraîner.', icon: 'groups', accent: 'emerald' },
  { nom: 'Innovation', definition: "Chercher la solution qui n'existe pas encore ici.", icon: 'lightbulb', accent: 'cyan' },
  { nom: 'Créativité', definition: "Trouver l'angle que personne n'a vu.", icon: 'brush', accent: 'amber' },
  { nom: 'Discipline', definition: 'Les délais sont une promesse.', icon: 'schedule', accent: 'purple' },
  { nom: 'Intégrité', definition: 'Dire ce qui est, même quand ça coûte.', icon: 'verified', accent: 'emerald' },
  { nom: 'Engagement', definition: 'Un projet commencé est un projet terminé.', icon: 'flag', accent: 'cyan' },
  { nom: 'Impact', definition: 'Ce qui ne change rien ne compte pas.', icon: 'bolt', accent: 'amber' },
  { nom: 'Collaboration', definition: 'Aucune initiative sérieuse ne se porte seul.', icon: 'handshake', accent: 'purple' },
  { nom: 'Responsabilité', definition: 'Répondre de ses choix devant ceux qui suivent.', icon: 'balance', accent: 'emerald' },
  { nom: 'Vision', definition: "Travailler pour dans cinq ans, agir aujourd'hui.", icon: 'visibility', accent: 'cyan' },
  { nom: 'Professionnalisme', definition: 'Le sérieux se voit dans les détails.', icon: 'stars', accent: 'amber' },
];

const ACCENT_MAP = {
  purple: {
    border: 'border-purple-200 hover:border-purple-500',
    glow: 'glow-purple',
    iconBg: 'bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
    title: 'group-hover:text-purple-600',
  },
  emerald: {
    border: 'border-emerald-200 hover:border-emerald-500',
    glow: 'glow-emerald',
    iconBg: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    title: 'group-hover:text-emerald-600',
  },
  cyan: {
    border: 'border-cyan-200 hover:border-cyan-500',
    glow: 'glow-cyan',
    iconBg: 'bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
    title: 'group-hover:text-cyan-600',
  },
  amber: {
    border: 'border-amber-200 hover:border-amber-500',
    glow: 'glow-amber',
    iconBg: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    title: 'group-hover:text-amber-600',
  },
};

export function Valeurs() {
  return (
    <section className="py-xl bg-gradient-to-b from-surface to-surface-container-low border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Section header */}
        <div className="mb-lg border-l-4 border-primary pl-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mes valeurs</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Les principes qui guident chacune de mes décisions et réalisations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
          {VALEURS.map(({ nom, definition, icon, accent }) => {
            const acc = ACCENT_MAP[accent];
            return (
              <div
                key={nom}
                className={`group bg-surface border ${acc.border} ${acc.glow} rounded-xl p-lg card-sheen-beam shadow-sm flex flex-col gap-sm transition-all duration-300 hover:-translate-y-1 cursor-default`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${acc.iconBg}`}>
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <h3 className={`font-headline-md text-body-lg font-bold text-on-surface transition-colors ${acc.title}`}>
                  {nom}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  {definition}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
