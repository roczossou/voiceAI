import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { fetchServices } from '../../api/client';
import { Link } from 'react-router-dom';

const GROUPES = [
  { key: 'services_digitaux', label: 'Services Digitaux', icon: 'devices' },
  { key: 'gestion_de_projet', label: 'Gestion de Projet', icon: 'account_tree' },
  { key: 'evenementiel', label: 'Événementiel', icon: 'event_star' },
  { key: 'formation', label: 'Formation', icon: 'school' },
  { key: 'conseil', label: 'Conseil', icon: 'lightbulb' },
];

const ACCENTS_SERVICES = [
  {
    border: 'border-purple-200 hover:border-purple-500',
    glow: 'glow-purple',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white',
    dot: 'bg-purple-500 dot-pulse-purple',
    numColor: 'text-purple-600',
    btnDevis: 'border-purple-200 text-purple-700 hover:bg-purple-50',
    btnRdv: 'bg-purple-600 hover:bg-purple-700 text-white',
    tagBg: 'bg-purple-500/10 text-purple-700 border-purple-200',
  },
  {
    border: 'border-emerald-200 hover:border-emerald-500',
    glow: 'glow-emerald',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white',
    dot: 'bg-emerald-500 dot-pulse-emerald',
    numColor: 'text-emerald-600',
    btnDevis: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
    btnRdv: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    tagBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  },
  {
    border: 'border-cyan-200 hover:border-cyan-500',
    glow: 'glow-cyan',
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-500/10 group-hover:bg-cyan-600 group-hover:text-white',
    dot: 'bg-cyan-500 dot-pulse-cyan',
    numColor: 'text-cyan-600',
    btnDevis: 'border-cyan-200 text-cyan-700 hover:bg-cyan-50',
    btnRdv: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    tagBg: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
  },
  {
    border: 'border-amber-200 hover:border-amber-500',
    glow: 'glow-amber',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/10 group-hover:bg-amber-600 group-hover:text-white',
    dot: 'bg-amber-500 dot-pulse-amber',
    numColor: 'text-amber-600',
    btnDevis: 'border-amber-200 text-amber-700 hover:bg-amber-50',
    btnRdv: 'bg-amber-600 hover:bg-amber-700 text-white',
    tagBg: 'bg-amber-500/10 text-amber-700 border-amber-200',
  },
];

function ServiceRow({ service, index, accent }) {
  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between gap-md py-md border-b border-outline-variant/60 last:border-0 hover:translate-x-1.5 transition-all duration-300">
      <div className="flex items-center gap-md">
        <span className={`font-headline-md text-headline-md ${accent.numColor} font-bold opacity-50 w-10 text-right shrink-0`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
          {service.titre}
        </span>
      </div>
      <div className="flex gap-sm ml-[56px] md:ml-0 shrink-0">
        <Link
          to={`/contact?objet=devis&service=${service.slug}`}
          className={`border ${accent.btnDevis} px-md py-sm rounded-xl font-label-bold text-[11px] tracking-wider transition-all shadow-xs flex items-center gap-xs`}
        >
          <span className="material-symbols-outlined text-[16px]">request_quote</span>
          Devis
        </Link>
        <Link
          to={`/contact?objet=rdv&service=${service.slug}`}
          className={`${accent.btnRdv} px-md py-sm rounded-xl font-label-bold text-[11px] tracking-wider transition-all shadow-sm flex items-center gap-xs`}
        >
          <span className="material-symbols-outlined text-[16px]">event</span>
          RDV
        </Link>
      </div>
    </div>
  );
}

function ServiceGroupe({ label, id, icon, services, index }) {
  if (services.length === 0) return null;
  const accent = ACCENTS_SERVICES[index % ACCENTS_SERVICES.length];

  return (
    <div id={id} className="scroll-mt-32">
      <div className={`group bg-surface border ${accent.border} ${accent.glow} rounded-xl p-lg md:p-xl card-sheen-beam shadow-sm`}>
        {/* Card header */}
        <div className="flex items-center justify-between mb-lg pb-md border-b border-outline-variant/60">
          <div className="flex items-center gap-md">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${accent.iconBg} ${accent.iconColor}`}>
              <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{label}</h2>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${accent.dot}`} />
        </div>

        <div className="flex flex-col">
          {services.map((service, i) => (
            <ServiceRow key={service.slug} service={service} index={i} accent={accent} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesHero() {
  return (
    <section className="bg-primary text-on-primary pt-[140px] pb-[100px] md:pt-[180px] md:pb-[140px] px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-spin-slow pointer-events-none z-0" />
      <div className="max-w-max-width mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        <div className="lg:col-span-8">
          <div className="hero-anim-badge">
            <span className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary text-xs font-bold px-4 py-1.5 rounded-full tracking-widest mb-6 border border-black/20 shadow-md">
              {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 dot-pulse-emerald" /> */}
              SOLUTIONS &amp; EXPERTISES
            </span>
          </div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-primary leading-none mb-6">
            Ce que je prends  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-secondary-container to-purple-300">en charge.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-primary-fixed-dim ">
            Des solutions sur-mesure pour donner vie à vos projets, de la conception stratégique à l'exécution terrain.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ServicesPage() {
  const { data: services = [], status } = useQuery({ queryKey: ['services'], queryFn: fetchServices });

  return (
    <SiteLayout>
      <ServicesHero />

      {/* Grille des services */}
      <section className="py-xl bg-gradient-to-b from-surface-container-low to-surface border-t border-outline-variant/50">
        <div className="max-w-7xl mx-auto px-margin">
          {/* Section header */}
          <div className="mb-lg border-l-4 border-primary pl-md">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mes prestations</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
              Un catalogue complet de services pour accompagner chaque étape de votre projet.
            </p>
          </div>

          {status === 'pending' && (
            <div className="py-xl text-center">
              <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
              <p className="font-body-lg text-primary mt-md">Chargement…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="py-xl text-center bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
              <span className="material-symbols-outlined text-error text-[40px] mb-sm block">error</span>
              <p className="font-body-lg text-error">Impossible de charger les prestations pour le moment.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col gap-md">
              {GROUPES.map(({ key, label, icon }, idx) => (
                <ServiceGroupe
                  key={key}
                  index={idx}
                  id={key.replace(/_/g, '-')}
                  label={label}
                  icon={icon}
                  services={services.filter((s) => s.groupe === key)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA bloc */}
      <section className="py-xl bg-gradient-to-b from-surface to-surface-container-low border-t border-outline-variant/50">
        <div className="max-w-4xl mx-auto px-margin text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-md">
            <span className="material-symbols-outlined text-[32px] text-primary">rocket_launch</span>
          </div>
          <h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl font-extrabold text-on-surface mb-md">
            Un projet en tête ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container">Parlons-en.</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg mx-auto">
            Quel que soit votre besoin, je vous accompagne de A à Z avec une approche sur-mesure et orientée résultats.
          </p>
          <div className="flex flex-wrap justify-center gap-md">
            <Link to="/contact" className="text-on-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:opacity-90 transition-all shadow-lg tracking-wider" style={{ background: 'linear-gradient(135deg, rgb(255, 69, 0) 0%, rgb(255, 183, 0) 100%)' }}>
              Demander un devis
            </Link>
            <Link to="/contact?objet=rdv" className="border-2 border-primary text-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:bg-primary/10 transition-colors tracking-wider">
              Réserver un RDV
            </Link>
          </div>
        </div>
      </section>

      <ProchaineEtape courante="/services" />
    </SiteLayout>
  );
}
