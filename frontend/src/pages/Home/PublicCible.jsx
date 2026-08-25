// Public cible — ajouté le 2026-08-03.
// Permet au visiteur de se reconnaître dès l'accueil.
//
// Reprise LITTÉRALE d'infos.txt §5 : six familles de publics, chacune avec ses
// sous-catégories exactes. Rien n'est ajouté ni reformulé.
//
// Les six familles sont les mêmes que la segmentation du formulaire /contact
// (spec §D.12) : chaque carte renvoie vers /contact, ce qui donne au visiteur
// un chemin direct « je suis X → je vous écris ».
//
// Écart assumé à la spec §D.1 (accueil figé en R00–R07), validé par le client.
import { useRef } from 'react';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { SiteLink } from '../../components/ui/SiteLink';
import { useRevealStagger } from '../../motion';

const PUBLICS = [
  {
    famille: 'Institutions publiques',
    segment: 'INSTITUTION',
    details: ['Ministères', 'Collectivités territoriales', 'Mairies', 'Institutions de jeunesse'],
  },
  {
    famille: 'Organisations internationales',
    segment: 'ORGANISATION INTERNATIONALE',
    details: ['ONG', 'Agences de développement', 'Organisations de coopération'],
  },
  {
    famille: 'Entreprises',
    segment: 'ENTREPRISE',
    details: ['PME', 'Grandes entreprises', 'Start-up', 'Agences de communication'],
  },
  {
    famille: 'Jeunesse',
    segment: 'JEUNE PORTEUR DE PROJET',
    details: ['Étudiants', 'Jeunes entrepreneurs', 'Porteurs de projets', 'Créatifs', 'Associations'],
  },
  {
    famille: 'Partenaires',
    segment: 'PARTENAIRE',
    details: ['Sponsors', 'Investisseurs', 'Incubateurs', "Organisateurs d'événements"],
  },
  {
    famille: 'Médias',
    segment: 'MÉDIA',
    details: ['Presse', 'Télévision', 'Radio', 'Blogs', 'Influenceurs'],
  },
];

const ACCENTS = [
  { color: 'purple', border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple', bg: 'bg-purple-500', text: 'text-purple-600', pulse: 'dot-pulse-purple' },
  { color: 'emerald', border: 'border-emerald-200 hover:border-emerald-500', glow: 'glow-emerald', bg: 'bg-emerald-500', text: 'text-emerald-600', pulse: 'dot-pulse-emerald' },
  { color: 'cyan', border: 'border-cyan-200 hover:border-cyan-500', glow: 'glow-cyan', bg: 'bg-cyan-500', text: 'text-cyan-600', pulse: 'dot-pulse-cyan' },
  { color: 'amber', border: 'border-amber-200 hover:border-amber-500', glow: 'glow-amber', bg: 'bg-amber-500', text: 'text-amber-600', pulse: 'dot-pulse-amber' },
  { color: 'rose', border: 'border-rose-200 hover:border-rose-500', glow: 'glow-rose', bg: 'bg-rose-500', text: 'text-rose-600', pulse: 'dot-pulse-rose' },
  { color: 'teal', border: 'border-teal-200 hover:border-teal-500', glow: 'glow-cyan', bg: 'bg-teal-500', text: 'text-teal-600', pulse: 'dot-pulse-cyan' },
];

export function PublicCible() {
  const sectionRef = useConductorSection('public-cible', 'Public cible');
  const grilleRef = useRef(null);
  useRevealStagger(grilleRef, { itemCount: PUBLICS.length, distance: 56, stagger: 0.07 });

  return (
    <section ref={sectionRef} id="public-cible" className="scroll-mt-[6rem] py-24 bg-surface-container-low/50">
      <div className="max-w-7xl mx-auto px-margin">
        <SectionCartouche label="AVEC QUI JE TRAVAILLE" />

        <div ref={grilleRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PUBLICS.map(({ famille, segment, details }, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <SiteLink
                key={famille}
                href={`/contact?objet=collaboration&segment=${encodeURIComponent(segment)}`}
                data-reveal-item
                className={`group relative flex flex-col justify-between gap-4 rounded-2xl border bg-surface p-6 card-wave-glow ${accent.border} ${accent.glow} shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${accent.bg} ${accent.pulse}`} title={famille} />
                  </div>
                  <h3 className={`font-display text-xl font-bold leading-tight mb-2 group-hover:${accent.text} transition-colors`}>
                    {famille}
                  </h3>
                </div>
                <div className="pt-4 border-t border-outline-variant/40 flex flex-wrap gap-1.5">
                  {details.map((d) => (
                    <span key={d} className="text-xs px-2.5 py-1 rounded-md bg-surface-variant/80 text-on-surface-variant font-medium group-hover:bg-surface-variant transition-colors">
                      {d}
                    </span>
                  ))}
                </div>
              </SiteLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
