// Pied de page — spec §C.8.
import { NAV_COLUMNS } from './navigation';
import { SiteLink } from '../ui/SiteLink';
import { MailIcon, WhatsAppIcon, LinkedInIcon } from '../ui/SocialIcons';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-columns">
          {NAV_COLUMNS.map((column) => (
            <div key={column.title} className="site-footer-column">
              <p className="site-footer-column-title">{column.title}</p>
              <ul>
                {column.links.map(({ label, href }) => (
                  <li key={href}><SiteLink href={href}>{label}</SiteLink></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="site-footer-column">
            <p className="site-footer-column-title">COORDONNÉES</p>
            <ul>
              <li className="site-footer-contact-line"><MailIcon /> E-mail · </li>
              <li className="site-footer-contact-line"><WhatsAppIcon /> WhatsApp · </li>
              <li className="site-footer-contact-line"><LinkedInIcon /> LinkedIn · </li>
              <li>Covè, Zou, Bénin</li>
            </ul>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>CHABEL ANANOUNON · COVÈ · RÉPUBLIQUE DU BÉNIN</p>
          <p>2026</p>
          <p>JE TRANSFORME LE POTENTIEL EN PUISSANCE</p>
        </div>
      </div>

      <div className="site-footer-cote">
        <span className="site-footer-cote-line" aria-hidden="true" />
        <span className="site-footer-cote-label">FIN DU SCHÉMA</span>
        <span className="site-footer-cote-line" aria-hidden="true" />
      </div>
    </footer>
  );
}
