import React from 'react';

const VALEURS = [
  { nom: 'EXCELLENCE', definition: 'Le travail livré doit tenir devant un jury.', icon: 'workspace_premium' },
  { nom: 'LEADERSHIP', definition: 'Décider, assumer, entraîner.', icon: 'groups' },
  { nom: 'INNOVATION', definition: "Chercher la solution qui n'existe pas encore ici.", icon: 'lightbulb' },
  { nom: 'CRÉATIVITÉ', definition: "Trouver l'angle que personne n'a vu.", icon: 'brush' },
  { nom: 'DISCIPLINE', definition: 'Les délais sont une promesse.', icon: 'schedule' },
  { nom: 'INTÉGRITÉ', definition: 'Dire ce qui est, même quand ça coûte.', icon: 'verified' },
  { nom: 'ENGAGEMENT', definition: 'Un projet commencé est un projet terminé.', icon: 'flag' },
  { nom: 'IMPACT', definition: 'Ce qui ne change rien ne compte pas.', icon: 'bolt' },
  { nom: 'COLLABORATION', definition: 'Aucune initiative sérieuse ne se porte seul.', icon: 'handshake' },
  { nom: 'RESPONSABILITÉ', definition: 'Répondre de ses choix devant ceux qui suivent.', icon: 'balance' },
  { nom: 'VISION', definition: "Travailler pour dans cinq ans, agir aujourd'hui.", icon: 'visibility' },
  { nom: 'PROFESSIONNALISME', definition: 'Le sérieux se voit dans les détails.', icon: 'stars' },
];

export function Valeurs() {
  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop bg-background">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-background mb-16 uppercase text-center">MES VALEURS</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          {VALEURS.map(({ nom, definition, icon }, i) => {
            const isOrange = i % 4 === 1;
            const isBlue = i % 4 === 3;
            const bgClass = isOrange ? 'bg-secondary-container group-hover:bg-secondary' : isBlue ? 'bg-primary group-hover:bg-primary-container' : 'bg-surface group-hover:bg-surface-container';
            const textClass = isOrange ? 'text-on-background' : isBlue ? 'text-on-primary' : 'text-on-background';
            const iconBg = isOrange ? 'bg-on-background text-secondary-container' : isBlue ? 'bg-secondary-container text-on-background' : 'bg-primary text-on-primary';

            return (
              <div key={nom} className={`group relative min-h-[180px] ${bgClass} p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-md cursor-default`}>
                <div className={`w-10 h-10 ${iconBg} rounded flex items-center justify-center mb-3`}>
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <h3 className={`font-headline-md text-[20px] font-bold uppercase leading-none mb-2 ${textClass}`}>{nom}</h3>
                <p className={`font-body-md text-body-md leading-snug ${textClass} opacity-80`}>{definition}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
