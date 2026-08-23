import { useConductorSection } from '../../components/layout/useConductor';

const TESTIMONIALS = [
  {
    texte: "Chabel a su transformer notre vision en une identité visuelle forte et moderne. Son professionnalisme et son approche stratégique ont fait toute la différence.",
    auteur: "Marie G.",
    role: "Directrice d'Agence"
  },
  {
    texte: "Un leader inspirant. Les formations qu'il a animées pour nos équipes ont débloqué une créativité que nous ne soupçonnions pas.",
    auteur: "Paul T.",
    role: "Entrepreneur"
  }
];

export function Testimonials() {
  const sectionRef = useConductorSection('temoignages', 'Témoignages');

  if (TESTIMONIALS.length === 0) return null;

  return (
    <section ref={sectionRef} id="temoignages" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase text-center mb-16 leading-none">
          ILS M'ONT <br/>
          <span className="text-secondary-container">FAIT CONFIANCE</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <div key={index} className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative">
              <span className="material-symbols-outlined absolute top-4 right-4 text-4xl text-secondary-container opacity-20">format_quote</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 italic relative z-10">
                "{t.texte}"
              </p>
              <div className="flex items-center gap-4 border-t-2 border-outline-variant pt-6">
                <div className="w-12 h-12 bg-secondary-container/20 border border-secondary-container rounded-full flex items-center justify-center">
                  <span className="font-headline-sm text-secondary-container uppercase">{t.auteur.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-headline-sm font-bold text-on-background uppercase">{t.auteur}</h4>
                  <p className="font-body-sm text-on-surface-variant">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
