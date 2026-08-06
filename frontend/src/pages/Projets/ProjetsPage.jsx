// /projets — spec §D.5. Réalisations, projets et galerie fusionnés.
// Plan (méthode C.12) :
//   1. Sections : cartouche titre · barre de filtres collante (nature + type)
//      · compteur aria-live · grille de cartes ou galerie de visuels.
//   2. Composants réutilisés : SiteLayout, SectionCartouche, Card, SiteLink,
//      Lightbox (dédié à cette page).
//   3. Spécifique à cette page : filtres nature (radio) / type (multi),
//      bascule LISTE/GALERIE, synchronisation URL (?nature=&type=&mode=),
//      lightbox plein écran, fetch de l'API Projet (aucun contenu inventé :
//      liste vide tant que le back-office n'a rien).
//   4. Vérifié : 360px sans débordement, focus visible, reduce-motion,
//      aucun rayon interdit, thème sombre, conducteur recalculé au resize.
//   5. Effet retiré : pas de parallaxe sur la grille filtrée (aurait nui à la
//      lisibilité du compteur aria-live pendant le filtrage).
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { Card } from '../../components/ui/Card';
import { SiteLink } from '../../components/ui/SiteLink';
import { useConductorSection } from '../../components/layout/useConductor';
import { RevealMask, useHoverSpring, useParallax } from '../../motion';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { fetchProjets } from '../../api/client';
import { NATURES, TYPES } from './constants';
import { Lightbox } from './Lightbox';
import './projets.css';

// Nombre de bornes "Type" visibles avant repli derrière "+ VOIR PLUS" —
// évite les 13 boutons sur trois lignes du premier jet (retour client).
const TYPES_VISIBLE = 6;

function FilterBorne({
  active, onClick, children, role, ariaChecked, ariaPressed,
}) {
  const ref = useRef(null);
  useHoverSpring(ref, {
    property: 'scale', from: 1, to: 1.04, tension: 260, friction: 22,
  });

  return (
    <button
      ref={ref}
      type="button"
      role={role}
      aria-checked={ariaChecked}
      aria-pressed={ariaPressed}
      className={`projets-borne${active ? ' is-active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Hero de page — markup NEUF, donc écrit en Tailwind (règle CLAUDE.md : le
// CSS fait main existant de cette page n'est pas converti, ce serait du
// remaniement sans gain visuel sur une page déjà validée).
// Volontairement sans transform sur un ancêtre de la barre de filtres : elle
// est en `position: sticky`, et un ancêtre transformé la ferait se caler sur
// lui au lieu de la fenêtre.
function ProjetsHero() {
  const planRef = useRef(null);
  useParallax(planRef, { from: -6, to: 10 });

  return (
    <section className="relative flex min-h-[52svh] items-end overflow-hidden pt-[7rem] pb-[var(--space-14)]">
      <div
        ref={planRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[15%] right-0 hidden h-[130%] w-[42%] bg-[var(--calque-clair)] md:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[12%] z-[1] select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[17vw] font-extrabold uppercase leading-none tracking-[-.02em] text-[var(--graphite)] opacity-[.07]"
      >
        ATELIER
      </span>

      <div className="container relative z-10">
        <p className="mb-[var(--space-6)] flex items-center gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-70">
          <span className="mark-square inline-block h-[.375rem] w-[.375rem] bg-[var(--jaune-signal)]" />
          <SiteLink href="/">ACCUEIL</SiteLink>
          <span aria-hidden="true">/</span>
          <span className="opacity-100">PROJETS</span>
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,9vw,7rem)] font-extrabold uppercase leading-[.86] tracking-[-.01em]">
          <RevealMask as="span" unit="lines" stagger={0.13} duration={1}>
            RÉALISATIONS
          </RevealMask>
        </h1>
      </div>
    </section>
  );
}

export function ProjetsPage() {
  const sectionRef = useConductorSection('projets', 'Projets');
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lastFocusedRef = useRef(null);

  const nature = searchParams.get('nature') || '';
  const types = useMemo(
    () => (searchParams.get('type') ? searchParams.get('type').split(',') : []),
    [searchParams],
  );
  const mode = searchParams.get('mode') === 'galerie' ? 'galerie' : 'liste';

  const [typesExpanded, setTypesExpanded] = useState(false);
  const hasHiddenActiveType = useMemo(() => {
    const visibleValues = TYPES.slice(0, TYPES_VISIBLE).map((t) => t.value);
    return types.some((t) => !visibleValues.includes(t));
  }, [types]);
  const showAllTypes = typesExpanded || hasHiddenActiveType;
  const visibleTypes = showAllTypes ? TYPES : TYPES.slice(0, TYPES_VISIBLE);

  const { data: projets = [], status } = useQuery({ queryKey: ['projets'], queryFn: fetchProjets });

  const filtered = useMemo(() => projets
    .filter((p) => !nature || p.nature === nature)
    .filter((p) => types.length === 0 || p.types.some((t) => types.includes(t)))
    .sort((a, b) => a.ordre - b.ordre), [projets, nature, types]);

  useEffect(() => {
    if (status !== 'success' || !gridRef.current) return;
    const cards = gridRef.current.children;
    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, scale: 1 });
      return;
    }
    gsap.fromTo(
      cards,
      { opacity: 0, scale: .98 },
      { opacity: 1, scale: 1, duration: .18, stagger: .03, ease: 'power1.out' },
    );
  }, [filtered, mode, status]);

  const setNature = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('nature', value); else next.delete('nature');
    setSearchParams(next, { replace: true });
  };

  const toggleType = (value) => {
    const active = new Set(types);
    if (active.has(value)) active.delete(value); else active.add(value);
    const next = new URLSearchParams(searchParams);
    if (active.size > 0) next.set('type', [...active].join(',')); else next.delete('type');
    setSearchParams(next, { replace: true });
  };

  const setMode = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'galerie') next.set('mode', 'galerie'); else next.delete('mode');
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => setSearchParams({}, { replace: true });

  const galleryItems = useMemo(
    () => filtered
      .filter((p) => p.banniere)
      .map((p) => ({ id: p.slug, src: p.banniere, legende: p.titre, type: 'image' })),
    [filtered],
  );

  return (
    <SiteLayout>
      <ProjetsHero />

      <section ref={sectionRef} id="projets" className="projets-page">

        <div className="projets-filters">
          <div className="container projets-filters-inner">
            <div className="projets-filter-group" role="radiogroup" aria-label="Nature">
              {NATURES.map(({ value, label }) => (
                <FilterBorne
                  key={label}
                  role="radio"
                  ariaChecked={nature === value}
                  active={nature === value}
                  onClick={() => setNature(value)}
                >
                  {label}
                </FilterBorne>
              ))}
            </div>

            <div className="projets-filter-group" aria-label="Type">
              {visibleTypes.map(({ value, label }) => (
                <FilterBorne
                  key={value}
                  ariaPressed={types.includes(value)}
                  active={types.includes(value)}
                  onClick={() => toggleType(value)}
                >
                  {label}
                </FilterBorne>
              ))}
              {TYPES.length > TYPES_VISIBLE && (
                <button
                  type="button"
                  className="projets-filter-more"
                  aria-expanded={showAllTypes}
                  onClick={() => setTypesExpanded((v) => !v)}
                >
                  {showAllTypes ? 'VOIR MOINS' : '+ VOIR PLUS'}
                  <span className="projets-filter-more-chevron" aria-hidden="true">▾</span>
                </button>
              )}
            </div>

            <div className="projets-toggle-mode">
              <FilterBorne
                ariaPressed={mode === 'liste'}
                active={mode === 'liste'}
                onClick={() => setMode('liste')}
              >
                LISTE
              </FilterBorne>
              <FilterBorne
                ariaPressed={mode === 'galerie'}
                active={mode === 'galerie'}
                onClick={() => setMode('galerie')}
              >
                GALERIE
              </FilterBorne>
            </div>
          </div>
        </div>

        <div className="container">
          <p className="projets-compteur" aria-live="polite">
            {`[${filtered.length}] RÉALISATION${filtered.length > 1 ? 'S' : ''}`}
          </p>

          {status === 'pending' && <p className="projets-etat">Chargement…</p>}
          {status === 'error' && <p className="projets-etat">Impossible de charger les réalisations pour le moment.</p>}

          {status === 'success' && filtered.length === 0 && (
            <div className="projets-vide">
              <p>
                {projets.length === 0
                  ? 'Aucune réalisation disponible pour le moment.'
                  : 'Aucune réalisation ne correspond à ces filtres.'}
              </p>
              {projets.length > 0 && (
                <button type="button" className="projets-reset" onClick={resetFilters}>
                  RÉINITIALISER LES FILTRES
                </button>
              )}
            </div>
          )}

          {status === 'success' && filtered.length > 0 && mode === 'liste' && (
            <div ref={gridRef} className="projets-grid">
              {filtered.map((projet) => (
                <Card
                  key={projet.slug}
                  as={SiteLink}
                  href={`/projets/${projet.slug}`}
                  visual={projet.banniere
                    ? <img src={projet.banniere} alt="" />
                    : <div className="media-placeholder"><span>VISUEL — </span></div>}
                >
                  <p className="projets-card-nature">{projet.nature}</p>
                  <h3 className="projets-card-titre">{projet.titre}</h3>
                  {projet.resume && <p className="projets-card-resume">{projet.resume}</p>}
                </Card>
              ))}
            </div>
          )}

          {status === 'success' && filtered.length > 0 && mode === 'galerie' && (
            <div ref={gridRef} className="projets-galerie">
              {galleryItems.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className="projets-galerie-item"
                  onClick={(e) => { lastFocusedRef.current = e.currentTarget; setLightboxIndex(i); }}
                >
                  <img src={item.src} alt={item.legende} />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProchaineEtape courante="/projets" />

      {lightboxIndex !== null && (
        <Lightbox
          items={galleryItems}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          returnFocusRef={lastFocusedRef}
        />
      )}
    </SiteLayout>
  );
}
