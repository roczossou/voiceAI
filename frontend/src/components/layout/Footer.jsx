import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-on-surface dark:bg-surface-container-lowest w-full py-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <Link to="/" className="font-headline-md text-headline-md text-surface">
          CHABEL ANANOUNON
        </Link>
        <div className="flex gap-6">
          <a href="#" className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-container transition-colors font-body-md text-body-md opacity-80 hover:opacity-100">Twitter</a>
          <a href="#" className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-container transition-colors font-body-md text-body-md opacity-80 hover:opacity-100">LinkedIn</a>
          <a href="#" className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-container transition-colors font-body-md text-body-md opacity-80 hover:opacity-100">GitHub</a>
          <a href="#" className="text-surface-variant dark:text-on-surface-variant hover:text-secondary-container transition-colors font-body-md text-body-md opacity-80 hover:opacity-100">Instagram</a>
        </div>
        <p className="text-secondary dark:text-secondary-fixed font-body-md text-body-md opacity-80">
          © {new Date().getFullYear()} CHABEL ANANOUNON. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
