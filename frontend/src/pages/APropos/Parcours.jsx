import React from 'react';
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
  { key: 'digitale', label: 'Compétences digitales', icon: 'devices' },
  { key: 'gestion', label: 'Compétences en gestion', icon: 'account_tree' },
  { key: 'technique', label: 'Compétences techniques', icon: 'build' },
  { key: 'soft', label: 'Soft skills', icon: 'psychology' },
];

const NIVEAU_N = { maitrise: 3, avance: 2, operationnel: 1 };
const NIVEAU_LABEL = { maitrise: 'Maîtrise', avance: 'Avancé', operationnel: 'Opérationnel' };

const CAT_ACCENTS = [
  { border: 'border-purple-200 hover:border-purple-500', glow: 'glow-purple', icon: 'text-purple-600', iconBg: 'bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white', title: 'group-hover:text-purple-600', dot: 'bg-purple-500', bar: 'bg-purple-500' },
  { border: 'border-emerald-200 hover:border-emerald-500', glow: 'glow-emerald', icon: 'text-emerald-600', iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white', title: 'group-hover:text-emerald-600', dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
  { border: 'border-cyan-200 hover:border-cyan-500', glow: 'glow-cyan', icon: 'text-cyan-600', iconBg: 'bg-cyan-500/10 group-hover:bg-cyan-600 group-hover:text-white', title: 'group-hover:text-cyan-600', dot: 'bg-cyan-500', bar: 'bg-cyan-500' },
  { border: 'border-amber-200 hover:border-amber-500', glow: 'glow-amber', icon: 'text-amber-600', iconBg: 'bg-amber-500/10 group-hover:bg-amber-600 group-hover:text-white', title: 'group-hover:text-amber-600', dot: 'bg-amber-500', bar: 'bg-amber-500' },
];

function TagBorne({ children, accent }) {
  const acc = CAT_ACCENTS[accent % CAT_ACCENTS.length];
  return (
    <span className={`inline-block bg-surface border ${acc.border} ${acc.icon} font-label-bold text-[11px] px-sm py-xs rounded-lg transition-colors cursor-default shadow-xs`}>
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
  const acc = CAT_ACCENTS[index % CAT_ACCENTS.length];
  return (
    <div className={`group bg-surface border ${acc.border} ${acc.glow} rounded-xl p-lg card-sheen-beam shadow-sm transition-all hover:-translate-y-0.5`}>
      <div className="flex flex-wrap items-start justify-between gap-sm mb-md">
        <div>
          <h4 className={`font-headline-md text-body-lg font-bold text-on-surface transition-colors ${acc.title}`}>
            {experience.structure}
          </h4>
          <p className={`font-label-bold text-[12px] tracking-wider mt-xs ${acc.icon}`}>{experience.poste}</p>
        </div>
        <span className={`font-label-bold text-[11px] ${acc.icon} bg-surface-container px-sm py-xs rounded-lg border border-outline-variant/60 shrink-0`}>
          {formatPeriode(experience.periode_debut, experience.periode_fin)}
        </span>
      </div>

      {experience.missions?.length > 0 && (
        <div className="mb-sm">
          <p className="font-label-bold text-[10px] text-on-surface-variant tracking-widest mb-xs">MISSIONS</p>
          <ul className="flex flex-col gap-xs">
            {experience.missions.map((m) => (
              <li key={m} className="font-body-sm text-body-sm text-on-surface flex gap-sm items-start">
                <span className={`${acc.icon} mt-0.5 shrink-0 font-bold`}>›</span>
                <span className="flex-1 min-w-0">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {experience.competences?.length > 0 && (
        <div className="flex flex-wrap gap-xs pt-sm border-t border-outline-variant/40">
          {experience.competences.map((c) => (
            <span key={c.libelle} className={`font-label-bold text-[10px] px-sm py-xs rounded-lg border ${acc.border} ${acc.icon} bg-surface-container`}>
              {c.libelle}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function NiveauDots({ n }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`inline-block h-2 w-5 rounded-full ${i <= n ? 'bg-secondary-container' : 'bg-outline-variant/40'}`}
        />
      ))}
    </span>
  );
}

function CompetenceItem({ competence }) {
  const n = NIVEAU_N[competence.niveau] ?? 0;
  return (
    <div className="flex items-center justify-between gap-md py-sm border-b border-outline-variant/40 last:border-0">
      <span className="font-body-sm text-body-sm text-on-surface">{competence.libelle}</span>
      <span className="flex items-center gap-sm shrink-0">
        <NiveauDots n={n} />
        {competence.niveau && (
          <span className="font-label-bold text-[10px] text-on-surface-variant tracking-wider hidden sm:block">
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
    <section ref={sectionRef} id="parcours" className="py-xl bg-gradient-to-b from-surface-container-low to-surface border-t border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-margin flex flex-col gap-lg">

        {/* Section header */}
        <div className="border-l-4 border-primary pl-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mon parcours</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Formation académique, expériences professionnelles et compétences acquises.
          </p>
        </div>

        {/* Académique */}
        <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
          <div className="flex items-center gap-sm mb-md border-b border-outline-variant/60 pb-sm">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Académique</h3>
          </div>
          <div className="flex flex-wrap gap-sm">
            {ACADEMIQUE.map((item, i) => <TagBorne key={item} accent={i}>{item}</TagBorne>)}
          </div>
        </div>

        {/* Formations complémentaires */}
        <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
          <div className="flex items-center gap-sm mb-md border-b border-outline-variant/60 pb-sm">
            <div className="w-10 h-10 bg-secondary-container/20 text-secondary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            </div>
            <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Formations complémentaires</h3>
          </div>
          <div className="flex flex-wrap gap-sm">
            {FORMATIONS_COMPLEMENTAIRES.map((item, i) => <TagBorne key={item} accent={i}>{item}</TagBorne>)}
          </div>
        </div>

        {/* Expériences */}
        <div>
          <div className="mb-md border-l-4 border-secondary-container pl-md">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Expériences professionnelles</h3>
          </div>
          {experiences.length > 0 ? (
            <div className="flex flex-col gap-md">
              {experiences.map((exp, i) => <ExperienceEntry key={exp.id} experience={exp} index={i} />)}
            </div>
          ) : (
            <div className="bg-surface border border-outline-variant rounded-xl p-lg text-center shadow-sm">
              <span className="material-symbols-outlined text-primary text-[40px] mb-sm block">work_history</span>
              <span className="font-label-bold text-[12px] text-on-surface-variant tracking-wider">
                EXPÉRIENCES — À COMPLÉTER DANS L'ADMIN
              </span>
            </div>
          )}
        </div>

        {/* Compétences */}
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-lg shadow-xl">
          <div className="mb-lg border-l-4 border-secondary-container pl-md">
            <h3 className="font-headline-md text-headline-md font-bold text-on-primary">Compétences</h3>
          </div>
          {competences.length > 0 ? (
            <div className="grid gap-lg md:grid-cols-2">
              {CATEGORIES_COMPETENCES.map(({ key, label, icon }, catIdx) => {
                const items = competences.filter((c) => c.categorie === key);
                if (items.length === 0) return null;
                const acc = CAT_ACCENTS[catIdx % CAT_ACCENTS.length];
                return (
                  <div key={key} className="bg-white/10 backdrop-blur-sm rounded-xl p-md border border-white/20">
                    <div className="flex items-center gap-sm mb-md pb-sm border-b border-white/20">
                      <div className="w-8 h-8 bg-secondary-container text-on-secondary rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">{icon}</span>
                      </div>
                      <h4 className="font-label-bold text-[12px] text-on-primary tracking-wider">{label}</h4>
                    </div>
                    {items.map((c) => <CompetenceItem key={c.id} competence={c} />)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/10 rounded-xl p-lg text-center border border-white/20">
              <span className="font-label-bold text-[12px] text-primary-fixed-dim tracking-wider">
                COMPÉTENCES — À COMPLÉTER DANS L'ADMIN
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
