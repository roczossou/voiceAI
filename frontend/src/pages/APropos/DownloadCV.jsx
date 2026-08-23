import React from 'react';
import { Link } from 'react-router-dom';
import { useConductorSection } from '../../components/layout/useConductor';

export function DownloadCV() {
  const sectionRef = useConductorSection('cv', 'CV');

  return (
    <section ref={sectionRef} id="cv" className="py-24 px-margin-mobile md:px-margin-desktop bg-primary text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30 z-0"></div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-white uppercase mb-6">
          Prêt à <span className="text-secondary-container">collaborer ?</span>
        </h2>
        <p className="font-body-lg text-lg text-white/80 mb-12 max-w-xl mx-auto">
          Découvrez mon parcours détaillé ou contactez-moi directement pour discuter de votre prochain projet.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a 
            href="/CV_Chabel_ANANOUNON.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center gap-2 font-label-lg font-bold text-on-background bg-secondary-container px-8 py-4 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all uppercase"
          >
            <span className="material-symbols-outlined">download</span>
            Télécharger mon CV
          </a>
          
          <Link 
            to="/contact" 
            className="inline-flex justify-center items-center gap-2 font-label-lg font-bold text-white bg-transparent px-8 py-4 border-2 border-white hover:bg-white hover:text-primary transition-colors uppercase"
          >
            Me contacter
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
