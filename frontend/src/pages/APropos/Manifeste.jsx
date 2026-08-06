// R05 — Manifeste. Spec §D.2 : pleine largeur sur --graphite, texte à
// fournir (partie G, item 8) — jamais écrit à la place de Chabel.
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';

export function Manifeste() {
  const sectionRef = useConductorSection('manifeste', 'Manifeste');

  return (
    <section
      ref={sectionRef}
      id="manifeste"
      className="scroll-mt-[6rem] bg-[var(--graphite)] text-[var(--calque)] py-[var(--space-24)]"
    >
      <div className="container">
        <SectionCartouche label="MON MANIFESTE" />
        <div className="border-[length:var(--bd)] border-[color:rgba(228,234,238,.35)] max-w-[52rem] p-[var(--space-8)]">
          <span className="font-mono text-[.7rem] tracking-[.08em] uppercase opacity-70">
            MANIFESTE — &lt;CONTENU À FOURNIR PAR CHABEL&gt;
          </span>
        </div>
      </div>
    </section>
  );
}
