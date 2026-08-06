// R03 — Domaines. Spec §D.1 — 10 cellules exactes, chacune lien vers
// /expertise/[slug].
import { useRef } from 'react';
import { useRevealRise } from '../../motion';
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { SiteLink } from '../../components/ui/SiteLink';

const DOMAINS = [
  { n: '01', label: 'LEADERSHIP', slug: 'leadership' },
  { n: '02', label: 'GESTION DE PROJET', slug: 'gestion-de-projet' },
  { n: '03', label: 'ÉVÉNEMENTIEL', slug: 'evenementiel' },
  { n: '04', label: 'DIGITAL', slug: 'digital' },
  { n: '05', label: 'ENTREPRENEURIAT', slug: 'entrepreneuriat' },
  { n: '06', label: 'FORMATION', slug: 'formation' },
  { n: '07', label: 'INNOVATION', slug: 'innovation' },
  { n: '08', label: 'COMMUNICATION', slug: 'communication' },
  { n: '09', label: 'DÉVELOPPEMENT PERSONNEL', slug: 'developpement-personnel' },
  { n: '10', label: 'MAINTENANCE INDUSTRIELLE', slug: 'maintenance-industrielle' },
];

function DomainCell({ n, label, slug, index }) {
  const ref = useRef(null);
  useRevealRise(ref, { delayIn: index * 55 });

  return (
    <SiteLink ref={ref} href={`/expertise/${slug}`} className="domains-cell">
      <span className="domains-cell-n">{n}</span>
      <span className="domains-cell-label">{label}</span>
    </SiteLink>
  );
}

export function Domains() {
  const sectionRef = useConductorSection('domaines', 'Domaines');

  return (
    <section ref={sectionRef} id="domaines" className="domains">
      <div className="container">
        <SectionCartouche label="DIX DOMAINES, UNE MÊME EXIGENCE" />
        <div className="domains-grid">
          {DOMAINS.map((domain, i) => <DomainCell key={domain.slug} index={i} {...domain} />)}
        </div>
      </div>
    </section>
  );
}
