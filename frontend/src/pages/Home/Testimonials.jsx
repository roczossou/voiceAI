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
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background text-center mb-16 leading-none">
          Ils m'ont <br />
          <span className="text-secondary-container">fait confiance</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, index) => {
            const accents = [
              { border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple', dot: 'bg-purple-500 dot-pulse-purple', quote: 'text-purple-500', avatarBg: 'bg-purple-500/10 border-purple-200 text-purple-600' },
              { border: 'border-emerald-200 hover:border-emerald-500', glow: 'glow-emerald', dot: 'bg-emerald-500 dot-pulse-emerald', quote: 'text-emerald-500', avatarBg: 'bg-emerald-500/10 border-emerald-200 text-emerald-600' },
            ];
            const acc = accents[index % accents.length];
            return (
              <div key={index} className={`bg-surface border ${acc.border} ${acc.glow} rounded-2xl p-8 card-sheen-beam shadow-md relative`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`material-symbols-outlined text-4xl ${acc.quote} opacity-40`}>format_quote</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${acc.dot}`} />
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 italic relative z-10 leading-relaxed">
                  "{t.texte}"
                </p>
                <div className="flex items-center gap-4 border-t border-outline-variant/60 pt-6">
                  <div className={`w-12 h-12 border rounded-full flex items-center justify-center font-bold ${acc.avatarBg}`}>
                    <span className="font-headline-sm ">{t.auteur.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm font-bold text-on-background ">{t.auteur}</h4>
                    <p className="font-body-sm text-on-surface-variant font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
