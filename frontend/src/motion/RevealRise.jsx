// Enveloppe déclarative de la primitive 2 (§C.7 — revealRise), pendant de
// RevealMask pour le texte courant.
//
// Pourquoi (2026-08-03) : RevealMask masque et fait coulisser son contenu de
// 112% de sa propre hauteur. Sur un titre court c'est l'effet voulu ; sur un
// paragraphe passé en une seule « ligne », c'est un pavé entier qui glisse —
// lourd, et perçu comme raté. Règle : RevealMask pour les titres et libellés
// courts, RevealRise pour les paragraphes et les blocs multi-lignes.
import { useRef } from 'react';
import { useRevealRise } from './useRevealRise';

export function RevealRise({
  as: Tag = 'div', delayIn = 0, distance, className, children, ...rest
}) {
  const ref = useRef(null);
  useRevealRise(ref, distance == null ? { delayIn } : { delayIn, distance });

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
