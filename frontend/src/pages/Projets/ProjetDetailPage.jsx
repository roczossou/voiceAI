// /projets/[slug] — fiche projet, spec §D.5 (ordre du chapitre 14). Chaque
// rubrique absente des données n'est pas rendue (pas de section vide, pas de
// faux contenu).
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { SiteLink } from '../../components/ui/SiteLink';
import { fetchProjet, fetchProjets } from '../../api/client';
import { Lightbox } from './Lightbox';
import './projets.css';
import './projet-detail.css';

export function ProjetDetailPage() {
  const { slug } = useParams();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { data: projet, status } = useQuery({
    queryKey: ['projet', slug],
    queryFn: () => fetchProjet(slug),
  });
  const { data: siblings = [] } = useQuery({ queryKey: ['projets'], queryFn: fetchProjets });

  const { prev, next } = useMemo(() => {
    const sorted = [...siblings].sort((a, b) => a.ordre - b.ordre);
    const i = sorted.findIndex((p) => p.slug === slug);
    if (i === -1) return { prev: null, next: null };
    return {
      prev: sorted[(i - 1 + sorted.length) % sorted.length] || null,
      next: sorted[(i + 1) % sorted.length] || null,
    };
  }, [siblings, slug]);

  const galleryItems = useMemo(() => {
    if (!projet) return [];
    const photos = (projet.galerie_photos || []).map((p) => ({
      id: `photo-${p.id}`, src: p.image, legende: p.legende, type: 'image',
    }));
    const videos = (projet.galerie_videos || []).map((v) => ({
      id: `video-${v.id}`, src: v.video || v.url_externe, legende: v.legende, type: 'video',
    }));
    return [...photos, ...videos];
  }, [projet]);

  if (status === 'pending') {
    return (
      <SiteLayout>
        <section className="container projet-detail-etat"><p>Chargement…</p></section>
      </SiteLayout>
    );
  }

  if (status === 'error' || !projet) {
    return (
      <SiteLayout>
        <section className="container projet-detail-etat">
          <p>Projet introuvable.</p>
          <SiteLink href="/projets">RETOUR AUX RÉALISATIONS</SiteLink>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="projet-detail">
        {projet.banniere && (
          <div className="projet-detail-banniere">
            <img src={projet.banniere} alt="" />
          </div>
        )}

        <div className="container">
          <header className="projet-detail-header">
            {projet.logo && <img className="projet-detail-logo" src={projet.logo} alt="" />}
            <h1>{projet.titre}</h1>
            {projet.resume && <p className="projet-detail-resume">{projet.resume}</p>}
          </header>

          {projet.presentation && (
            <section>
              <h2>PRÉSENTATION</h2>
              <p>{projet.presentation}</p>
            </section>
          )}

          {projet.contexte && (
            <section>
              <h2>CONTEXTE</h2>
              <p>{projet.contexte}</p>
            </section>
          )}

          {projet.objectifs?.length > 0 && (
            <section>
              <h2>OBJECTIFS</h2>
              <ul>{projet.objectifs.map((o) => <li key={o}>{o}</li>)}</ul>
            </section>
          )}

          {projet.public_cible && (
            <section>
              <h2>PUBLIC CIBLE</h2>
              <p>{projet.public_cible}</p>
            </section>
          )}

          {projet.resultats && (
            <section>
              <h2>RÉSULTATS</h2>
              <p>{projet.resultats}</p>
            </section>
          )}

          {projet.difficultes && (
            <section>
              <h2>DIFFICULTÉS RENCONTRÉES</h2>
              <p>{projet.difficultes}</p>
            </section>
          )}

          {projet.solutions && (
            <section>
              <h2>SOLUTIONS APPORTÉES</h2>
              <p>{projet.solutions}</p>
            </section>
          )}

          {galleryItems.length > 0 && (
            <section>
              <h2>GALERIE</h2>
              <div className="projets-galerie">
                {galleryItems.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    className="projets-galerie-item"
                    onClick={() => setLightboxIndex(i)}
                  >
                    {item.type === 'video'
                      ? <video src={item.src} muted />
                      : <img src={item.src} alt={item.legende || ''} />}
                  </button>
                ))}
              </div>
            </section>
          )}

          {projet.partenaires?.length > 0 && (
            <section>
              <h2>PARTENAIRES</h2>
              <ul className="projet-detail-partenaires">
                {projet.partenaires.map((p) => (
                  <li key={p.id}>
                    {p.logo ? <img src={p.logo} alt={p.nom} /> : p.nom}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="projet-detail-nav" aria-label="Navigation projet">
            {prev && prev.slug !== slug && (
              <SiteLink href={`/projets/${prev.slug}`} className="projet-detail-nav-prev">
                ← {prev.titre}
              </SiteLink>
            )}
            {next && next.slug !== slug && (
              <SiteLink href={`/projets/${next.slug}`} className="projet-detail-nav-next">
                {next.titre} →
              </SiteLink>
            )}
          </nav>
        </div>
      </article>

      {lightboxIndex !== null && (
        <Lightbox
          items={galleryItems}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </SiteLayout>
  );
}
