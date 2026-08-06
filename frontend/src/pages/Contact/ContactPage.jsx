// /contact — spec §D.12, deux onglets. Plan (méthode C.12) :
//   1. Sections : titre de page · tablist MESSAGE/RENDEZ-VOUS (liseré
//      jaune-signal en ressort) · formulaire actif · colonne latérale
//      (coordonnées, horaires, localisation, lien carte externe).
//   2. Composants réutilisés : SiteLayout, createSpringValue (motion/spring),
//      reducedMotion.
//   3. Spécifique à cette page : onglet piloté par ?objet= (rdv → RENDEZ-
//      VOUS, sinon MESSAGE avec préremplissage du champ Objet) ; POST vers
//      /api/demandes/ (MessageForm.jsx / RdvForm.jsx) ; pas d'iframe carte,
//      un lien externe seul (spec — coût et cookies tiers évités).
//   4. Coordonnées (e-mail, WhatsApp, téléphone, réseaux) et horaires de
//      disponibilité non fournis (partie G, item 4) : bloc <> par ligne,
//      aucune invention. Localisation "Covè, Zou, Bénin" : donnée réelle déjà
//      utilisée ailleurs sur le site (plaque du Hero).
//   5. Page nouvelle au sens de CLAUDE.md : TailwindCSS + valeurs arbitraires
//      sur les tokens, pas de CSS dédié.
//   6. Vérifié : 360px sans débordement (colonne latérale passe sous le
//      formulaire), focus visible, reduce-motion (liseré saute directement,
//      pas de ressort), thème sombre, zéro contenu inventé.
//   7. Effet retiré : pas de transition d'entrée/sortie animée entre les deux
//      formulaires au changement d'onglet (un remplacement direct suffit et
//      évite un flash de contenu superposé pendant le ressort du liseré).
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { useConductorSection } from '../../components/layout/useConductor';
import { SiteLink } from '../../components/ui/SiteLink';
import {
  RevealMask, RevealSection, useParallax, useTilt,
} from '../../motion';
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
          value: 0,
          tension: 260,
          friction: 24,
          onUpdate: (v) => { if (indicatorRef.current) indicatorRef.current.style.transform = `translateX(${v}px)`; },
        }),
        width: createSpringValue({
          value: 0,
          tension: 260,
          friction: 24,
          onUpdate: (v) => { if (indicatorRef.current) indicatorRef.current.style.width = `${v}px`; },
        }),
      };
    }

    const activeEl = tabRefs.current[activeId];
    if (!activeEl || !indicatorRef.current) return;
    const x = activeEl.offsetLeft;
    const width = activeEl.offsetWidth;

    if (prefersReducedMotion()) {
      springs.current.x.jumpTo(x);
      springs.current.width.jumpTo(width);
    } else {
      springs.current.x.set(x);
      springs.current.width.set(width);
    }
  }, [activeId, tabRefs]);

  return indicatorRef;
}

function ContactHero() {
  const planRef = useRef(null);
  useParallax(planRef, { from: -6, to: 10 });

  return (
    <section className="relative flex min-h-[52svh] items-end overflow-hidden pt-[7rem] pb-[var(--space-14)]">
      <div
        ref={planRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[15%] left-0 hidden h-[130%] w-[40%] bg-[var(--calque-clair)] md:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[12%] z-[1] select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[18vw] font-extrabold uppercase leading-none tracking-[-.02em] text-[var(--graphite)] opacity-[.07]"
      >
        ÉCHANGE
      </span>

      <div className="container relative z-10">
        <p className="mb-[var(--space-6)] flex items-center gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.14em] opacity-70">
          <span className="mark-square inline-block h-[.375rem] w-[.375rem] bg-[var(--jaune-signal)]" />
          <SiteLink href="/">ACCUEIL</SiteLink>
          <span aria-hidden="true">/</span>
          <span className="opacity-100">CONTACT</span>
        </p>
        <h1 className="max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold uppercase leading-[.86] tracking-[-.01em]">
          <RevealMask as="span" unit="lines" stagger={0.13} duration={1}>
            PARLONS DE VOTRE PROJET
          </RevealMask>
        </h1>
      </div>
    </section>
  );
}

export function ContactPage() {
  const sectionRef = useConductorSection('contact', 'Contact');
  const [searchParams] = useSearchParams();
  const objet = searchParams.get('objet');
  const [activeTab, setActiveTab] = useState(objet === 'rdv' ? 'rdv' : 'message');
  const tabRefs = useRef({});
  const indicatorRef = useTabIndicator(activeTab, tabRefs);
  const coordonneesRef = useRef(null);
  useTilt(coordonneesRef, { max: 6, perspective: 1000, lift: 16 });

  const initialObjetLabel = objet && objet !== 'rdv' ? (OBJET_LABELS[objet] || '') : '';

  return (
    <SiteLayout>
      <ContactHero />

      <section ref={sectionRef} id="contact" className="pb-[var(--space-16)]">
        <div className="container grid gap-[var(--space-16)] lg:grid-cols-[1fr_20rem]">
          <div>
            <div role="tablist" aria-label="Type de demande" className="relative flex gap-[var(--space-8)] border-b-[length:var(--bd)] border-[color:var(--bordure)] mb-[var(--space-10)]">
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
                  className={`pb-[var(--space-4)] font-mono text-[length:var(--fs-mono-lg)] font-semibold tracking-[.05em] uppercase transition-colors duration-150 ${
                    activeTab === id ? 'text-[var(--graphite)]' : 'text-[var(--graphite)] opacity-50'
                  }`}
                >
                  {label}
                </button>
              ))}
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className="absolute bottom-[-1px] left-0 h-[2px] bg-[var(--jaune-signal)]"
              />
            </div>

            <div id="panel-message" role="tabpanel" aria-labelledby="tab-message" hidden={activeTab !== 'message'}>
              {activeTab === 'message' && <MessageForm initialObjet={initialObjetLabel} />}
            </div>
            <div id="panel-rdv" role="tabpanel" aria-labelledby="tab-rdv" hidden={activeTab !== 'rdv'}>
              {activeTab === 'rdv' && <RdvForm />}
            </div>
          </div>

          {/* Colonne latérale : variante opposée à celle du formulaire pour
              que les deux colonnes ne se déplacent pas dans le même sens.
              Les champs du formulaire, eux, ne sont jamais animés
              individuellement — ça gênerait la saisie. */}
          <RevealSection as="aside" variant="slideRight" className="flex flex-col gap-[var(--space-10)]">
            <div ref={coordonneesRef} className="will-change-transform border-[length:var(--bd)] border-[color:var(--bordure)] p-[var(--space-5)]">
              <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.08em] uppercase opacity-70 mb-[var(--space-4)]">COORDONNÉES</p>
              <dl className="flex flex-col gap-[var(--space-3)] font-mono text-[length:var(--fs-mono)]">
                <div className="flex justify-between gap-[var(--space-4)]">
                  <dt className="opacity-70">E-MAIL</dt>
                  <dd>&lt;NON FOURNI&gt;</dd>
                </div>
                <div className="flex justify-between gap-[var(--space-4)]">
                  <dt className="opacity-70">WHATSAPP</dt>
                  <dd>&lt;NON FOURNI&gt;</dd>
                </div>
                <div className="flex justify-between gap-[var(--space-4)]">
                  <dt className="opacity-70">TÉLÉPHONE</dt>
                  <dd>&lt;NON FOURNI&gt;</dd>
                </div>
                <div className="flex justify-between gap-[var(--space-4)]">
                  <dt className="opacity-70">RÉSEAUX</dt>
                  <dd>&lt;NON FOURNI&gt;</dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.08em] uppercase opacity-70 mb-[var(--space-4)]">HORAIRES DE DISPONIBILITÉ</p>
              <p className="font-mono text-[length:var(--fs-mono)]">&lt;NON FOURNI&gt;</p>
            </div>

            <div>
              <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.08em] uppercase opacity-70 mb-[var(--space-4)]">LOCALISATION</p>
              <p className="mb-[var(--space-4)]">Covè, Zou, Bénin</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Cov%C3%A9%2C%20Zou%2C%20B%C3%A9nin"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-[var(--space-2)] border-[length:var(--bd)] border-[color:var(--bordure)] px-[var(--space-5)] py-[var(--space-3)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.05em]"
              >
                OUVRIR DANS UNE CARTE ↗
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      <ProchaineEtape courante="/contact" />
    </SiteLayout>
  );
}
