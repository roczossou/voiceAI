import React from 'react';
import { Link } from 'react-router-dom';
import { useConductorSection } from '../../components/layout/useConductor';

export function DownloadCV() {
  const sectionRef = useConductorSection('cv', 'CV');

  return (
    <section ref={sectionRef} id="cv" className="py-xl bg-gradient-to-b from-surface-container-low to-surface border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="bg-gradient-to-r from-primary via-primary-container to-primary rounded-xl p-lg md:p-xl relative overflow-hidden shadow-xl">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute" style={{ top: '-15%', right: '-10%', width: 300, height: 300 }} viewBox="0 0 220 220" fill="none">
              <defs>
                <radialGradient id="cvRing1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff2d00" />
                  <stop offset="100%" stopColor="#ff7000" />
                </radialGradient>
              </defs>
              <circle cx="110" cy="110" r="80" stroke="url(#cvRing1)" strokeWidth="44" strokeOpacity="0.2" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-lg">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary-container text-on-secondary rounded-xl mb-md shadow-md">
                <span className="material-symbols-outlined text-[28px]">description</span>
              </div>
              <h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl font-extrabold text-on-primary mb-sm">
                Prêt à <span className="text-secondary-container">collaborer ?</span>
              </h2>
              <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-[28rem]">
                Découvrez mon parcours détaillé ou contactez-moi directement pour discuter de votre prochain projet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-md shrink-0">
              <a
                href="/CV_Chabel_ANANOUNON.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-sm font-label-bold text-label-bold text-on-secondary bg-secondary-container px-lg py-md rounded-full hover:scale-105 transition-all shadow-md tracking-wider"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Télécharger mon CV
              </a>
              <Link
                to="/contact"
                className="inline-flex justify-center items-center gap-sm font-label-bold text-label-bold text-on-primary bg-white/10 px-lg py-md border border-white/30 backdrop-blur-md rounded-full hover:bg-white/20 hover:scale-105 transition-all shadow-md tracking-wider"
              >
                Me contacter
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
