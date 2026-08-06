// Enveloppe déclarative de useRevealSection : permet d'envelopper une section
// entière sans toucher au composant lui-même — utile pour les sections
// partagées entre pages (le CTA de l'accueil, par exemple), qui ne doivent pas
// hériter de l'animation ailleurs.
//
// Le conteneur extérieur porte `overflow-x: clip` : les variantes horizontales
// (slideLeft/slideRight/swing) sortent du cadre pendant leur course, et sans
// ce rognage elles allongeraient le document vers la droite, donc une barre de
// défilement horizontale — proscrite (§C.10). `clip` et non `hidden` : il ne
// crée pas de conteneur de défilement, donc les `position: sticky` continuent
// de se caler sur la fenêtre.
import { useRef } from 'react';
import { useRevealSection } from './useRevealSection';

export function RevealSection({
  as: Tag = 'div', variant = 'rise', delayIn = 0, duration, className, children, ...rest
}) {
  const ref = useRef(null);
  useRevealSection(ref, {
    variant,
    delayIn,
    ...(duration == null ? {} : { duration }),
  });

  return (
    <div style={{ overflowX: 'clip' }}>
      <Tag ref={ref} className={className} {...rest}>
        {children}
      </Tag>
    </div>
  );
}
