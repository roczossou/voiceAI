// R07 — Appel à l'action. Spec §D.1 — texte et bornes exacts.
import { useConductorSection } from '../../components/layout/useConductor';
import { SiteLink } from '../../components/ui/SiteLink';

const CTA_LINKS = [
  { label: 'COLLABORER', objet: 'collaboration' },
  { label: 'DEMANDER UN DEVIS', objet: 'devis' },
  { label: 'RÉSERVER UNE FORMATION', objet: 'formation' },
  { label: 'PROPOSER UN PARTENARIAT', objet: 'partenariat' },
];

export function CTA() {
  const sectionRef = useConductorSection('cta', 'Travaillons ensemble');

  return (
    <section ref={sectionRef} id="cta" className="home-cta">
      <div className="container">
        <h2 className="home-cta-title">
          TRAVAILLONS <span className="home-cta-title-signal">ENSEMBLE</span>
        </h2>
        <div className="home-cta-links">
          {CTA_LINKS.map(({ label, objet }) => (
            <SiteLink key={objet} href={`/contact?objet=${objet}`} className="home-cta-link">
              <span>{label}</span>
              <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  );
}
