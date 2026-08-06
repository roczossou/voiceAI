// R01 — Mon histoire. Spec §D.2. Texte narratif complet non fourni (partie G,
// item 8) : on insère les trois paragraphes de présentation du dossier
// (infos.txt §2.2, les deux premiers déjà repris sur l'accueil dans
// QuickIntro.jsx, le troisième réservé à cette page) et un bloc <> visible
// pour le reste, conformément à la règle "ne rien inventer".
import { useRef } from 'react';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { useTilt } from '../../motion';

const PARAGRAPHES = [
  `Je suis Chabel ANANOUNON, entrepreneur, leader jeunesse, gestionnaire de
  projet, planificateur d'événements et créatif digital béninois. Ma passion
  pour l'innovation, la créativité et le leadership m'a conduit à développer
  plusieurs initiatives visant à accompagner les jeunes, promouvoir les
  talents et créer des opportunités durables grâce au numérique.`,
  `Convaincu que la jeunesse africaine constitue la plus grande richesse du
  continent, je mets mes compétences au service de projets innovants qui
  favorisent l'éducation, l'entrepreneuriat, la transformation digitale et le
  développement des compétences.`,
  `Mon ambition est de contribuer à bâtir une nouvelle génération de leaders
  capables d'utiliser la technologie, la créativité et l'innovation comme
  moteurs du développement économique et social.`,
].map((p) => p.replace(/\s+/g, ' ').trim());

export function Histoire() {
  const sectionRef = useConductorSection('histoire', 'Mon histoire');
  // La plaque du portrait se détache au pointeur : c'est la profondeur
  // demandée (2026-08-03), obtenue par rotation 3D, pas par une ombre.
  const portraitRef = useRef(null);
  useTilt(portraitRef, { max: 5, perspective: 1100, lift: 20 });

  return (
    <section ref={sectionRef} id="histoire" className="scroll-mt-[6rem] py-[var(--space-24)]">
      <div className="container">
        <SectionCartouche label="MON HISTOIRE" />
        <div className="grid items-start gap-x-[var(--space-12)] gap-y-[var(--space-10)] md:grid-cols-[minmax(0,20rem)_1fr]">
          <div ref={portraitRef} className="will-change-transform">
            <div
              className="flex aspect-[4/5] items-center justify-center border-[length:var(--bd)] border-[color:var(--bordure)] bg-[var(--calque-clair)] p-[var(--space-4)] text-center"
              role="img"
              aria-label="Portrait secondaire de Chabel ANANOUNON — non fourni"
            >
              <span className="font-mono text-[.7rem] tracking-[.08em] uppercase opacity-70">
                PORTRAIT — &lt;NON FOURNI&gt;
              </span>
            </div>
            <p className="mt-[var(--space-3)] flex items-center justify-between font-mono text-[length:var(--fs-mono)] uppercase tracking-[.1em] opacity-60">
              <span>PL. 01</span>
              <span>PORTRAIT</span>
            </p>
          </div>

          <div className="flex flex-col">
            {PARAGRAPHES.map((texte, i) => (
              <div
                key={texte.slice(0, 24)}
                className="grid grid-cols-[2.5rem_1fr] gap-[var(--space-4)] border-t-[length:var(--trait)] border-[color:var(--bordure)] py-[var(--space-6)]"
              >
                <span className="font-mono text-[length:var(--fs-mono)] tracking-[.1em] opacity-50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Pas de révélation individuelle ici : la section entière est
                    déjà enveloppée dans RevealSection (AProposPage.jsx). Deux
                    animations imbriquées se neutralisent — l'intérieure se
                    jouerait pendant que le parent est encore invisible. */}
                <p className="text-[length:var(--fs-body)] leading-[1.65]">{texte}</p>
              </div>
            ))}

            <div className="mt-[var(--space-6)] border-[length:var(--bd)] border-[color:var(--bordure)] p-[var(--space-5)]">
              <span className="font-mono text-[.7rem] tracking-[.08em] uppercase opacity-70">
                RÉCIT COMPLET — &lt;CONTENU À FOURNIR PAR CHABEL&gt;
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
