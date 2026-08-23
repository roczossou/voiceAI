import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RevealMask } from '../../motion';
import { prefersReducedMotion } from '../../motion/reducedMotion';
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
      <ul className="text-secondary-container font-headline-md text-headline-md h-10 overflow-hidden">
        <li>{ROTATING_TITLES[0]}</li>
      </ul>
    );
  }

  return (
    <div className="text-secondary-container font-headline-md text-headline-md h-10 overflow-hidden">
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
  );
}

export function Hero() {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden bg-primary w-full px-margin-mobile md:px-margin-desktop min-h-screen flex items-center">
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-display-lg font-black text-primary-fixed-dim/20 whitespace-nowrap pointer-events-none select-none z-0">
        CHABEL
      </div>

      <div className="max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        {/* Left Content (Text) */}
        <div className="flex flex-col items-start gap-8">
          {/* Badge */}
          <div className="bg-secondary-container text-on-background font-label-sm text-[11px] font-bold uppercase tracking-widest px-4 py-2 border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            DISPONIBLE POUR DE NOUVEAUX PROJETS
          </div>

          {/* Title */}
          <h1 className="font-display-lg-mobile text-[3rem] md:text-[5rem] md:font-display-lg text-white font-bold leading-[1.1] tracking-tight">
            Bienvenue, <br />
            je suis <br />
            <span className="text-secondary-container">Chabel </span>ANANOUNON.
          </h1>

          {/* Subtext */}
          <p className="font-body-md md:text-lg text-white/80 max-w-xl leading-relaxed">
            Je combine des principes de marketing agressifs avec une exécution esthétique immaculée pour construire des solutions numériques qui captent l'attention et stimulent la conversion.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-6 pt-4">
            <Link 
              to="/projets" 
              className="bg-secondary-container text-on-background font-label-sm font-bold text-sm uppercase px-8 py-4 border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
            >
              Découvrir mes projets
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link 
              to="/a-propos" 
              className="bg-transparent text-white font-label-sm font-bold text-sm uppercase px-8 py-4 border border-white hover:bg-white/10 transition-all"
            >
              Mon parcours
            </Link>
          </div>
        </div>

        {/* Right Content (Image) */}
        <div className="relative mt-16 lg:mt-0 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px] aspect-[4/5]">
            <div className="absolute inset-0 bg-secondary-container border border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] transform translate-x-4 translate-y-4 z-0"></div>
            <div className="relative z-10 w-full h-full border border-black bg-surface overflow-hidden">
              <img 
                alt="Chabel ANANOUNON de face, en tenue professionnelle" 
                className="w-full h-full object-cover object-top" 
                src={portraitImg}
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
