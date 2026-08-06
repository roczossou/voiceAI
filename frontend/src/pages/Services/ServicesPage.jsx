// /services — spec §D.4. Plan (méthode C.12) :
//   1. Sections : titre de page · cinq groupes (Services digitaux, Gestion de
//      projet, Événementiel, Formation, Conseil), chacun ouvert par un
//      cartouche, chaque prestation en ligne de liste avec survol plein
//      jaune-signal et deux liens DEVIS/RENDEZ-VOUS.
//   2. Composants réutilisés : SiteLayout, SectionCartouche, ButtonTertiaire,
//      SiteLink, RevealMask.
//   3. Spécifique à cette page : fetch /api/services/ (modèle back-office
//      Service, table F — contenu littéral "sans ajout" du dossier D.4,
//      semé en base par migration de données, pas saisi ici) ; groupement et
//      ordre imposés côté client (l'API trie par nom de groupe, pas l'ordre
//      du dossier) ; survol de ligne = calque jaune-signal scaleX(0→1).
//   4. Page nouvelle au sens de CLAUDE.md (au-delà de Home/`/projets`) :
//      TailwindCSS + valeurs arbitraires sur les tokens, pas de CSS dédié.
//      Bordures de ligne en --graphite (littéral D.4, pas de déviation
//      --bordure ici — ce n'est pas un trait décoratif --cuivre).
//   5. Vérifié : 360px sans débordement (grille de ligne passe en 2 lignes
//      sous 640px), focus visible, reduce-motion, thème sombre, zéro contenu
//      inventé (état de chargement/vide explicite si l'API ne répond rien).
//   6. Effet retiré : pas de revealRise par ligne (le nombre de prestations
//      par groupe est trop élevé pour un stagger lisible ; seul le survol
//      individuel reste, conformément à la lecture stricte de D.4).
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { ButtonTertiaire } from '../../components/ui/Button';
import { SiteLink } from '../../components/ui/SiteLink';
import {
  RevealMask, RevealSection, useParallax,
} from '../../motion';
import { useConductorSection } from '../../components/layout/useConductor';
import { fetchServices } from '../../api/client';

// Une variante par groupe, en alternant les axes (plan §3) — jamais deux fois
// de suite le même mouvement.
const VARIANTES = ['slideLeft', 'rise', 'tilt3d', 'slideRight', 'zoom'];

const GROUPES = [
  { key: 'services_digitaux', label: 'SERVICES DIGITAUX' },
  { key: 'gestion_de_projet', label: 'GESTION DE PROJET' },
  { key: 'evenementiel', label: 'ÉVÉNEMENTIEL' },
  { key: 'formation', label: 'FORMATION' },
  { key: 'conseil', label: 'CONSEIL' },
];

function ServiceRow({ service, index }) {
  return (
    <div className="group relative overflow-hidden grid grid-cols-[3.5rem_1fr] sm:grid-cols-[3.5rem_1fr_auto] items-center gap-x-[var(--space-6)] gap-y-[var(--space-3)] px-[var(--space-4)] py-[var(--space-6)] border-t-[length:var(--bd)] border-[color:var(--graphite)]">
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[var(--jaune-signal)] scale-x-0 origin-left transition-transform duration-[190ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100 group-focus-within:scale-x-100"
      />
      <span className="relative z-10 font-mono text-[length:var(--fs-mono)] opacity-70">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="relative z-10 font-[family-name:var(--font-display)] text-[1.25rem] font-bold uppercase">
        {service.titre}
      </span>
      <div className="relative z-10 col-span-2 sm:col-span-1 flex flex-wrap gap-[var(--space-4)] justify-self-start sm:justify-self-end">
        <ButtonTertiaire as={SiteLink} href={`/contact?objet=devis&service=${service.slug}`}>DEVIS</ButtonTertiaire>
        <ButtonTertiaire as={SiteLink} href={`/contact?objet=rdv&service=${service.slug}`}>RENDEZ-VOUS</ButtonTertiaire>
      </div>
    </div>
  );
}

// Pas de cascade interne sur les lignes : le groupe est déjà enveloppé dans
// une RevealSection (voir ServicesPage). Deux révélations imbriquées se
// neutralisent — l'intérieure se jouerait pendant que le parent est encore
// invisible. La variété vient ici de la variante de section, qui change à
// chaque groupe.
function ServiceGroupe({ label, id, services }) {
  const sectionRef = useConductorSection(id, label);
  if (services.length === 0) return null;

  return (
    <div ref={sectionRef} id={id} className="scroll-mt-[6rem] py-[var(--space-16)]">
      <div className="container">
        <SectionCartouche label={label} />
        <div className="border-b-[length:var(--bd)] border-[color:var(--graphite)]">
          {services.map((service, i) => <ServiceRow key={service.slug} service={service} index={i} />)}
        </div>
      </div>
    </div>
  );
}

function ServicesHero() {
  const planRef = useRef(null);
  useParallax(planRef, { from: -6, to: 10 });

  return (
    <section className="relative flex min-h-[58svh] items-end overflow-hidden pt-[7rem] pb-[var(--space-16)]">
      <div
        ref={planRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[15%] left-0 hidden h-[130%] w-[38%] bg-[var(--calque-clair)] md:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[16%] z-[1] select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[17vw] font-extrabold uppercase leading-none tracking-[-.02em] text-[var(--graphite)] opacity-[.07]"
      >
        SERVICES
      </span>

      <div className="container relative z-10">
        <p className="mb-[var(--space-6)] flex items-center gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-70">
          <span className="mark-square inline-block h-[.375rem] w-[.375rem] bg-[var(--jaune-signal)]" />
          <SiteLink href="/">ACCUEIL</SiteLink>
          <span aria-hidden="true">/</span>
          <span className="opacity-100">SERVICES</span>
        </p>
        <h1 className="max-w-[22ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold uppercase leading-[.86] tracking-[-.01em]">
          <RevealMask as="span" unit="lines" stagger={0.13} duration={1}>
            CE QUE JE PRENDS EN CHARGE
          </RevealMask>
        </h1>
      </div>
    </section>
  );
}

export function ServicesPage() {
  const { data: services = [], status } = useQuery({ queryKey: ['services'], queryFn: fetchServices });

  return (
    <SiteLayout>
      <ServicesHero />

      <section className="pb-[var(--space-16)]">
        {status === 'pending' && (
          <p className="container font-mono text-[length:var(--fs-mono)] py-[var(--space-16)]">Chargement…</p>
        )}
        {status === 'error' && (
          <p className="container font-mono text-[length:var(--fs-mono)] py-[var(--space-16)]">
            Impossible de charger les prestations pour le moment.
          </p>
        )}

        {status === 'success' && GROUPES.map(({ key, label }, i) => (
          <RevealSection key={key} variant={VARIANTES[i % VARIANTES.length]}>
            <ServiceGroupe
              id={key.replace(/_/g, '-')}
              label={label}
              services={services.filter((s) => s.groupe === key)}
            />
          </RevealSection>
        ))}
      </section>

      <ProchaineEtape courante="/services" />
    </SiteLayout>
  );
}
