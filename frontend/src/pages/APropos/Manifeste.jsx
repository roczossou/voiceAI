import React from 'react';

export function Manifeste() {
  return (
    <section className="py-xl bg-gradient-to-b from-surface-container-lowest to-surface border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Section header */}
        <div className="mb-lg border-l-4 border-primary pl-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mon manifeste</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            La philosophie et les convictions qui animent mon travail.
          </p>
        </div>

        <div className="bg-surface border border-purple-200 glow-purple rounded-xl p-lg md:p-xl shadow-md card-sheen-beam relative overflow-hidden">
          {/* Decorative quote */}
          <span className="material-symbols-outlined text-primary/10 absolute top-md right-md text-[80px] pointer-events-none">format_quote</span>

          <div className="relative z-10">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">article</span>
              </div>
              <span className="font-label-bold text-[11px] text-purple-600 tracking-widest">MANIFESTE — CONTENU À FOURNIR</span>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface italic leading-relaxed max-w-3xl">
              « Ce contenu sera fourni par Chabel ANANOUNON. »
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
