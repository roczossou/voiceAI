// Section "Mon parcours" — fusionnée dans /a-propos sur décision du client
// (2026-08-02), au lieu de la route /parcours séparée de spec §D.3. Reprend
// le contenu de §D.3 tel quel : groupe académique + formations complémentaires
// en bornes statiques (contenu littéral du dossier, infos.txt §3.1/§9),
// groupe expériences professionnelles en timeline (données back-office,
// aucune entrée fictive tant que /api/experiences/ est vide), puis la section
// #competences (page Compétences fusionnée ici, §D.3 fin).
//
// Simplification assumée : le "conducteur en mode timeline" de la spec (nœud
// par entrée, scrub ScrollTrigger sur toute la section) est réduit ici à un
// trait vertical + nœuds à révélation simple par IntersectionObserver, dans
// le même esprit de simplification documenté pour PageConductor (CLAUDE.md) —
// à revoir si la fidélité pixel-perfect devient nécessaire.
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { useParallax, useRevealRise, useRevealSection, useRevealStagger } from '../../motion';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { fetchCompetences, fetchExperiences } from '../../api/client';

const ACADEMIQUE = [
  'CAP Électricité',
  'BAC Technique F3',
  'Licence Professionnelle en Maintenance des Systèmes Industriels',
];

const FORMATIONS_COMPLEMENTAIRES = [
  'Photovoltaïque', 'Maintenance', 'Bureautique', 'Communication',
  'Design graphique', 'Gestion de projet', 'Autres certifications',
];

const CATEGORIES_COMPETENCES = [
  { key: 'digitale', label: 'Compétences digitales' },
  { key: 'gestion', label: 'Compétences en gestion' },
  { key: 'technique', label: 'Compétences techniques' },
  { key: 'soft', label: 'Soft skills' },
];

const NIVEAU_N = { maitrise: 3, avance: 2, operationnel: 1 };
const NIVEAU_LABEL = { maitrise: 'MAÎTRISE', avance: 'AVANCÉ', operationnel: 'OPÉRATIONNEL' };

function GroupeCartouche({ children }) {
  return (
    <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.08em] uppercase pb-[var(--space-3)] border-b-[length:var(--trait)] border-[color:var(--bordure)] mb-[var(--space-6)]">
      {children}
    </p>
  );
}

function Borne({ children }) {
  return (
    <span className="inline-block border-[length:var(--trait)] border-[color:var(--bordure)] px-[var(--space-4)] py-[var(--space-2)] font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.05em] uppercase">
      {children}
    </span>
  );
}

function TimelineNode() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      if (el) el.dataset.filled = 'true';
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.dataset.filled = 'true';
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      data-filled="false"
      className="mark-square inline-block h-3 w-3 border-[length:2.5px] border-[color:var(--bordure)] bg-[var(--calque)] transition-colors duration-150 data-[filled=true]:bg-[var(--jaune-signal)] data-[filled=true]:border-[color:var(--jaune-signal)]"
      aria-hidden="true"
    />
  );
}

function formatPeriode(debut, fin) {
  const debutAn = debut ? new Date(debut).getFullYear() : '';
  const finAn = fin ? new Date(fin).getFullYear() : 'EN COURS';
  return `${debutAn} — ${finAn}`;
}

function ExperienceEntry({ experience, index }) {
  const ref = useRef(null);
  useRevealRise(ref, { delayIn: index * 70 });

  return (
    <div
      ref={ref}
      className="grid grid-cols-[7rem_1fr] gap-[var(--space-8)] py-[var(--space-10)] border-b-[length:var(--trait)] border-[color:var(--bordure)]"
    >
      <div className="flex items-start gap-[var(--space-2)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase">
        <TimelineNode />
        {formatPeriode(experience.periode_debut, experience.periode_fin)}
      </div>
      <div className="flex flex-col gap-[var(--space-3)]">
        <h3 className="font-[family-name:var(--font-display)] text-[1.5rem] font-bold uppercase leading-none">
          {experience.structure}
        </h3>
        <p className="font-[family-name:var(--font-body)] font-semibold text-[length:var(--fs-body)]">{experience.poste}</p>

        {experience.missions?.length > 0 && (
          <div>
            <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.05em] uppercase opacity-70 mb-[var(--space-2)]">MISSIONS</p>
            <ul className="flex flex-col gap-[var(--space-1)]">
              {experience.missions.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </div>
        )}
        {experience.competences?.length > 0 && (
          <div>
            <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.05em] uppercase opacity-70 mb-[var(--space-2)]">COMPÉTENCES DÉVELOPPÉES</p>
            <p>{experience.competences.map((c) => c.libelle).join(' · ')}</p>
          </div>
        )}
        {experience.resultats && (
          <div>
            <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.05em] uppercase opacity-70 mb-[var(--space-2)]">RÉSULTATS OBTENUS</p>
            <p>{experience.resultats}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CompetenceItem({ competence }) {
  const n = NIVEAU_N[competence.niveau] ?? 0;

  return (
    <div
      data-reveal-item
      className="flex items-center justify-between gap-[var(--space-4)] border-[length:var(--trait)] border-[color:rgba(228,234,238,.45)] px-[var(--space-5)] py-[var(--space-3)]"
    >
      <span>{competence.libelle}</span>
      <span className="flex items-center gap-[var(--space-3)] shrink-0">
        <span className="flex gap-1" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`mark-square inline-block h-[.375rem] w-[.375rem] ${i <= n ? 'bg-[var(--led-vert)]' : 'border-[length:1.5px] border-[color:rgba(228,234,238,.45)]'}`}
            />
          ))}
        </span>
        {competence.niveau && (
          <span className="font-mono text-[length:var(--fs-mono)] opacity-80">{NIVEAU_LABEL[competence.niveau]}</span>
        )}
      </span>
    </div>
  );
}

export function Parcours() {
  const sectionRef = useConductorSection('parcours', 'Mon parcours');
  const watermarkRef = useRef(null);
  useParallax(watermarkRef, { from: 0, to: 6 });
  const { data: experiences = [] } = useQuery({ queryKey: ['experiences'], queryFn: fetchExperiences });
  const { data: competences = [] } = useQuery({ queryKey: ['competences'], queryFn: fetchCompetences });

  // Déclaré APRÈS les requêtes : `competences.length` sert de dépendance au
  // stagger, qui doit se rejouer une fois les cartes réellement rendues.
  const competencesRef = useRef(null);
  useRevealSection(competencesRef, { variant: 'tilt3d' });
  useRevealStagger(competencesRef, { itemCount: competences.length });

  return (
    <section ref={sectionRef} id="parcours" className="scroll-mt-[6rem] py-[var(--space-24)] relative overflow-hidden">
      {/* Trame millimétrée retirée ici aussi (2026-08-03) : le client n'aime
          pas le rendu « cahier ». Remplacée par un bandeau plein décalé en
          parallaxe, qui structure la section sans texture. */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[10%] left-0 -z-10 h-[120%] w-full bg-[var(--calque-clair)]"
      />
      <div className="container relative flex flex-col gap-[var(--space-16)]">
        <SectionCartouche label="MON PARCOURS" />

        <div>
          <GroupeCartouche>Académique</GroupeCartouche>
          <div className="flex flex-wrap gap-[var(--space-3)]">
            {ACADEMIQUE.map((item) => <Borne key={item}>{item}</Borne>)}
          </div>
        </div>

        <div>
          <GroupeCartouche>Formations complémentaires</GroupeCartouche>
          <div className="flex flex-wrap gap-[var(--space-3)]">
            {FORMATIONS_COMPLEMENTAIRES.map((item) => <Borne key={item}>{item}</Borne>)}
          </div>
        </div>

        <div>
          <GroupeCartouche>Expériences professionnelles</GroupeCartouche>
          {experiences.length > 0 ? (
            <div>
              {experiences.map((exp, i) => <ExperienceEntry key={exp.id} experience={exp} index={i} />)}
            </div>
          ) : (
            <div className="border-[length:var(--bd)] border-[color:var(--bordure)] p-[var(--space-8)]">
              <span className="font-mono text-[.7rem] tracking-[.08em] uppercase opacity-70">
                EXPÉRIENCES PROFESSIONNELLES — &lt;CONTENU À FOURNIR PAR CHABEL&gt;
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Révélation propre à ce bloc : il est trop bas dans la section pour
          profiter de celle de Parcours, déclenchée sur le haut de la section
          et donc déjà terminée quand on arrive ici (retour client : « ni la
          section ni les cartes ne s'animent »). Le conteneur bascule, puis les
          cartes défilent en cascade (useRevealStagger). */}
      <div
        ref={competencesRef}
        id="competences"
        className="scroll-mt-[6rem] mt-[var(--space-24)] bg-[var(--bleu-atelier)] text-[var(--calque)] py-[var(--space-20)]"
      >
        <div className="container">
          <p className="font-mono text-[length:var(--fs-mono)] font-semibold tracking-[.08em] uppercase opacity-75 mb-[var(--space-10)]">
            COMPÉTENCES
          </p>
          <div className="grid gap-[var(--space-8)] md:grid-cols-2">
            {CATEGORIES_COMPETENCES.map(({ key, label }) => {
              const items = competences.filter((c) => c.categorie === key);
              if (items.length === 0) return null;
              return (
                <div key={key} className="flex flex-col gap-[var(--space-3)]">
                  <h3 className="font-[family-name:var(--font-display)] text-[1.25rem] font-bold uppercase">{label}</h3>
                  {items.map((c) => <CompetenceItem key={c.id} competence={c} />)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
