import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConductorSection } from '../../components/layout/useConductor';
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

function GroupeLabel({ children }) {
  return (
    <h3 className="font-label-lg text-label-lg text-primary uppercase tracking-widest pb-3 border-b-2 border-primary/20 mb-6">
      {children}
    </h3>
  );
}

function TagBorne({ children }) {
  return (
    <span className="inline-block bg-surface border-2 border-primary/30 hover:border-primary hover:bg-primary-container text-on-background font-label-lg text-label-lg uppercase px-4 py-2 transition-colors cursor-default">
      {children}
    </span>
  );
}

function formatPeriode(debut, fin) {
  const debutAn = debut ? new Date(debut).getFullYear() : '';
  const finAn = fin ? new Date(fin).getFullYear() : 'EN COURS';
  return `${debutAn} — ${finAn}`;
}

function ExperienceEntry({ experience, index }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6 py-8 border-b border-primary/20 last:border-0">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 inline-block w-3 h-3 bg-secondary-container shrink-0"></span>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider leading-snug">
          {formatPeriode(experience.periode_debut, experience.periode_fin)}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <h4 className="font-headline-md text-headline-md text-on-background uppercase leading-tight">
          {experience.structure}
        </h4>
        <p className="font-label-lg text-label-lg text-primary uppercase">{experience.poste}</p>

        {experience.missions?.length > 0 && (
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">MISSIONS</p>
            <ul className="flex flex-col gap-1">
              {experience.missions.map((m) => (
                <li key={m} className="font-body-md text-body-md text-on-background flex gap-2">
                  <span className="text-secondary-container mt-1">›</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
        {experience.competences?.length > 0 && (
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">COMPÉTENCES DÉVELOPPÉES</p>
            <p className="font-body-md text-body-md text-on-background">{experience.competences.map((c) => c.libelle).join(' · ')}</p>
          </div>
        )}
        {experience.resultats && (
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">RÉSULTATS OBTENUS</p>
            <p className="font-body-md text-body-md text-on-background">{experience.resultats}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NiveauDots({ n }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`inline-block h-2 w-2 rounded-full ${i <= n ? 'bg-secondary-container' : 'bg-outline-variant'}`}
        />
      ))}
    </span>
  );
}

function CompetenceItem({ competence }) {
  const n = NIVEAU_N[competence.niveau] ?? 0;
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-0">
      <span className="font-body-md text-body-md text-on-primary">{competence.libelle}</span>
      <span className="flex items-center gap-3 shrink-0">
        <NiveauDots n={n} />
        {competence.niveau && (
          <span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider">
            {NIVEAU_LABEL[competence.niveau]}
          </span>
        )}
      </span>
    </div>
  );
}

export function Parcours() {
  const sectionRef = useConductorSection('parcours', 'Mon parcours');
  const { data: experiences = [] } = useQuery({ queryKey: ['experiences'], queryFn: fetchExperiences });
  const { data: competences = [] } = useQuery({ queryKey: ['competences'], queryFn: fetchCompetences });

  return (
    <section ref={sectionRef} id="parcours" className="py-32 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
      <div className="max-w-max-width mx-auto flex flex-col gap-16">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background uppercase">MON PARCOURS</h2>

        {/* Académique */}
        <div>
          <GroupeLabel>Académique</GroupeLabel>
          <div className="flex flex-wrap gap-3">
            {ACADEMIQUE.map((item) => <TagBorne key={item}>{item}</TagBorne>)}
          </div>
        </div>

        {/* Formations complémentaires */}
        <div>
          <GroupeLabel>Formations complémentaires</GroupeLabel>
          <div className="flex flex-wrap gap-3">
            {FORMATIONS_COMPLEMENTAIRES.map((item) => <TagBorne key={item}>{item}</TagBorne>)}
          </div>
        </div>

        {/* Expériences */}
        <div>
          <GroupeLabel>Expériences professionnelles</GroupeLabel>
          {experiences.length > 0 ? (
            <div>
              {experiences.map((exp, i) => <ExperienceEntry key={exp.id} experience={exp} index={i} />)}
            </div>
          ) : (
            <div className="bg-surface border-2 border-primary/20 p-8 text-center">
              <span className="material-symbols-outlined text-primary text-[40px] mb-3 block">work_history</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                EXPÉRIENCES — &lt;CONTENU À FOURNIR PAR CHABEL&gt;
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Compétences — fond bleu foncé */}
      <div id="competences" className="bg-on-surface text-on-primary mt-32 py-24 px-margin-mobile md:px-margin-desktop -mx-margin-mobile md:-mx-margin-desktop">
        <div className="max-w-max-width mx-auto">
          <h2 className="font-display-lg-mobile text-display-lg-mobile text-secondary-container uppercase mb-12">COMPÉTENCES</h2>
          <div className="grid gap-12 md:grid-cols-2">
            {CATEGORIES_COMPETENCES.map(({ key, label }) => {
              const items = competences.filter((c) => c.categorie === key);
              if (items.length === 0) return null;
              return (
                <div key={key} className="flex flex-col">
                  <h3 className="font-label-lg text-label-lg text-secondary-container uppercase tracking-widest mb-4 pb-3 border-b border-on-surface-variant/40">
                    {label}
                  </h3>
                  {items.map((c) => <CompetenceItem key={c.id} competence={c} />)}
                </div>
              );
            })}
            {competences.length === 0 && (
              <div className="md:col-span-2 border border-on-surface-variant/30 p-8 text-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  COMPÉTENCES — &lt;DONNÉES À COMPLÉTER DANS L'ADMIN&gt;
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
