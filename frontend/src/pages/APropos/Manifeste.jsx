import React from 'react';

export function Manifeste() {
  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop bg-on-surface text-on-primary">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-secondary-container mb-16 uppercase">MON MANIFESTE</h2>
        <div className="max-w-3xl border-2 border-on-surface-variant p-8 md:p-12 shadow-lg">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-4">MANIFESTE — &lt;CONTENU À FOURNIR PAR CHABEL&gt;</span>
          <p className="font-body-lg text-body-lg text-on-primary-container italic leading-relaxed">
            « Ce contenu sera fourni par Chabel ANANOUNON. »
          </p>
        </div>
      </div>
    </section>
  );
}
