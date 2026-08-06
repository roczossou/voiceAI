// R00 — Hero de page. Ajouté le 2026-08-03 : /a-propos ouvrait directement
// sur un paragraphe, sans le poids visuel que l'accueil pose d'entrée.
// Profondeur = trois plans qui défilent à des vitesses différentes (trame
// millimétrée, mot fantôme, contenu) + la plaque signalétique inclinée au
// pointeur (useTilt). Aucune librairie ajoutée : GSAP/Lenis uniquement.
//
// Contenus strictement réels : la ligne de métiers vient d'infos.txt §2.2,
// la plaque reprend les valeurs déjà validées du hero d'accueil (spec §D.1).
import { useRef } from 'react';
import { useConductorSection } from '../../components/layout/useConductor';
import { SiteLink } from '../../components/ui/SiteLink';
import { RevealMask, useParallax, useTilt } from '../../motion';

const PLAQUE = [
  { label: 'NATIONALITÉ', value: 'Béninoise' },
  { label: 'DÉPARTEMENT', value: 'Zou' },
  { label: 'MANDAT', value: '1er Adjoint au Maire des Jeunes de Covè' },
];

const METIERS = 'Entrepreneur · Leader jeunesse · Gestionnaire de projet · Planificateur d’événements · Créatif digital';

export function AProposHero() {
  const sectionRef = useConductorSection('a-propos', 'À propos');
  const watermarkRef = useRef(null);
  const ghostRef = useRef(null);
  const plaqueRef = useRef(null);

  // Deux plans de fond à vitesses distinctes : c'est ce décalage qui crée la
  // sensation de profondeur, pas une ombre portée (proscrite §C.11).
  useParallax(watermarkRef, { from: -6, to: 10 });
  useParallax(ghostRef, { from: 6, to: -8 });
  useTilt(plaqueRef, { max: 7, perspective: 1000, lift: 26 });

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="relative flex min-h-[62svh] items-end overflow-hidden pt-[7rem] pb-[var(--space-16)]"
    >
      {/* Plan de fond décalé — remplace la trame millimétrée, que le client
          n'a pas aimée (2026-08-03, « je n'aime pas le style cahier »).
          La profondeur vient désormais du glissement de plans pleins les uns
          par rapport aux autres, pas d'une texture de fond. */}
      {/* Surdimensionné et débordant en haut/bas pour que la parallaxe ne
          découvre jamais le bord du plan. */}
      {/* `hidden md:block` : ces plans composent la page en deux colonnes.
          Sous 768px la mise en page est empilée, ils ne découperaient plus
          rien — ils barraient juste le titre. */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[15%] right-0 hidden h-[130%] w-[46%] bg-[var(--calque-clair)] md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[46%] top-0 hidden h-full w-[var(--trait)] bg-[var(--bordure)] opacity-70 md:block"
      />

      {/* Mot en très grand, transparent (le client y tient — 2026-08-03).
          Placé AU-DESSUS des plans (z-[1]) et centré sur toute la largeur :
          la version précédente passait derrière le plan clair, qui la
          coupait en lettres orphelines et la faisait passer pour un défaut.
          `whitespace-nowrap` + taille en vw : le mot reste entier à toute
          largeur, il n'est jamais rogné. */}
      <span
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[14%] z-[1] select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[17vw] font-extrabold uppercase leading-none tracking-[-.02em] text-[var(--graphite)] opacity-[.07]"
      >
        PROFIL
      </span>

      <div className="container relative z-10 grid items-end gap-[var(--space-12)] lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p className="mb-[var(--space-6)] flex items-center gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-70">
            <span className="mark-square inline-block h-[.375rem] w-[.375rem] bg-[var(--jaune-signal)]" />
            <SiteLink href="/" className="hover:opacity-100">ACCUEIL</SiteLink>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--graphite)] opacity-100">À PROPOS</span>
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3.25rem,11vw,8.5rem)] font-extrabold uppercase leading-[.82] tracking-[-.01em]">
            <RevealMask as="span" unit="lines" stagger={0.13} duration={1}>
              À PROPOS
            </RevealMask>
          </h1>

          <p className="mt-[var(--space-8)] max-w-[34rem] font-mono text-[length:var(--fs-mono-lg)] uppercase leading-[1.7] tracking-[.04em] opacity-75">
            {METIERS}
          </p>
        </div>

        {/* Plaque signalétique — le plan qui se détache au pointeur. */}
        <div
          ref={plaqueRef}
          className="border-[length:var(--bd)] border-[color:var(--bordure)] bg-[var(--calque-clair)] p-[var(--space-6)] will-change-transform"
        >
          <p className="mb-[var(--space-5)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-60">
            FICHE
          </p>
          <dl className="flex flex-col">
            {PLAQUE.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex flex-col gap-[.25rem] py-[var(--space-4)] ${i > 0 ? 'border-t-[length:var(--trait)] border-[color:var(--bordure)]' : 'pt-0'}`}
              >
                <dt className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[.1em] opacity-60">{label}</dt>
                <dd className="font-[family-name:var(--font-display)] text-[1.375rem] font-bold uppercase leading-[1.05]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p className="absolute bottom-[var(--space-6)] left-0 w-full">
        <span className="container block font-mono text-[length:var(--fs-mono)] uppercase tracking-[.2em] text-[var(--cuivre)]">
          COVÈ · ZOU · BÉNIN
        </span>
      </p>
    </section>
  );
}
