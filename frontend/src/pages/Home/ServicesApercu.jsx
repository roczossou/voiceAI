// Aperçu des services sur l'accueil — ajouté le 2026-08-03.
// L'accueil ne disait nulle part ce que Chabel prend en charge : c'était le
// manque le plus net avant cet ajout.
//
// Les prestations viennent de /api/services/ (25 lignes réelles, semées par
// migration depuis le contenu littéral du dossier §D.4). Aucune n'est écrite
// en dur ici : si le back-office en ajoute une, elle apparaît.
//
// Écart assumé à la spec §D.1 (accueil figé en R00–R07), validé par le client.
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { ButtonTertiaire } from '../../components/ui/Button';
import { SiteLink } from '../../components/ui/SiteLink';
import { useRevealStagger } from '../../motion';
import { fetchServices } from '../../api/client';

// Mêmes clés et libellés que la page /services, pour que l'ordre du dossier
// soit respecté (l'API trie par nom de groupe, pas dans cet ordre-là).
const GROUPES = [
  { key: 'services_digitaux', label: 'SERVICES DIGITAUX' },
  { key: 'gestion_de_projet', label: 'GESTION DE PROJET' },
  { key: 'evenementiel', label: 'ÉVÉNEMENTIEL' },
  { key: 'formation', label: 'FORMATION' },
  { key: 'conseil', label: 'CONSEIL' },
];

export function ServicesApercu() {
  const sectionRef = useConductorSection('services-apercu', 'Services');
  const grilleRef = useRef(null);
  const { data: services = [], status } = useQuery({ queryKey: ['services'], queryFn: fetchServices });
  useRevealStagger(grilleRef, { itemCount: services.length, distance: 56, stagger: 0.08 });

  // Section entièrement omise si l'API ne renvoie rien : pas de grille vide.
  if (status !== 'success' || services.length === 0) return null;

  return (
    <section ref={sectionRef} id="services-apercu" className="scroll-mt-[6rem] bg-[var(--calque-clair)] py-[var(--space-24)]">
      <div className="container">
        <SectionCartouche label="CE QUE JE PRENDS EN CHARGE" />

        <div
          ref={grilleRef}
          className="grid border-l-[length:var(--trait)] border-t-[length:var(--trait)] border-[color:var(--bordure)] sm:grid-cols-2 lg:grid-cols-3"
        >
          {GROUPES.map(({ key, label }) => {
            const items = services.filter((s) => s.groupe === key);
            if (items.length === 0) return null;

            return (
              <SiteLink
                key={key}
                href={`/services#${key.replace(/_/g, '-')}`}
                data-reveal-item
                className="group flex flex-col gap-[var(--space-4)] border-b-[length:var(--trait)] border-r-[length:var(--trait)] border-[color:var(--bordure)] p-[var(--space-6)] transition-colors duration-100 hover:bg-[var(--bleu-atelier)] hover:text-[var(--calque)]"
              >
                <p className="font-mono text-[length:var(--fs-mono)] opacity-60 transition-colors group-hover:text-[var(--jaune-signal)] group-hover:opacity-100">
                  [{String(items.length).padStart(2, '0')}]
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-[1.5rem] font-bold uppercase leading-[1.05]">
                  {label}
                </h3>
                <p className="font-mono text-[length:var(--fs-mono)] uppercase leading-[1.8] tracking-[.04em] opacity-70">
                  {items.map((s) => s.titre).join(' · ')}
                </p>
              </SiteLink>
            );
          })}
        </div>

        <div className="mt-[var(--space-8)]">
          <ButtonTertiaire as={SiteLink} href="/services">VOIR TOUTES LES PRESTATIONS</ButtonTertiaire>
        </div>
      </div>
    </section>
  );
}
