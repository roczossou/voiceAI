import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { ProchaineEtape } from '../../components/ui/ProchaineEtape';
import { fetchServices } from '../../api/client';
import { Link } from 'react-router-dom';

const GROUPES = [
  { key: 'services_digitaux', label: 'SERVICES DIGITAUX', icon: 'devices' },
  { key: 'gestion_de_projet', label: 'GESTION DE PROJET', icon: 'account_tree' },
  { key: 'evenementiel', label: 'ÉVÉNEMENTIEL', icon: 'event_star' },
  { key: 'formation', label: 'FORMATION', icon: 'school' },
  { key: 'conseil', label: 'CONSEIL', icon: 'lightbulb' },
];

function ServiceRow({ service, index }) {
  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-primary/20 last:border-0 hover:-translate-y-1 transition-all">
      <div className="flex items-center gap-6">
        <span className="font-headline-md text-headline-md text-primary opacity-50 w-12 text-right">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-headline-md text-headline-md text-on-background uppercase group-hover:text-primary transition-colors">
          {service.titre}
        </span>
      </div>
      <div className="flex gap-4 ml-[72px] md:ml-0">
        <Link
          to={`/contact?objet=devis&service=${service.slug}`}
          className="border-2 border-primary text-primary px-4 py-2 font-label-sm uppercase tracking-wider hover:bg-primary-container transition-colors"
        >
          DEVIS
        </Link>
        <Link
          to={`/contact?objet=rdv&service=${service.slug}`}
          className="bg-primary text-on-primary px-4 py-2 font-label-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          RENDEZ-VOUS
        </Link>
      </div>
    </div>
  );
}

function ServiceGroupe({ label, id, icon, services }) {
  if (services.length === 0) return null;

  return (
    <div id={id} className="scroll-mt-32 py-12">
      <div className="bg-surface border-2 border-primary p-8 md:p-12 shadow-lg">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-secondary-container inline-flex">
          <span className="material-symbols-outlined text-secondary-container text-[32px]">{icon}</span>
          <h2 className="font-headline-md text-headline-md text-primary uppercase">{label}</h2>
        </div>
        <div className="flex flex-col">
          {services.map((service, i) => (
            <ServiceRow key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesHero() {
  return (
    <section className="bg-primary text-on-primary py-[100px] md:py-[140px] px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      <div className="max-w-max-width mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        <div className="lg:col-span-8">
          <p className="font-label-sm text-label-sm text-secondary-container uppercase tracking-widest mb-6 border border-secondary-container inline-block px-3 py-1">SERVICES</p>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-primary uppercase leading-none mb-6">
            CE QUE JE PRENDS <span className="text-secondary-container">EN CHARGE.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
            Des solutions sur-mesure pour donner vie à vos projets, de la conception à la réalisation.
          </p>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary-container rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
    </section>
  );
}

export function ServicesPage() {
  const { data: services = [], status } = useQuery({ queryKey: ['services'], queryFn: fetchServices });

  return (
    <SiteLayout>
      <ServicesHero />

      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-max-width mx-auto flex flex-col gap-8">
          {status === 'pending' && (
            <div className="py-24 text-center">
              <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
              <p className="font-body-lg text-primary mt-4">Chargement…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="py-24 text-center bg-error-container p-8">
              <p className="font-body-lg text-error">Impossible de charger les prestations pour le moment.</p>
            </div>
          )}

          {status === 'success' && GROUPES.map(({ key, label, icon }) => (
            <ServiceGroupe
              key={key}
              id={key.replace(/_/g, '-')}
              label={label}
              icon={icon}
              services={services.filter((s) => s.groupe === key)}
            />
          ))}
        </div>
      </section>

      <ProchaineEtape courante="/services" />
    </SiteLayout>
  );
}
