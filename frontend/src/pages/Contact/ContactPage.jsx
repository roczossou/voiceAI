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
  { id: 'message', label: 'MESSAGE' },
  { id: 'rdv', label: 'RENDEZ-VOUS' },
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
      {/* Hero */}
      <section className="bg-primary text-on-primary py-[120px] md:py-[160px] px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter relative z-10">
          <div className="lg:col-span-8">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg mb-6 text-on-primary uppercase">
              PARLONS DE <span className="text-secondary-container">VOTRE PROJET</span>
            </h1>
            <p className="font-body-lg text-body-lg text-primary-fixed mb-10 max-w-2xl">
              Prêt à transformer vos idées en projets concrets ? Envoyez-moi un message ou réservez un rendez-vous directement.
            </p>
          </div>
        </div>
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary-container rounded-full blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      </section>

      {/* Content */}
      <section ref={sectionRef} id="contact" className="py-[120px] px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-max-width mx-auto grid gap-[64px] lg:grid-cols-[1fr_360px]">
          
          {/* Form Panel */}
          <div>
            {/* Tabs */}
            <div role="tablist" aria-label="Type de demande" className="relative flex gap-8 border-b-2 border-primary/20 mb-10">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  ref={(el) => { tabRefs.current[id] = el; }}
                  type="button"
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={activeTab === id}
                  aria-controls={`panel-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`pb-4 font-label-lg text-label-lg uppercase tracking-wider transition-colors duration-150 ${activeTab === id ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  {label}
                </button>
              ))}
              <span ref={indicatorRef} aria-hidden="true" className="absolute bottom-[-2px] left-0 h-[3px] bg-secondary-container" />
            </div>

            <div className="bg-surface p-8 md:p-12 border-2 border-primary shadow-lg">
              <div id="panel-message" role="tabpanel" aria-labelledby="tab-message" hidden={activeTab !== 'message'}>
                {activeTab === 'message' && <MessageForm initialObjet={initialObjetLabel} />}
              </div>
              <div id="panel-rdv" role="tabpanel" aria-labelledby="tab-rdv" hidden={activeTab !== 'rdv'}>
                {activeTab === 'rdv' && <RdvForm />}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <RevealSection as="aside" variant="slideRight" className="flex flex-col gap-8">
            {/* Coordonnées */}
            <div className="bg-surface p-6 border-2 border-primary hover:-translate-y-1 transition-transform shadow-md">
              <h2 className="font-label-lg text-label-lg text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">contact_page</span>
                COORDONNÉES
              </h2>
              <dl className="flex flex-col gap-4">
                {[
                  { label: 'E-MAIL', icon: 'mail', value: '<NON FOURNI>' },
                  { label: 'WHATSAPP', icon: 'chat', value: '<NON FOURNI>' },
                  { label: 'TÉLÉPHONE', icon: 'phone', value: '<NON FOURNI>' },
                  { label: 'RÉSEAUX', icon: 'share', value: '<NON FOURNI>' },
                ].map(({ label, icon, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary-container text-[20px] mt-0.5">{icon}</span>
                    <div>
                      <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</dt>
                      <dd className="font-body-md text-body-md text-on-background mt-0.5">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Horaires */}
            <div className="bg-surface p-6 border-2 border-primary hover:-translate-y-1 transition-transform shadow-md">
              <h2 className="font-label-lg text-label-lg text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">schedule</span>
                DISPONIBILITÉ
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">&lt;NON FOURNI&gt;</p>
            </div>

            {/* Localisation */}
            <div className="bg-primary text-on-primary p-6 hover:-translate-y-1 transition-transform shadow-md">
              <h2 className="font-label-lg text-label-lg text-secondary-container uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">location_on</span>
                LOCALISATION
              </h2>
              <p className="font-body-md text-body-md text-on-primary mb-4">Covè, Zou, Bénin</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Cov%C3%A9%2C%20Zou%2C%20B%C3%A9nin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-secondary-container text-on-background font-label-lg text-label-lg px-5 py-3 hover:bg-secondary transition-colors"
              >
                OUVRIR DANS UNE CARTE
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      <ProchaineEtape courante="/contact" />
    </SiteLayout>
  );
}
