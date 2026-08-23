import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { useRevealStagger } from '../../motion';
import { fetchArticles } from '../../api/client';
import { CATEGORIES, CATEGORIE_LABEL, PAGE_SIZE } from './constants';

const CATEGORIES_VISIBLE = 6;

// Couleur de badge par catégorie
const CAT_COLORS = {
  entrepreneuriat: 'bg-primary text-on-primary',
  leadership: 'bg-secondary-container text-on-background',
  digital: 'bg-primary-container text-on-primary-container',
  formation: 'bg-surface-variant text-on-surface',
};

function ArticleCard({ article }) {
  const catColor = CAT_COLORS[article.categorie] || 'bg-surface-variant text-on-surface';
  const categLabel = CATEGORIE_LABEL[article.categorie] || article.categorie;

  return (
    <Link
      data-reveal-item
      to={`/blog/${article.slug}`}
      className="group flex flex-col bg-surface border-2 border-primary overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden bg-surface-variant relative">
        {article.image ? (
          <img src={article.image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-label-sm uppercase tracking-wider">
            VISUEL — &lt;NON FOURNI&gt;
          </div>
        )}
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <span className={`inline-block ${catColor} font-label-sm text-label-sm px-3 py-1 uppercase self-start mb-3`}>
          {categLabel}
        </span>
        <h3 className="font-headline-md text-headline-md text-on-background uppercase leading-tight mb-3 group-hover:text-primary transition-colors">
          {article.titre}
        </h3>
        {article.chapo && (
          <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-1 line-clamp-3">
            {article.chapo}
          </p>
        )}
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-auto pt-4 border-t border-outline-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-secondary-container">schedule</span>
          {article.date_publication ? `${article.date_publication} · ` : ''}{article.duree_lecture} MIN DE LECTURE
        </p>
      </div>
    </Link>
  );
}

export function BlogPage() {
  const { data: articles = [], status } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });
  const [categorie, setCategorie] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);

  const visibleCategories = expanded ? CATEGORIES : CATEGORIES.slice(0, CATEGORIES_VISIBLE);

  const filtered = useMemo(
    () => articles.filter((a) => !categorie || a.categorie === categorie),
    [articles, categorie],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const grilleRef = useRef(null);
  useRevealStagger(grilleRef, {
    itemCount: `${pageItems.length}-${currentPage}-${categorie}`,
    distance: 56,
    stagger: 0.08,
  });

  const selectCategorie = (value) => {
    setCategorie(value);
    setPage(1);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-primary text-on-primary py-[100px] md:py-[140px] px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="max-w-max-width mx-auto relative z-10">
          <p className="font-label-sm text-label-sm text-secondary-container uppercase tracking-widest mb-6">JOURNAL · BLOG</p>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-primary uppercase leading-none mb-6">
            ARTICLES &amp; <span className="text-secondary-container">RÉFLEXIONS</span>
          </h1>
          <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
            Leadership, entrepreneuriat, créativité digitale et développement personnel — partages d'expérience et ressources utiles.
          </p>
        </div>
        {/* Decorative watermark */}
        <div className="absolute inset-x-0 bottom-0 text-[20vw] font-black text-primary-container/20 uppercase leading-none pointer-events-none select-none text-center">
          JOURNAL
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-max-width mx-auto">

          {/* Filters */}
          <div className="mb-12 pb-6 border-b-2 border-primary/20">
            <div role="radiogroup" aria-label="Catégorie" className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                role="radio"
                aria-checked={categorie === ''}
                onClick={() => selectCategorie('')}
                className={`px-4 py-2 border-2 font-label-lg text-label-lg uppercase tracking-wider transition-all ${categorie === '' ? 'bg-secondary-container text-on-background border-secondary-container' : 'border-primary text-primary hover:bg-primary-container hover:text-on-primary-container'}`}
              >
                TOUT
              </button>
              {visibleCategories.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={categorie === value}
                  onClick={() => selectCategorie(value)}
                  className={`px-4 py-2 border-2 font-label-lg text-label-lg uppercase tracking-wider transition-all ${categorie === value ? 'bg-secondary-container text-on-background border-secondary-container' : 'border-primary text-primary hover:bg-primary-container hover:text-on-primary-container'}`}
                >
                  {label}
                </button>
              ))}
              {CATEGORIES.length > CATEGORIES_VISIBLE && (
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((v) => !v)}
                  className="font-label-lg text-label-lg text-secondary-container uppercase tracking-wider px-2 hover:underline"
                >
                  {expanded ? 'VOIR MOINS' : '+ VOIR PLUS'}
                </button>
              )}
            </div>
          </div>

          {/* Counter */}
          <p className="font-label-lg text-label-lg text-primary uppercase tracking-wider mb-8" aria-live="polite">
            [{filtered.length}] ARTICLE{filtered.length > 1 ? 'S' : ''}
          </p>

          {/* States */}
          {status === 'pending' && (
            <div className="py-24 text-center">
              <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
              <p className="font-body-lg text-primary mt-4">Chargement…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="py-24 text-center bg-error-container p-8">
              <p className="font-body-lg text-error">Impossible de charger les articles pour le moment.</p>
            </div>
          )}
          {status === 'success' && filtered.length === 0 && (
            <div className="py-24 text-center border-2 border-primary p-12">
              <span className="material-symbols-outlined text-primary text-[64px] mb-4 block">article</span>
              <p className="font-headline-md text-headline-md text-on-background mb-2">
                {articles.length === 0 ? 'Aucun article publié pour le moment.' : 'Aucun article ne correspond à cette catégorie.'}
              </p>
              {articles.length > 0 && (
                <button onClick={() => selectCategorie('')} className="mt-4 bg-primary text-on-primary px-6 py-3 font-label-lg uppercase hover:bg-primary-container transition-colors">
                  RÉINITIALISER LE FILTRE
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {status === 'success' && pageItems.length > 0 && (
            <>
              <div ref={grilleRef} className="grid gap-gutter md:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((article) => <ArticleCard key={article.slug} article={article} />)}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <nav aria-label="Pagination" className="flex flex-wrap gap-3 mt-12 justify-center">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-current={n === currentPage ? 'page' : undefined}
                      onClick={() => setPage(n)}
                      className={`h-10 w-10 border-2 font-label-lg text-label-lg font-bold transition-all ${n === currentPage ? 'bg-primary text-on-primary border-primary' : 'border-primary text-primary hover:bg-primary-container'}`}
                    >
                      {n}
                    </button>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <ProchaineEtape courante="/blog" />
    </SiteLayout>
  );
}
