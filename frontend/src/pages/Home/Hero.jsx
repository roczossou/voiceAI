// R00 — Hero. Spec §D.1. SIMPLIFICATION ASSUMÉE : le bouton « ME CONTACTER »
// mène à /contact plutôt que d'ouvrir une modale de contact (aucun composant
// modale générique n'est défini par la spec en dehors du menu/lightbox/
// recherche — en construire un dédié dépasse le périmètre système de design).
import { useEffect, useRef, useState } from 'react';
import { RevealMask, useRevealTrace } from '../../motion';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { ButtonPrincipal, ButtonSecondaire } from '../../components/ui/Button';
import { SiteLink } from '../../components/ui/SiteLink';
import { MailIcon } from '../../components/ui/SocialIcons';
import { useConductorSection } from '../../components/layout/useConductor';
import { useParallax } from '../../motion';
import portraitImg from '../../assets/portrait-cutout.png';

const ROTATING_TITLES = [
  'Entrepreneur',
  'Leader Jeunesse',
  'Gestionnaire de Projet',
  "Planificateur d'Événements",
  "Fondateur d'AndroCréa",
  "Promoteur des DIGIT'S CRÉA AWARDS",
  'Créatif Digital',
  'Formateur',
  'Technicien Supérieur en Maintenance Industrielle',
];

function RotatingTitle() {
  const [index, setIndex] = useState(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_TITLES.length);
    }, 2660);
    return () => clearInterval(timer);
  }, [reduced]);

  if (reduced) {
    return (
      <ul className="hero-titles-static">
        {ROTATING_TITLES.map((title) => <li key={title}>{title}</li>)}
      </ul>
    );
  }

  return (
    <div className="hero-titles">
      <span className="hero-titles-dot" aria-hidden="true" />
      <div className="hero-titles-track" aria-hidden="true">
        <RevealMask
          as="span"
          unit="lines"
          trigger="immediate"
          replayKey={index}
          duration={0.46}
          ease="power2.inOut"
        >
          {ROTATING_TITLES[index]}
        </RevealMask>
      </div>
      <ul className="sr-only">
        {ROTATING_TITLES.map((title) => <li key={title}>{title}</li>)}
      </ul>
    </div>
  );
}

export function Hero() {
  const sectionRef = useConductorSection('hero', 'Hero');
  const underlineRef = useRef(null);
  useRevealTrace(underlineRef, { duration: 0.6 });
  const watermarkRef = useRef(null);
  useParallax(watermarkRef, { from: 0, to: 6 });

  return (
    <section ref={sectionRef} id="hero" className="hero">
      <div ref={watermarkRef} className="watermark-grid hero-watermark" aria-hidden="true" />
      <div className="container grid-12 hero-grid">
        <div className="hero-lead col-content">
          <h1 className="hero-title">
            <RevealMask as="span" className="hero-title-line" unit="lines" stagger={0.13} duration={1}>
              CHABEL
            </RevealMask>
            <span className="hero-title-line hero-title-line-underlined">
              <RevealMask as="span" unit="lines" stagger={0.13} duration={1}>ANANOUNON</RevealMask>
              <span ref={underlineRef} className="hero-underline" aria-hidden="true" />
            </span>
          </h1>

          <RotatingTitle />

          <p className="hero-slogan">Je transforme le potentiel en puissance.</p>

          <div className="hero-actions">
            <ButtonSecondaire as={SiteLink} href="/contact">
              <MailIcon className="hero-btn-icon" />
              <span>ME CONTACTER</span>
            </ButtonSecondaire>
            <ButtonPrincipal as={SiteLink} href="/projets">
              <span>DÉCOUVRIR MES PROJETS</span>
              <svg className="hero-btn-icon" viewBox="0 0 24 24" width="1.1rem" height="1.1rem" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </ButtonPrincipal>
          </div>
        </div>

        <div className="hero-deco" aria-hidden="true">
          <span className="hero-deco-mark mark-square" />
          <span className="hero-deco-diamond mark-square" />
          <span className="hero-deco-dot mark-square" />
        </div>

        <div className="hero-portrait-col col-content">
          <div className="hero-portrait-frame">
            <img
              className="hero-portrait"
              src={portraitImg}
              alt="Chabel ANANOUNON de face, en tenue professionnelle"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
