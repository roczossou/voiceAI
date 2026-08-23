import { useState } from 'react';

const FAQS = [
  {
    question: "Comment pouvons-nous collaborer sur un projet ?",
    answer: "Vous pouvez me contacter via la page Contact pour demander un devis ou planifier un rendez-vous. Nous discuterons de vos besoins et je vous proposerai une solution sur-mesure."
  },
  {
    question: "Quels types de services proposez-vous ?",
    answer: "J'interviens principalement dans le design graphique, la communication digitale, la gestion de projet, l'événementiel, et la formation. Je vous accompagne de l'idéation à la réalisation."
  },
  {
    question: "Intervenez-vous uniquement au Bénin ?",
    answer: "Bien que basé au Bénin, je collabore avec des clients et partenaires à l'international grâce aux outils digitaux."
  },
  {
    question: "Proposez-vous des formations sur mesure ?",
    answer: "Absolument. Je conçois et anime des modules de formation adaptés aux besoins spécifiques de vos équipes, notamment en créativité digitale, design et leadership."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
      <div className="max-w-max-width mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase mb-6">
            FAQ <br/>
            <span className="text-secondary-container">QUESTIONS</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
            Vous avez des questions sur mon expertise ou mes services ? Voici quelques réponses fréquentes.
          </p>
        </div>
        
        <div className="md:col-span-7 flex flex-col gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border-2 transition-colors ${isOpen ? 'border-secondary-container bg-secondary-container/5' : 'border-outline-variant hover:border-primary/50'}`}
              >
                <button 
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-headline-md text-headline-md text-on-background uppercase pr-4">
                    {faq.question}
                  </span>
                  <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-secondary-container' : 'text-on-surface-variant'}`}>
                    expand_more
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="p-6 pt-0 font-body-md text-body-md text-on-surface-variant">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
