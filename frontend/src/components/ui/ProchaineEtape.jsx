import { Link } from 'react-router-dom';

const ETAPES = {
  '/': {
    href: '/a-propos',
    titre: 'À PROPOS',
    accroche: 'Le parcours, la vision et les valeurs derrière les projets.',
    icon: 'person',
  },
  '/a-propos': {
    href: '/projets',
    titre: 'LES RÉALISATIONS',
    accroche: 'Les projets professionnels, entrepreneuriaux et institutionnels.',
    icon: 'folder_open',
  },
  '/projets': {
    href: '/services',
    titre: 'LES SERVICES',
    accroche: 'Design, gestion de projet, événementiel, formation, conseil.',
    icon: 'handyman',
  },
  '/services': {
    href: '/contact',
    titre: 'PARLONS-EN',
    accroche: 'Un message ou un rendez-vous, au choix.',
    icon: 'mail',
  },
  '/blog': {
    href: '/a-propos',
    titre: 'À PROPOS',
    accroche: 'Le parcours, la vision et les valeurs derrière les projets.',
    icon: 'person',
  },
  '/contact': {
    href: '/projets',
    titre: 'LES RÉALISATIONS',
    accroche: 'Les projets professionnels, entrepreneuriaux et institutionnels.',
    icon: 'folder_open',
  },
};

export function ProchaineEtape({ courante }) {
  const etape = ETAPES[courante];
  if (!etape) return null;

  return (
    <section className="px-margin-mobile md:px-margin-desktop py-16 bg-surface-container-low">
      <div className="max-w-max-width mx-auto">
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-4">
          ÉTAPE SUIVANTE
        </p>
        <Link
          to={etape.href}
          className="group flex items-center justify-between gap-8 bg-primary text-on-primary p-8 md:p-12 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-secondary-container text-on-background rounded flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">{etape.icon}</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-primary uppercase mb-1">
                {etape.titre}
              </h3>
              <p className="font-body-md text-body-md text-primary-fixed-dim max-w-md">
                {etape.accroche}
              </p>
            </div>
          </div>

          <span className="shrink-0 w-12 h-12 border-2 border-on-primary/30 flex items-center justify-center group-hover:bg-secondary-container group-hover:border-secondary-container group-hover:text-on-background transition-all duration-300">
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
