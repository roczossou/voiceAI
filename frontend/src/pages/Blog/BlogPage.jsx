// /blog — spec §D.9 index. Plan (méthode C.12) :
//   1. Sections : titre de page · filtres par catégorie (bornes) · compteur ·
//      grille de cartes 3×n · pagination en bornes numérotées.
//   2. Composants réutilisés : SiteLayout, Card, SiteLink, RevealMask.
//   3. Spécifique à cette page : fetch /api/articles/ (table vide tant que le
//      client ne fournit pas les 5-10 articles de la partie G, item 14 — page
//      construite quand même sur décision explicite du 2026-08-02, état vide
//      légitime en attendant) ; filtre catégorie replié au-delà de 6 entrées
//      (retour client du 2026-08-02 sur le même problème pour /projets : 12
//      bornes sur plusieurs lignes jugées "trop" — même correctif ici,
//      appliqué avant même le retour, par cohérence) ; pagination bornes
//      côté client (pas de pagination DRF configurée pour l'instant, table
//      trop petite pour le justifier).
//   4. Page nouvelle au sens de CLAUDE.md : TailwindCSS + valeurs arbitraires
//      sur les tokens, pas de CSS dédié.
//   5. Vérifié : 360px sans débordement, focus visible, reduce-motion, thème
//      sombre, zéro contenu inventé (aucun article factice).
//   6. Effet retiré : pas de stagger d'entrée sur les cartes au changement de
//      page/filtre (le compteur aria-live doit rester lisible immédiatement,
//      même raison que ProjetsPage.jsx).
import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { Card } from '../../components/ui/Card';
import { SiteLink } from '../../components/ui/SiteLink';
import {
  RevealMask, useParallax, useRevealStagger, useTilt,
} from '../../motion';
import { fetchArticles } from '../../api/client';
import { CATEGORIES, CATEGORIE_LABEL, PAGE_SIZE } from './constants';

const CATEGORIES_VISIBLE = 6;

function BlogHero() {
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
        className="pointer-events-none absolute inset-x-0 bottom-[12%] z-[1] select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[19vw] font-extrabold uppercase leading-none tracking-[-.02em] text-[var(--graphite)] opacity-[.07]"
      >
        JOURNAL
      </span>

      <div className="container relative z-10">
        <p className="mb-[var(--space-6)] flex items-center gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-70">
          <span className="mark-square inline-block h-[.375rem] w-[.375rem] bg-[var(--jaune-signal)]" />
          <SiteLink href="/">ACCUEIL</SiteLink>
          <span aria-hidden="true">/</span>
          <span className="opacity-100">BLOG</span>
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,10vw,7.5rem)] font-extrabold uppercase leading-[.86] tracking-[-.01em]">
          <RevealMask as="span" unit="lines" stagger={0.13} duration={1}>BLOG</RevealMask>
        </h1>
      </div>
    </section>
  );
}

function ArticleCard({ article }) {
  const ref = useRef(null);
  useTilt(ref, { max: 6, perspective: 900, lift: 16 });

  return (
    <Card
      ref={ref}
      data-reveal-item
      className="will-change-transform"
      as={SiteLink}
      href={`/blog/${article.slug}`}
      visual={article.image
        ? <img src={article.image} alt="" loading="lazy" />
        : <div className="media-placeholder"><span>VISUEL — &lt;NON FOURNI&gt;</span></div>}
    >
      <p className="font-mono text-[length:var(--fs-mono)] text-[var(--cuivre)] uppercase mb-[var(--space-2)]">
        {CATEGORIE_LABEL[article.categorie] || article.categorie}
      </p>
      <h3 className="font-[family-name:var(--font-display)] text-[1.25rem] font-bold uppercase leading-tight mb-[var(--space-2)]">
        {article.titre}
      </h3>
      {article.chapo && <p className="text-[length:var(--fs-body)] opacity-80 mb-[var(--space-3)]">{article.chapo}</p>}
      <p className="font-mono text-[length:var(--fs-mono)] opacity-70">
        {article.date_publication ? `[${article.date_publication}] · ` : ''}{article.duree_lecture} MIN DE LECTURE
      </p>
    </Card>
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
    // `currentPage` et `categorie` entrent dans la clé pour que la cascade
    // rejoue quand le lecteur change de filtre ou de page.
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
      <BlogHero />

      <section className="pb-[var(--space-16)]">
        <div className="container">
          <div role="radiogroup" aria-label="Catégorie" className="flex flex-wrap items-center gap-[var(--space-2)] mb-[var(--space-8)] pb-[var(--space-6)] border-b-[length:var(--trait)] border-[color:var(--bordure)]">
            <button
              type="button"
              role="radio"
              aria-checked={categorie === ''}
              onClick={() => selectCategorie('')}
              className={`border-[length:var(--trait)] px-[var(--space-4)] py-[var(--space-2)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.05em] ${categorie === '' ? 'bg-[var(--graphite)] text-[var(--calque)] border-[color:var(--graphite)]' : 'border-[color:var(--bordure)]'}`}
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
                className={`border-[length:var(--trait)] px-[var(--space-4)] py-[var(--space-2)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.05em] ${categorie === value ? 'bg-[var(--graphite)] text-[var(--calque)] border-[color:var(--graphite)]' : 'border-[color:var(--bordure)]'}`}
              >
                {label}
              </button>
            ))}
            {CATEGORIES.length > CATEGORIES_VISIBLE && (
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-[.35em] px-[var(--space-2)] py-[var(--space-2)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.05em] text-[var(--cuivre)]"
              >
                {expanded ? 'VOIR MOINS' : '+ VOIR PLUS'}
              </button>
            )}
          </div>

          <p className="font-mono text-[length:var(--fs-mono)] font-semibold mb-[var(--space-8)]" aria-live="polite">
            {`[${filtered.length}] ARTICLE${filtered.length > 1 ? 'S' : ''}`}
          </p>

          {status === 'pending' && <p className="font-mono text-[length:var(--fs-mono)] py-[var(--space-16)]">Chargement…</p>}
          {status === 'error' && (
            <p className="font-mono text-[length:var(--fs-mono)] py-[var(--space-16)]">Impossible de charger les articles pour le moment.</p>
          )}

          {status === 'success' && filtered.length === 0 && (
            <p className="font-mono text-[length:var(--fs-mono)] py-[var(--space-16)]">
              {articles.length === 0
                ? 'Aucun article publié pour le moment.'
                : 'Aucun article ne correspond à cette catégorie.'}
            </p>
          )}

          {status === 'success' && pageItems.length > 0 && (
            <>
              {/* Cascade sur les cartes. `itemCount` est indispensable : les
                  articles viennent de /api/articles/, donc la grille est vide
                  au premier rendu — sans cette dépendance le hook ne se
                  rejouerait jamais et les cartes resteraient figées.
                  La clé change aussi avec le filtre et la page, pour rejouer
                  la cascade à chaque nouveau jeu de cartes. */}
              <div ref={grilleRef} className="grid gap-[var(--space-6)] md:grid-cols-3">
                {pageItems.map((article) => <ArticleCard key={article.slug} article={article} />)}
              </div>

              {pageCount > 1 && (
                <nav aria-label="Pagination" className="flex flex-wrap gap-[var(--space-2)] mt-[var(--space-10)]">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-current={n === currentPage ? 'page' : undefined}
                      onClick={() => setPage(n)}
                      className={`h-[2.5rem] w-[2.5rem] border-[length:var(--trait)] font-mono text-[length:var(--fs-mono)] font-semibold ${n === currentPage ? 'bg-[var(--graphite)] text-[var(--calque)] border-[color:var(--graphite)]' : 'border-[color:var(--bordure)]'}`}
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
