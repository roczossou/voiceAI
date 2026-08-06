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
    famille: 'INSTITUTIONS PUBLIQUES',
    segment: 'INSTITUTION',
    details: ['Ministères', 'Collectivités territoriales', 'Mairies', 'Institutions de jeunesse'],
  },
  {
    famille: 'ORGANISATIONS INTERNATIONALES',
    segment: 'ORGANISATION INTERNATIONALE',
    details: ['ONG', 'Agences de développement', 'Organisations de coopération'],
  },
  {
    famille: 'ENTREPRISES',
    segment: 'ENTREPRISE',
    details: ['PME', 'Grandes entreprises', 'Start-up', 'Agences de communication'],
  },
  {
    famille: 'JEUNESSE',
    segment: 'JEUNE PORTEUR DE PROJET',
    details: ['Étudiants', 'Jeunes entrepreneurs', 'Porteurs de projets', 'Créatifs', 'Associations'],
  },
  {
    famille: 'PARTENAIRES',
    segment: 'PARTENAIRE',
    details: ['Sponsors', 'Investisseurs', 'Incubateurs', "Organisateurs d'événements"],
  },
  {
    famille: 'MÉDIAS',
    segment: 'MÉDIA',
    details: ['Presse', 'Télévision', 'Radio', 'Blogs', 'Influenceurs'],
  },
];

export function PublicCible() {
  const sectionRef = useConductorSection('public-cible', 'Public cible');
  const grilleRef = useRef(null);
  useRevealStagger(grilleRef, { itemCount: PUBLICS.length, distance: 56, stagger: 0.07 });

  return (
    <section ref={sectionRef} id="public-cible" className="scroll-mt-[6rem] py-[var(--space-24)]">
      <div className="container">
        <SectionCartouche label="AVEC QUI JE TRAVAILLE" />

        <div ref={grilleRef} className="grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
          {PUBLICS.map(({ famille, segment, details }, i) => (
            <SiteLink
              key={famille}
              href={`/contact?objet=collaboration&segment=${encodeURIComponent(segment)}`}
              data-reveal-item
              className="group relative flex flex-col gap-[var(--space-4)] overflow-hidden border-[length:var(--bd)] border-[color:var(--bordure)] p-[var(--space-6)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 z-0 origin-left scale-x-0 bg-[var(--jaune-signal)] transition-transform duration-[200ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              <span className="relative z-10 font-mono text-[length:var(--fs-mono)] tracking-[.1em] opacity-55">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="relative z-10 font-[family-name:var(--font-display)] text-[1.375rem] font-bold uppercase leading-[1.05]">
                {famille}
              </span>
              <span className="relative z-10 font-mono text-[length:var(--fs-mono)] uppercase leading-[1.9] tracking-[.04em] opacity-70">
                {details.join(' · ')}
              </span>
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  );
}
