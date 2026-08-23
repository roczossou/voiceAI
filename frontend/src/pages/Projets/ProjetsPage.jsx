import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { useConductorSection } from '../../components/layout/useConductor';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { fetchProjets } from '../../api/client';
import { NATURES, TYPES } from './constants';
import { Lightbox } from './Lightbox';

const TYPES_VISIBLE = 6;
const COL_SPANS = ['md:col-span-8', 'md:col-span-4', 'md:col-span-5', 'md:col-span-7'];

function FilterBorne({ active, onClick, children, role, ariaChecked, ariaPressed }) {
  const baseClasses = "px-4 py-2 border-2 text-primary font-label-lg text-label-lg rounded-DEFAULT transition-all";
  const activeClasses = "border-secondary-container bg-secondary-container text-on-secondary";
  const inactiveClasses = "border-primary hover:bg-primary-container hover:text-on-primary-container";

  return (
    <button
      type="button"
      role={role}
      aria-checked={ariaChecked}
      aria-pressed={ariaPressed}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ProjetsPage() {
  const sectionRef = useConductorSection('projets', 'Projets');
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lastFocusedRef = useRef(null);

  const nature = searchParams.get('nature') || '';
  const types = useMemo(() => (searchParams.get('type') ? searchParams.get('type').split(',') : []), [searchParams]);
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
    const cards = Array.from(gridRef.current.children).filter(child => child.classList.contains('project-card'));
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
    () => filtered.filter((p) => p.banniere).map((p) => ({ id: p.slug, src: p.banniere, legende: p.titre, type: 'image' })),
    [filtered],
  );

  return (
    <SiteLayout>
      <main className="pb-[160px] px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pt-[40px]">
        {/* Header Section */}
        <header className="mb-16 md:mb-24 flex flex-col justify-between items-start gap-8 border-b-2 border-primary pb-8">
          <div className="max-w-2xl w-full flex flex-col md:flex-row justify-between items-end gap-8 mb-4">
            <div>
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-4 uppercase tracking-tighter">
                RÉALISATIONS <br/><span className="text-secondary-container">ATELIER</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Une collection de réalisations, projets et collaborations, illustrant ma méthodologie et mon engagement à créer de la valeur.
              </p>
            </div>
            
            <p className="font-label-lg text-label-lg text-primary-fixed-dim" aria-live="polite">
              [{filtered.length}] RÉALISATION{filtered.length > 1 ? 'S' : ''}
            </p>
          </div>
          
          <div className="w-full flex flex-col gap-4">
             <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Nature">
              {NATURES.map(({ value, label }) => (
                <FilterBorne key={label} role="radio" ariaChecked={nature === value} active={nature === value} onClick={() => setNature(value)}>
                  {label}
                </FilterBorne>
              ))}
            </div>

            <div className="flex flex-wrap gap-3" aria-label="Type">
              {visibleTypes.map(({ value, label }) => (
                <FilterBorne key={value} ariaPressed={types.includes(value)} active={types.includes(value)} onClick={() => toggleType(value)}>
                  {label}
                </FilterBorne>
              ))}
              {TYPES.length > TYPES_VISIBLE && (
                <button type="button" className="text-primary hover:text-secondary-container font-label-lg" aria-expanded={showAllTypes} onClick={() => setTypesExpanded((v) => !v)}>
                  {showAllTypes ? 'VOIR MOINS' : '+ VOIR PLUS'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-4 border-t border-primary/20 pt-4">
               <FilterBorne ariaPressed={mode === 'liste'} active={mode === 'liste'} onClick={() => setMode('liste')}>
                LISTE
              </FilterBorne>
              <FilterBorne ariaPressed={mode === 'galerie'} active={mode === 'galerie'} onClick={() => setMode('galerie')}>
                GALERIE
              </FilterBorne>
            </div>
          </div>
        </header>

        <section ref={sectionRef} id="projets">
          {status === 'pending' && <p className="font-body-lg text-primary">Chargement…</p>}
          {status === 'error' && <p className="font-body-lg text-error">Impossible de charger les réalisations pour le moment.</p>}

          {status === 'success' && filtered.length === 0 && (
            <div className="bg-surface p-8 border-2 border-primary rounded-lg text-center">
              <p className="font-body-lg mb-4">
                {projets.length === 0 ? 'Aucune réalisation disponible pour le moment.' : 'Aucune réalisation ne correspond à ces filtres.'}
              </p>
              {projets.length > 0 && (
                <button type="button" className="bg-primary text-on-primary px-6 py-2 rounded-DEFAULT font-label-lg" onClick={resetFilters}>
                  RÉINITIALISER LES FILTRES
                </button>
              )}
            </div>
          )}

          {status === 'success' && filtered.length > 0 && mode === 'liste' && (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[300px] md:auto-rows-[400px]">
              {filtered.map((projet, index) => {
                const colSpanClass = COL_SPANS[index % 4];
                return (
                  <Link key={projet.slug} to={`/projets/${projet.slug}`} className={`project-card group relative col-span-1 ${colSpanClass} row-span-1 border-2 border-primary bg-surface overflow-hidden rounded-lg cursor-pointer`}>
                    {projet.banniere ? (
                      <img src={projet.banniere} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                       <div className="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                         <span className="font-label-lg uppercase">Visuel —</span>
                       </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-inverse-surface/90 to-transparent flex justify-between items-end z-10">
                      <div>
                        <span className="inline-block bg-primary text-on-primary px-3 py-1 font-label-sm text-label-sm rounded-DEFAULT mb-2 uppercase">{projet.nature}</span>
                        <h3 className="font-headline-md text-headline-md text-surface">{projet.titre}</h3>
                      </div>
                      <span className="material-symbols-outlined text-surface-bright bg-secondary-container p-2 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">arrow_outward</span>
                    </div>
                  </Link>
                );
              })}

              {/* CTA Section (Breaking the grid) */}
              <div className="col-span-1 md:col-span-12 row-span-auto bg-primary text-on-primary p-8 md:p-16 flex flex-col md:flex-row items-center justify-between border-4 border-secondary-container relative overflow-hidden mt-8 rounded-xl shadow-lg">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary-container rotate-45 opacity-90 z-0"></div>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 border-8 border-primary-container rounded-full z-0"></div>
                <div className="relative z-10 max-w-xl">
                  <h2 className="font-headline-lg text-headline-lg mb-4">Besoin d'un projet similaire ?</h2>
                  <p className="font-body-lg text-body-lg text-primary-fixed-dim">Construisons ensemble des expériences marquantes et orientées résultats.</p>
                </div>
                <Link to="/contact" className="relative z-10 mt-8 md:mt-0 bg-secondary-container text-on-secondary px-8 py-4 font-label-lg text-label-lg rounded-DEFAULT border-2 border-secondary-container hover:bg-transparent hover:text-secondary-container transition-all shadow-md">
                  Démarrer un projet
                </Link>
              </div>
            </div>
          )}

          {status === 'success' && filtered.length > 0 && mode === 'galerie' && (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
              {galleryItems.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className="project-card relative border-2 border-primary bg-surface overflow-hidden rounded-lg cursor-pointer aspect-square"
                  onClick={(e) => { lastFocusedRef.current = e.currentTarget; setLightboxIndex(i); }}
                >
                  <img src={item.src} alt={item.legende} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="mt-16">
          <ProchaineEtape courante="/projets" />
        </div>
      </main>

      {lightboxIndex !== null && (
        <Lightbox items={galleryItems} index={lightboxIndex} onNavigate={setLightboxIndex} onClose={() => setLightboxIndex(null)} returnFocusRef={lastFocusedRef} />
      )}
    </SiteLayout>
  );
}
