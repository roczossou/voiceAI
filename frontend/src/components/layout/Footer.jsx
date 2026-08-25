import { Link } from 'react-router-dom';
import { NAV_COLUMNS } from './navigation';
import { WhatsAppIcon, LinkedInIcon } from '../ui/SocialIcons';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/50 py-xl mt-auto">
      <div className="max-w-7xl mx-auto px-margin">

        {/* Ligne du haut : marque + colonnes nav */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-xl">

          {/* Marque + tagline */}
          <div className="md:col-span-4 lg:col-span-4">
            <Link to="/" className="inline-block font-headline-lg text-headline-md font-extrabold text-on-surface mb-sm leading-tight hover:text-primary transition-colors">
              CHABEL<br />ANANOUNON
            </Link>
            <p className="font-body-md text-on-surface-variant  mt-sm">
              Entrepreneur · Leader jeunesse<br />
              Créatif digital · Bénin
            </p>
          </div>

          {/* Colonnes de navigation */}
          <div className="md:col-span-8 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-md">
            {NAV_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-label-bold text-[12px] text-primary tracking-wider mb-sm">{col.title}</p>
                <ul className="space-y-sm">
                  {col.links.map(({ label, href }) => (
                    <li key={href}>
                      <Link to={href} className="font-body-md text-on-surface-variant hover:text-secondary-container transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="w-full h-px bg-gradient-to-r from-outline-variant/50 via-outline-variant to-outline-variant/50 mb-lg" aria-hidden="true" />

        {/* Bas de page */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-md">
          <p className="font-body-sm text-on-surface-variant opacity-80 order-3 md:order-1">
            © {YEAR} Chabel Ananounon — Tous droits réservés.
          </p>

          <div className="flex items-center gap-md order-2">
            <a
              href="https://wa.me/22900000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-xs font-label-bold text-on-surface-variant hover:text-primary transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
              
            </a>
            <a
              href="https://www.linkedin.com/in/chabelananounon"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-xs font-label-bold text-on-surface-variant hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-5 h-5" />
              
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
