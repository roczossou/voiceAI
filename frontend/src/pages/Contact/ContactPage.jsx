import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { useConductorSection } from '../../components/layout/useConductor';
import { RevealSection } from '../../motion';
import { createSpringValue } from '../../motion/spring';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { MessageForm } from './MessageForm';
import { RdvForm } from './RdvForm';
import { OBJET_LABELS } from './constants';

const TABS = [
  { id: 'message', label: 'MESSAGE', icon: 'mail' },
  { id: 'rdv', label: 'RENDEZ-VOUS', icon: 'event' },
];

function useTabIndicator(activeId, tabRefs) {
  const indicatorRef = useRef(null);
  const springs = useRef(null);

  useEffect(() => {
    if (!springs.current) {
      springs.current = {
        x: createSpringValue({
          value: 0, tension: 260, friction: 24,
          onUpdate: (v) => { if (indicatorRef.current) indicatorRef.current.style.transform = `translateX(${v}px)`; },
        }),
        width: createSpringValue({
          value: 0, tension: 260, friction: 24,
          onUpdate: (v) => { if (indicatorRef.current) indicatorRef.current.style.width = `${v}px`; },
        }),
      };
    }
    const activeEl = tabRefs.current[activeId];
    if (!activeEl || !indicatorRef.current) return;
    if (prefersReducedMotion()) {
      springs.current.x.jumpTo(activeEl.offsetLeft);
      springs.current.width.jumpTo(activeEl.offsetWidth);
    } else {
      springs.current.x.set(activeEl.offsetLeft);
      springs.current.width.set(activeEl.offsetWidth);
    }
  }, [activeId, tabRefs]);

  return indicatorRef;
}

export function ContactPage() {
  const sectionRef = useConductorSection('contact', 'Contact');
  const [searchParams] = useSearchParams();
  const objet = searchParams.get('objet');
  const [activeTab, setActiveTab] = useState(objet === 'rdv' ? 'rdv' : 'message');
  const tabRefs = useRef({});
  const indicatorRef = useTabIndicator(activeTab, tabRefs);

  const initialObjetLabel = objet && objet !== 'rdv' ? (OBJET_LABELS[objet] || '') : '';

  return (
    <SiteLayout>
      {/* Hero — conservé tel quel (première section) */}
      <section className="bg-primary text-on-primary pt-[140px] pb-[120px] md:pt-[180px] md:pb-[160px] px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/20 via-amber-500/20 to-purple-500/20 rounded-full blur-3xl animate-spin-slow pointer-events-none z-0" />
        <div className="max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter relative z-10">
          <div className="lg:col-span-8">
            <div className="hero-anim-badge">
              <span className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary text-xs font-bold px-4 py-1.5 rounded-full tracking-widest mb-6 border border-black/20 shadow-md">
                {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 dot-pulse-emerald" /> */}
                PRENONS CONTACT
              </span>
            </div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg mb-6 text-on-primary leading-none">
              Parlons de <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-secondary-container to-purple-300">votre projet</span>
            </h1>
            <p className="font-body-lg text-body-lg text-primary-fixed mb-10 ">
              Prêt à transformer vos idées en projets concrets ? Envoyez-moi un message ou réservez un rendez-vous directement.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={sectionRef} id="contact" className="py-xl bg-gradient-to-b from-surface-container-low to-surface border-t border-outline-variant/50">
        <div className="max-w-7xl mx-auto px-margin grid gap-lg lg:grid-cols-[1fr_340px]">

          {/* Form Panel */}
          <div>
            {/* Section header */}
            <div className="mb-lg border-l-4 border-primary pl-md">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Envoyer un message</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                Choisissez votre mode de contact et remplissez le formulaire.
              </p>
            </div>

            {/* Tabs */}
            <div role="tablist" aria-label="Type de demande" className="relative flex gap-md border-b border-outline-variant mb-lg">
              {TABS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  ref={(el) => { tabRefs.current[id] = el; }}
                  type="button"
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={activeTab === id}
                  aria-controls={`panel-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`pb-md font-label-bold text-[12px] tracking-wider transition-colors duration-150 flex items-center gap-xs ${activeTab === id ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">{icon}</span>
                  {label}
                </button>
              ))}
              <span ref={indicatorRef} aria-hidden="true" className="absolute bottom-[-2px] left-0 h-[3px] bg-secondary-container rounded-full" />
            </div>

            {/* Form card */}
            <div className="bg-surface p-lg md:p-xl border border-purple-200 glow-purple rounded-xl shadow-md card-sheen-beam">
              <div id="panel-message" role="tabpanel" aria-labelledby="tab-message" hidden={activeTab !== 'message'}>
                {activeTab === 'message' && <MessageForm initialObjet={initialObjetLabel} />}
              </div>
              <div id="panel-rdv" role="tabpanel" aria-labelledby="tab-rdv" hidden={activeTab !== 'rdv'}>
                {activeTab === 'rdv' && <RdvForm />}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <RevealSection as="aside" variant="slideRight" className="flex flex-col gap-md">
            {/* Coordonnées */}
            <div className="bg-surface p-lg border border-emerald-200 glow-emerald rounded-xl shadow-sm card-sheen-beam">
              <div className="flex items-center justify-between mb-md pb-sm border-b border-emerald-100">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">contact_page</span>
                  </div>
                  <h2 className="font-headline-md text-body-lg font-bold text-on-surface">Coordonnées</h2>
                </div>
                {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dot-pulse-emerald" /> */}
              </div>
              <dl className="flex flex-col gap-sm">
                {[
                  { label: 'E-mail', icon: 'mail', value: 'Disponible sur demande' },
                  { label: 'WhatsApp', icon: 'chat', value: 'Disponible sur demande' },
                  { label: 'Téléphone', icon: 'phone', value: 'Disponible sur demande' },
                  { label: 'Réseaux', icon: 'share', value: 'LinkedIn / X / GitHub' },
                ].map(({ label, icon, value }) => (
                  <div key={label} className="flex items-start gap-sm border-b border-emerald-100 pb-sm last:border-0">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">{icon}</span>
                    <div>
                      <dt className="font-label-bold text-[10px] text-on-surface-variant tracking-widest">{label.toUpperCase()}</dt>
                      <dd className="font-body-sm text-body-sm text-on-surface mt-0.5">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Disponibilité */}
            <div className="bg-surface p-lg border border-cyan-200 glow-cyan rounded-xl shadow-sm card-sheen-beam">
              <div className="flex items-center gap-sm mb-sm">
                <div className="w-10 h-10 bg-cyan-500/10 text-cyan-600 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <h2 className="font-headline-md text-body-lg font-bold text-on-surface">Disponibilité</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Du Lundi au Vendredi, 8h00 - 18h00 (GMT+1)</p>
            </div>

            {/* Localisation */}
            <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary p-lg rounded-xl border border-amber-400/30 shadow-md card-pop-elastic">
              <div className="flex items-center justify-between mb-sm">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 bg-secondary-container text-on-secondary rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <h2 className="font-headline-md text-body-lg font-bold text-on-primary">Localisation</h2>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 dot-pulse-amber" />
              </div>
              <p className="font-body-md text-body-md text-primary-fixed-dim mb-md font-medium">Covè, Zou, Bénin</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Cov%C3%A9%2C%20Zou%2C%20B%C3%A9nin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-sm text-on-secondary font-label-bold text-[11px] bg-secondary-container px-lg py-sm rounded-full hover:scale-105 transition-all shadow-md w-full tracking-wider"
              >
                OUVRIR DANS UNE CARTE
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      <ProchaineEtape courante="/contact" />
    </SiteLayout>
  );
}
