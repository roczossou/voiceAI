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
      {/* Background Watermark & Animated Glow Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-display-lg font-black text-primary-fixed-dim/15 whitespace-nowrap pointer-events-none select-none z-0">
        CHABEL
      </div>
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/20 via-cyan-500/20 to-amber-500/20 rounded-full blur-3xl animate-spin-slow pointer-events-none z-0" />

      <div className="max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        {/* Left Content (Text) */}
        <div className="flex flex-col items-start gap-8">
          {/* Badge avec point lumineux vert émeraude */}
          <div className="hero-anim-badge flex items-center gap-2 bg-secondary-container text-on-secondary font-label-sm text-[11px] font-bold tracking-widest px-4 py-2 border border-emerald-400/40 rounded-full shadow-md">
            {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 dot-pulse-emerald inline-block" /> */}
            <span>DISPONIBLE POUR DE NOUVEAUX PROJETS</span>
          </div>

          {/* Title */}
          <div className="hero-anim-title">
            <h1 className="font-display-lg-mobile text-[3rem] md:text-[5rem] md:font-display-lg text-white font-bold leading-[1.1] tracking-tight">
              Bienvenue, <br />
              je suis <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-secondary-container to-purple-300">Chabel </span>ANANOUNON.
            </h1>
            <div className="mt-2">
              <RotatingTitle />
            </div>
          </div>

          {/* Subtext */}
          <p className="hero-anim-text font-body-md md:text-lg text-white/90  leading-relaxed">
            Je combine des principes de marketing stratégiques avec une exécution esthétique immaculée pour construire des solutions numériques qui captent l'attention et stimulent la conversion.
          </p>

          {/* Buttons */}
          <div className="hero-anim-btn flex flex-wrap gap-6 pt-4">
            <Link
              to="/projets"
              className="bg-secondary-container text-on-secondary font-label-sm font-bold text-sm px-8 py-4 border border-amber-400/50 hover:scale-105 transition-all flex items-center gap-2 rounded-2xl shadow-md"
            >
              <span>Découvrir mes projets</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link
              to="/a-propos"
              className="bg-white/10 text-white font-label-sm font-bold text-sm px-8 py-4 border border-white/30 backdrop-blur-md hover:bg-white/20 hover:scale-105 transition-all rounded-2xl shadow-md"
            >
              Mon parcours
            </Link>
          </div>
        </div>

        {/* Right Content (Portrait avec entrée extravagante et flottaison 3D) */}
        <div className="hero-anim-portrait relative mt-16 lg:mt-0 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px] aspect-[4/5] animate-hero-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 via-secondary-container to-purple-600 border border-purple-400/40 glow-purple shadow-xl transform translate-x-4 translate-y-4 z-0 rounded-3xl"></div>
            <div className="relative z-10 w-full h-full border border-outline-variant bg-surface overflow-hidden rounded-3xl shadow-2xl">
              <img
                alt="Chabel ANANOUNON de face, en tenue professionnelle"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
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
