import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConductorSection } from '../../components/layout/useConductor';
import { Link } from 'react-router-dom';
import { useRevealStagger } from '../../motion';
import { fetchArticles } from '../../api/client';
import { CATEGORIE_LABEL } from '../Blog/constants';

export function RecentBlog() {
  const sectionRef = useConductorSection('blog-recent', 'Blog récent');
  const grilleRef = useRef(null);
  const { data: articles = [] } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });
  const recents = articles.slice(0, 3);
  useRevealStagger(grilleRef, { itemCount: recents.length, distance: 56, stagger: 0.09 });

  if (recents.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="blog-recent"
      className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low"
    >
      <div className="max-w-max-width mx-auto">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="w-full md: shrink-0">
            <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background leading-none">
              Derniers <br />
              <span className="text-secondary-container">articles</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="font-label-lg text-label-lg font-bold text-on-secondary bg-secondary-container px-6 py-3 border border-amber-400/40 rounded-2xl hover:scale-105 transition-all shadow-md whitespace-nowrap"
          >
            Voir tout le blog
          </Link>
        </div>

        <div ref={grilleRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recents.map((article, idx) => {
            const accents = [
              { border: 'hover:border-purple-500', glow: 'glow-purple' },
              { border: 'hover:border-emerald-500', glow: 'glow-emerald' },
              { border: 'hover:border-cyan-500', glow: 'glow-cyan' },
            ];
            const acc = accents[idx % accents.length];
            return (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                data-reveal-item
                className={`bg-surface border border-outline-variant ${acc.border} ${acc.glow} rounded-2xl flex flex-col card-parallax-zoom transition-all duration-300 shadow-md group overflow-hidden`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-surface-variant relative">
                  {article.image ? (
                    <img src={article.image} alt={article.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-sm opacity-50">
                      SANS VISUEL
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary font-label-sm font-bold px-3.5 py-1 rounded-full border border-black/10 shadow-xs">
                    {CATEGORIE_LABEL[article.categorie] || article.categorie}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline-sm md:font-headline-md text-xl md:text-2xl font-bold text-on-background mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {article.titre}
                  </h3>
                  {article.chapo && (
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {article.chapo}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center text-sm font-mono text-on-surface-variant">
                    <span>{article.date_publication ? article.date_publication : 'Récemment'}</span>
                    <span className="font-bold text-amber-500">{article.duree_lecture} MIN</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
