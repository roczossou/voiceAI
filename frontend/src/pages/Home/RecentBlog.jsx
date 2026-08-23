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
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase leading-none">
              DERNIERS <br/>
              <span className="text-secondary-container">ARTICLES</span>
            </h2>
          </div>
          <Link 
            to="/blog" 
            className="font-label-lg text-label-lg font-bold text-on-background bg-secondary-container px-6 py-3 border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all uppercase whitespace-nowrap"
          >
            VOIR TOUT LE BLOG
          </Link>
        </div>

        <div ref={grilleRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recents.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              data-reveal-item
              className="bg-white border-2 border-black flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 group"
            >
              <div className="aspect-[16/10] border-b-2 border-black overflow-hidden bg-surface-variant relative">
                {article.image ? (
                  <img src={article.image} alt={article.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-sm opacity-50">
                    SANS VISUEL
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-secondary-container text-black font-label-sm font-bold uppercase px-3 py-1 border border-black">
                  {CATEGORIE_LABEL[article.categorie] || article.categorie}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-sm md:font-headline-md text-xl md:text-2xl font-bold uppercase text-on-background mb-4 group-hover:text-secondary-container transition-colors line-clamp-2">
                  {article.titre}
                </h3>
                {article.chapo && (
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow">
                    {article.chapo}
                  </p>
                )}
                <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center text-sm font-mono text-on-surface-variant">
                  <span>{article.date_publication ? article.date_publication : 'Récemment'}</span>
                  <span className="font-bold">{article.duree_lecture} MIN</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
