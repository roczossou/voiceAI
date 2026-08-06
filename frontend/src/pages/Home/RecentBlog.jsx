// R06 — Blog récent. Spec §D.1 : trois dernières entrées, « section non rendue
// si aucune entrée ».
//
// Branchée sur /api/articles/ le 2026-08-03 (elle était jusque-là figée sur une
// collection vide, faute de données). La règle de la spec est conservée telle
// quelle : tant que l'API ne renvoie rien, la section n'existe pas dans le DOM
// — pas de bloc vide, pas de carte fictive.
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { Card } from '../../components/ui/Card';
import { ButtonTertiaire } from '../../components/ui/Button';
import { SiteLink } from '../../components/ui/SiteLink';
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

  // `.recent-blog` n'a jamais eu de règle dans home.css (la section n'avait
  // jamais été implémentée) : fond et espacement sont posés en Tailwind, aux
  // valeurs de la spec §D.1 R06 (--calque-clair, 7rem).
  return (
    <section
      ref={sectionRef}
      id="blog-recent"
      className="recent-blog scroll-mt-[6rem] bg-[var(--calque-clair)] py-[var(--space-24)]"
    >
      <div className="container">
        <SectionCartouche label="DERNIERS ARTICLES" />

        <div ref={grilleRef} className="grid gap-[var(--space-6)] md:grid-cols-3">
          {recents.map((article) => (
            <Card
              key={article.slug}
              data-reveal-item
              as={SiteLink}
              href={`/blog/${article.slug}`}
              visual={article.image
                ? <img src={article.image} alt="" loading="lazy" />
                : <div className="media-placeholder"><span>VISUEL — &lt;NON FOURNI&gt;</span></div>}
            >
              <p className="mb-[var(--space-2)] font-mono text-[length:var(--fs-mono)] uppercase text-[var(--cuivre)]">
                {CATEGORIE_LABEL[article.categorie] || article.categorie}
              </p>
              <h3 className="mb-[var(--space-2)] font-[family-name:var(--font-display)] text-[1.25rem] font-bold uppercase leading-tight">
                {article.titre}
              </h3>
              {article.chapo && (
                <p className="mb-[var(--space-3)] text-[length:var(--fs-body)] opacity-80">{article.chapo}</p>
              )}
              <p className="font-mono text-[length:var(--fs-mono)] opacity-70">
                {article.date_publication ? `[${article.date_publication}] · ` : ''}
                {article.duree_lecture} MIN DE LECTURE
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-[var(--space-8)]">
          <ButtonTertiaire as={SiteLink} href="/blog">VOIR TOUS LES ARTICLES</ButtonTertiaire>
        </div>
      </div>
    </section>
  );
}
