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
        <p className="font-label-sm text-label-sm text-on-surface-variant tracking-widest mb-4">
          ÉTAPE SUIVANTE
        </p>
        <Link
          to={etape.href}
          className="group flex items-center justify-between gap-8 bg-primary text-on-primary p-8 md:p-12 rounded-3xl border border-purple-400/40 glow-purple card-sheen-beam hover:scale-[1.01] transition-all duration-300 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-secondary-container text-on-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[28px]">{etape.icon}</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-primary font-bold mb-1">
                {etape.titre}
              </h3>
              <p className="font-body-md text-body-md text-primary-fixed-dim ">
                {etape.accroche}
              </p>
            </div>
          </div>

          <span className="shrink-0 w-12 h-12 rounded-full border border-secondary-container bg-secondary-container text-on-secondary flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md relative z-10">
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform font-bold">arrow_forward</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
