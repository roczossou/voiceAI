// /blog/[slug] — spec §D.9 fiche article. Plan (méthode C.12) :
//   1. Sections : fil d'Ariane léger · méta (catégorie, date, durée, auteur) ·
//      titre · corps · barre de partage · trois suggestions (catégorie
//      commune) · retour à la liste.
//   2. Composants réutilisés : SiteLayout, SiteLink, RevealMask.
//   3. Spécifique à cette page : fetch /api/articles/[slug]/ ; partage via
//      navigator.share ou copie de lien (même motif que Lightbox.jsx,
//      "LIEN COPIÉ" 1800ms) ; suggestions = articles_lies (curation
//      back-office) si renseigné, sinon repli automatique sur la même
//      catégorie (lecture littérale de D.9 : "choisies par catégorie
//      commune").
//   4. Simplification assumée : pas de sommaire collant (spec §D.9) — le
//      champ `corps` est un texte brut sans structure h2/h3 exploitable tant
//      qu'aucun éditeur riche n'existe côté back-office (spec §F ne prévoit
//      pas ce champ en richtext structuré) ; à revoir si `corps` devient du
//      contenu structuré. Pas de bloc commentaires : aucune infrastructure
//      de commentaires n'existe (le champ `commentaires_ouverts` est un
//      simple indicateur, sans modèle Commentaire associé) — hors périmètre
//      de "créer la page blog".
//   5. Page nouvelle au sens de CLAUDE.md : TailwindCSS, pas de CSS dédié.
//   6. Vérifié : 360px sans débordement, focus visible, reduce-motion, thème
//      sombre, zéro contenu inventé (état "article introuvable" explicite).
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { SiteLink } from '../../components/ui/SiteLink';
import { Card } from '../../components/ui/Card';
import { RevealMask } from '../../motion';
import { fetchArticle, fetchArticles } from '../../api/client';
import { CATEGORIE_LABEL } from './constants';

export function BlogArticlePage() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const { data: article, status } = useQuery({ queryKey: ['article', slug], queryFn: () => fetchArticle(slug) });
  const { data: articles = [] } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles, enabled: !!article });

  const suggestions = useMemo(() => {
    if (!article) return [];
    if (article.articles_lies?.length > 0) return article.articles_lies.slice(0, 3);
    return articles
      .filter((a) => a.categorie === article.categorie && a.slug !== article.slug)
      .slice(0, 3);
  }, [article, articles]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ url, title: article?.titre }).catch(() => { });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <SiteLayout>
      <section className="py-[var(--space-16)]">
        <div className="container max-w-[44rem]">
          <p className="font-mono text-[length:var(--fs-mono)] opacity-70 mb-[var(--space-8)]">
            <SiteLink href="/blog" className="underline">BLOG</SiteLink> / {slug}
          </p>

          {status === 'pending' && <p className="font-mono text-[length:var(--fs-mono)] py-[var(--space-16)]">Chargement…</p>}
          {status === 'error' && (
            <div className="py-[var(--space-16)]">
              <p className="font-mono text-[length:var(--fs-mono)] mb-[var(--space-6)]">Article introuvable.</p>
              <SiteLink href="/blog" className="font-mono text-[length:var(--fs-mono)] font-semibold underline">
                RETOUR AU BLOG
              </SiteLink>
            </div>
          )}

          {status === 'success' && article && (
            <>
              <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.05em] opacity-75 mb-[var(--space-4)]">
                {CATEGORIE_LABEL[article.categorie] || article.categorie}
                {article.date_publication ? ` · ${article.date_publication}` : ''}
                {` · ${article.duree_lecture} MIN DE LECTURE`}
                {article.auteur ? ` · ${article.auteur}` : ''}
              </p>

              <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] mb-[var(--space-8)]">
                <RevealMask as="span" unit="lines">{article.titre}</RevealMask>
              </h1>

              {article.image && (
                <img src={article.image} alt="" className="w-full aspect-[16/9] object-cover border-[length:var(--bd)] border-[color:var(--bordure)] mb-[var(--space-10)]" />
              )}

              <div className="flex flex-col gap-[var(--space-6)] text-[length:var(--fs-body-lg)] leading-[1.7]">
                {article.corps.split(/\n{2,}/).map((paragraphe) => (
                  <p key={paragraphe.slice(0, 32)}>{paragraphe}</p>
                ))}
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="mt-[var(--space-10)] inline-flex items-center gap-[var(--space-2)] border-[length:var(--bd)] border-[color:var(--bordure)] px-[var(--space-5)] py-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.05em]"
              >
                {copied ? 'LIEN COPIÉ' : 'PARTAGER'}
              </button>

              {suggestions.length > 0 && (
                <div className="mt-[var(--space-20)]">
                  <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.08em] opacity-70 mb-[var(--space-6)]">
                    À LIRE AUSSI
                  </p>
                  <div className="grid gap-[var(--space-6)] sm:grid-cols-3">
                    {suggestions.map((s) => (
                      <Card
                        key={s.slug}
                        as={SiteLink}
                        href={`/blog/${s.slug}`}
                        visual={s.image
                          ? <img src={s.image} alt="" loading="lazy" />
                          : <div className="media-placeholder"><span>VISUEL — &lt;NON FOURNI&gt;</span></div>}
                      >
                        <h3 className="font-[family-name:var(--font-display)] text-[1.0625rem] font-bold leading-tight">{s.titre}</h3>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
