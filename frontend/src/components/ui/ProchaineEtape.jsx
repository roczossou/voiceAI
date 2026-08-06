// Bloc « étape suivante » — une SEULE destination par page.
//
// Remplace un premier essai (PagesSuivantes) qui listait toutes les autres
// pages : le client l'a rejeté, « on croirait une autre nav » — et il avait
// raison, une liste de liens en fin de page double le menu au lieu de guider.
// Ici, chaque page pousse vers UNE suite logique, traitée comme une pleine
// page d'appel : grand titre, une phrase, et tout le bloc cliquable.
//
// Le parcours est un anneau (voir ETAPES ci-dessous) : où qu'il entre, le
// visiteur est toujours relancé vers une page utile, et jamais vers une page
// qui n'existe pas encore (/androcrea, /leadership, etc. tombent toujours sur
// le NotFound — à ajouter ici seulement quand elles existeront).
//
// Le composant porte sa propre révélation : ne pas l'envelopper dans une
// RevealSection (deux révélations imbriquées se neutralisent).
import { useRef } from 'react';
import { SiteLink } from './SiteLink';
import { useRevealSection } from '../../motion';

// Suite logique de chaque page. Accroches factuelles : elles décrivent ce que
// la page contient vraiment, sans promesse inventée.
const ETAPES = {
  '/': {
    href: '/a-propos',
    titre: 'À PROPOS',
    accroche: 'Le parcours, la vision et les valeurs derrière les projets.',
  },
  '/a-propos': {
    href: '/projets',
    titre: 'LES RÉALISATIONS',
    accroche: 'Les projets professionnels, entrepreneuriaux et institutionnels.',
  },
  '/projets': {
    href: '/services',
    titre: 'LES SERVICES',
    accroche: 'Design, gestion de projet, événementiel, formation, conseil.',
  },
  '/services': {
    href: '/contact',
    titre: 'PARLONS-EN',
    accroche: 'Un message ou un rendez-vous, au choix.',
  },
  '/blog': {
    href: '/a-propos',
    titre: 'À PROPOS',
    accroche: 'Le parcours, la vision et les valeurs derrière les projets.',
  },
  '/contact': {
    href: '/projets',
    titre: 'LES RÉALISATIONS',
    accroche: 'Les projets professionnels, entrepreneuriaux et institutionnels.',
  },
};

export function ProchaineEtape({ courante }) {
  const ref = useRef(null);
  useRevealSection(ref, { variant: 'rise' });

  const etape = ETAPES[courante];
  if (!etape) return null;

  return (
    <section ref={ref} className="border-t-[length:var(--bd)] border-[color:var(--bordure)]">
      <SiteLink
        href={etape.href}
        className="group relative block overflow-hidden py-[var(--space-24)]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-[var(--jaune-signal)] transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />

        <span className="container relative z-10 block">
          <span className="mb-[var(--space-6)] flex items-center gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.16em] opacity-70">
            <span className="mark-square inline-block h-[.375rem] w-[.375rem] bg-[var(--jaune-signal)] transition-colors group-hover:bg-[var(--graphite)]" />
            ÉTAPE SUIVANTE
          </span>

          <span className="flex flex-wrap items-end justify-between gap-[var(--space-8)]">
            {/* Pas de largeur max sur ce bloc : elle forçait « PARLONS-EN » à
                casser sur son trait d'union. Seule l'accroche est bornée. */}
            <span className="block">
              <span className="block font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold uppercase leading-[.88] tracking-[-.01em] [hyphens:none]">
                {etape.titre}
              </span>
              <span className="mt-[var(--space-5)] block max-w-[38ch] font-mono text-[length:var(--fs-mono-lg)] uppercase leading-[1.7] tracking-[.04em] opacity-75">
                {etape.accroche}
              </span>
            </span>

            <svg
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-4"
              viewBox="0 0 24 24"
              width="3.5rem"
              height="3.5rem"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </SiteLink>
    </section>
  );
}
