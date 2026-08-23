import { useConductorSection } from '../../components/layout/useConductor';
import { Link } from 'react-router-dom';
import { RevealMask } from '../../motion';

export function QuickIntro() {
  const sectionRef = useConductorSection('presentation', 'Présentation');

  return (
    <section ref={sectionRef} id="presentation" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
      <div className="max-w-max-width mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-secondary-container to-primary opacity-20 blur-2xl rounded-full z-0"></div>
          <div className="relative z-10 border-l-4 border-secondary-container pl-6 py-2">
            <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase leading-none">
              À PROPOS <br/>
              <span className="text-secondary-container">DE MOI</span>
            </h2>
          </div>
        </div>
        
        <div className="md:col-span-7 flex flex-col gap-6">
          <p className="font-body-lg text-body-lg md:text-xl text-on-background leading-relaxed">
            <RevealMask as="span" unit="lines">
              Je suis Chabel ANANOUNON, entrepreneur, leader jeunesse, gestionnaire de
              projet, planificateur d&apos;événements et créatif digital béninois. Ma
              passion pour l&apos;innovation, la créativité et le leadership m&apos;a
              conduit à développer plusieurs initiatives visant à accompagner les
              jeunes, promouvoir les talents et créer des opportunités durables grâce
              au numérique.
            </RevealMask>
          </p>
          <p className="font-body-md md:text-lg text-on-surface-variant leading-relaxed">
            <RevealMask as="span" unit="lines">
              Convaincu que la jeunesse africaine constitue la plus grande richesse du
              continent, je mets mes compétences au service de projets innovants qui
              favorisent l&apos;éducation, l&apos;entrepreneuriat, la transformation
              digitale et le développement des compétences.
            </RevealMask>
          </p>
          <div className="pt-4">
            <Link 
              to="/a-propos" 
              className="inline-flex items-center gap-2 font-label-lg text-label-lg font-bold text-on-background bg-secondary-container px-6 py-3 border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all uppercase"
            >
              LIRE MON HISTOIRE COMPLÈTE
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
