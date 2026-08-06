// R05 — Témoignages. Spec §D.1 : "Aucun témoignage fictif : si la collection
// est vide, la section entière n'est pas rendue." Pas d'API back-office
// branchée pour l'instant (spec §F « temoignages ») → collection vide.
import { useConductorSection } from '../../components/layout/useConductor';

const TESTIMONIALS = [];

export function Testimonials() {
  const sectionRef = useConductorSection('temoignages', 'Témoignages');

  if (TESTIMONIALS.length === 0) return null;

  return (
    <section ref={sectionRef} id="temoignages" className="testimonials">
      {/* Collection non vide : implémenter le carrousel décrit en spec §D.1 R05. */}
    </section>
  );
}
