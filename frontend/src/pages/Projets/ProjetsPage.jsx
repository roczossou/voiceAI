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

const CARD_ACCENTS = [
  { border: 'hover:border-purple-500', glow: 'glow-purple', bg: 'bg-purple-600', tag: 'bg-purple-600' },
  { border: 'hover:border-emerald-500', glow: 'glow-emerald', bg: 'bg-emerald-600', tag: 'bg-emerald-600' },
  { border: 'hover:border-cyan-500', glow: 'glow-cyan', bg: 'bg-cyan-600', tag: 'bg-cyan-600' },
  { border: 'hover:border-amber-500', glow: 'glow-amber', bg: 'bg-amber-600', tag: 'bg-amber-600' },
];

function FilterBorne({ active, onClick, children, role, ariaChecked, ariaPressed }) {
  const baseClasses = "px-md py-sm border font-label-bold text-[11px] tracking-wider rounded-xl transition-all duration-300 shadow-xs flex items-center gap-xs";
  const activeClasses = "border-secondary-container bg-secondary-container text-on-secondary shadow-md scale-105";
  const inactiveClasses = "border-outline-variant bg-surface text-on-surface hover:border-primary hover:bg-surface-container";

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
      {/* Hero Section */}
      <section className="text-white pt-[140px] pb-[80px] md:pt-[180px] md:pb-[100px] relative overflow-hidden" style={{ backgroundColor: '#1565f5' }}>
        {/* ===== CODED BACKGROUND ===== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <svg className="absolute" style={{ top: '-5%', right: '10%', width: 400, height: 400 }} viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="ring-projets-1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff2d00" />
                <stop offset="100%" stopColor="#ff7000" />
              </radialGradient>
            </defs>
            <circle cx="110" cy="110" r="80" stroke="url(#ring-projets-1)" strokeWidth="44" />
          </svg>
          <svg className="absolute" style={{ bottom: '-30%', left: '-10%', width: 700, height: 700 }} viewBox="0 0 820 820" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="ring-projets-2" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ffd000" />
                <stop offset="100%" stopColor="#ff6200" />
              </radialGradient>
            </defs>
            <circle cx="410" cy="410" r="300" stroke="url(#ring-projets-2)" strokeWidth="150" />
          </svg>
        </div>
        {/* ===== END BACKGROUND ===== */}

        <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto relative z-10">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-md mb-sm">
            <div className="w-full md:shrink-0">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-label-bold text-[11px] px-md py-xs rounded-full tracking-widest mb-sm shadow-md border border-white/20">
                PORTFOLIO &amp; SHOWCASE
              </div>
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-white mb-sm tracking-tighter">
                Projets et <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">Réalisations</span>
              </h1>
              <p className="font-body-lg text-body-lg text-white/90 w-full leading-relaxed">
                Une collection de réalisations, projets et collaborations, illustrant ma méthodologie et mon engagement à créer de la valeur.
              </p>
            </div>
            <p className="font-label-bold text-[11px] text-white bg-white/10 px-md py-sm rounded-xl border border-white/20 shrink-0 tracking-wider" aria-live="polite">
              [{filtered.length}] RÉALISATION{filtered.length > 1 ? 'S' : ''}
            </p>
          </div>
        </div>
      </section>

      <main className="pb-[160px] px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pt-lg md:pt-xl">
        {/* Filters */}
        <header className="mb-xl flex flex-col justify-between items-start gap-lg border-b border-outline-variant pb-lg relative z-20">

          <div className="w-full flex flex-col gap-md">
            <div className="flex flex-wrap gap-sm" role="radiogroup" aria-label="Nature">
              {NATURES.map(({ value, label }) => (
                <FilterBorne key={label} role="radio" ariaChecked={nature === value} active={nature === value} onClick={() => setNature(value)}>
                  {label}
                </FilterBorne>
              ))}
            </div>

            <div className="flex flex-wrap gap-sm" aria-label="Type">
              {visibleTypes.map(({ value, label }) => (
                <FilterBorne key={value} ariaPressed={types.includes(value)} active={types.includes(value)} onClick={() => toggleType(value)}>
                  {label}
                </FilterBorne>
              ))}
              {TYPES.length > TYPES_VISIBLE && (
                <button type="button" className="font-label-bold text-[11px] text-primary hover:text-secondary-container tracking-wider transition-colors" aria-expanded={showAllTypes} onClick={() => setTypesExpanded((v) => !v)}>
                  {showAllTypes ? 'VOIR MOINS' : '+ VOIR PLUS'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-sm border-t border-outline-variant pt-md">
              <FilterBorne ariaPressed={mode === 'liste'} active={mode === 'liste'} onClick={() => setMode('liste')}>
                <span className="material-symbols-outlined text-[14px]">view_list</span>
                LISTE
              </FilterBorne>
              <FilterBorne ariaPressed={mode === 'galerie'} active={mode === 'galerie'} onClick={() => setMode('galerie')}>
                <span className="material-symbols-outlined text-[14px]">grid_view</span>
                GALERIE
              </FilterBorne>
            </div>
          </div>
        </header>

        {/* Grid section */}
        <section ref={sectionRef} id="projets">
          {status === 'pending' && (
            <div className="py-xl text-center">
              <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
              <p className="font-body-lg text-primary mt-md">Chargement…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-surface border border-outline-variant rounded-xl p-lg text-center shadow-sm">
              <span className="material-symbols-outlined text-error text-[40px] mb-sm block">error</span>
              <p className="font-body-lg text-error">Impossible de charger les réalisations pour le moment.</p>
            </div>
          )}

          {status === 'success' && filtered.length === 0 && (
            <div className="bg-surface p-lg border border-outline-variant rounded-xl text-center shadow-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-[48px] mb-sm block">search_off</span>
              <p className="font-body-lg text-on-surface mb-md">
                {projets.length === 0 ? 'Aucune réalisation disponible pour le moment.' : 'Aucune réalisation ne correspond à ces filtres.'}
              </p>
              {projets.length > 0 && (
                <button type="button" className="text-on-primary font-label-bold text-label-bold px-lg py-md rounded-full transition-all tracking-wider" style={{ background: 'linear-gradient(135deg, rgb(255, 69, 0) 0%, rgb(255, 183, 0) 100%)' }} onClick={resetFilters}>
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          {status === 'success' && filtered.length > 0 && mode === 'liste' && (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-md auto-rows-[300px] md:auto-rows-[400px]">
              {filtered.map((projet, index) => {
                const colSpanClass = COL_SPANS[index % 4];
                const acc = CARD_ACCENTS[index % CARD_ACCENTS.length];
                return (
                  <Link
                    key={projet.slug}
                    to={`/projets/${projet.slug}`}
                    className={`project-card group relative col-span-1 ${colSpanClass} row-span-1 border border-outline-variant ${acc.border} ${acc.glow} bg-surface overflow-hidden rounded-xl card-parallax-zoom cursor-pointer shadow-sm`}
                  >
                    {projet.banniere ? (
                      <img src={projet.banniere} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[64px] opacity-30">image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/15 group-hover:bg-transparent transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 w-full p-md bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent flex justify-between items-end z-10">
                      <div>
                        <span className={`inline-block ${acc.tag} text-white px-sm py-xs font-label-bold text-[10px] rounded-lg mb-xs font-bold shadow-xs`}>{projet.nature}</span>
                        <h3 className="font-headline-md text-headline-md text-surface font-bold">{projet.titre}</h3>
                      </div>
                      <span className="material-symbols-outlined text-surface-bright bg-secondary-container p-sm rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">arrow_outward</span>
                    </div>
                  </Link>
                );
              })}

              {/* CTA card */}
              <div className="col-span-1 md:col-span-12 row-span-auto bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary p-lg md:p-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden mt-md rounded-xl shadow-lg">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <svg className="absolute" style={{ top: '-20%', right: '-8%', width: 280, height: 280 }} viewBox="0 0 220 220" fill="none">
                    <circle cx="110" cy="110" r="80" stroke="rgba(255,183,0,0.25)" strokeWidth="44" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-primary mb-sm">Besoin d'un projet similaire ?</h2>
                  <p className="font-body-lg text-body-lg text-primary-fixed-dim">Construisons ensemble des expériences marquantes et orientées résultats.</p>
                </div>
                <Link to="/contact" className="relative z-10 mt-lg md:mt-0 text-on-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:opacity-90 transition-all shadow-md tracking-wider shrink-0" style={{ background: 'linear-gradient(135deg, rgb(255, 69, 0) 0%, rgb(255, 183, 0) 100%)' }}>
                  Démarrer un projet
                </Link>
              </div>
            </div>
          )}

          {status === 'success' && filtered.length > 0 && mode === 'galerie' && (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
              {galleryItems.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className="project-card relative border border-outline-variant hover:border-primary bg-surface overflow-hidden rounded-xl cursor-pointer aspect-square shadow-sm transition-all glow-purple"
                  onClick={(e) => { lastFocusedRef.current = e.currentTarget; setLightboxIndex(i); }}
                >
                  <img src={item.src} alt={item.legende} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="mt-xl">
          <ProchaineEtape courante="/projets" />
        </div>
      </main>

      {lightboxIndex !== null && (
        <Lightbox items={galleryItems} index={lightboxIndex} onNavigate={setLightboxIndex} onClose={() => setLightboxIndex(null)} returnFocusRef={lastFocusedRef} />
      )}
    </SiteLayout>
  );
}
