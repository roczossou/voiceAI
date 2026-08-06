import { useContext, useEffect, useRef } from 'react';
import { ConductorContext } from './conductorContext';

// Enregistrement d'une section auprès du conducteur.
//
// L'effet dépend des DEUX callbacks (stables, `useCallback([])` dans
// ConductorProvider) et jamais de l'objet de contexte entier : cet objet est
// mémoïsé sur `sections`, donc il change d'identité à chaque enregistrement.
// Le prendre en dépendance créait une boucle — enregistrement → nouvel objet
// de contexte → nettoyage (désenregistrement) → réenregistrement → … — qui
// faisait planter /services en « Maximum update depth exceeded » (bug trouvé
// au navigateur le 2026-08-03 ; ni ESLint ni le build ne le voient).
export function useConductorSection(id, label) {
  const ctx = useContext(ConductorContext);
  const ref = useRef(null);
  const registerSection = ctx?.registerSection;
  const unregisterSection = ctx?.unregisterSection;

  useEffect(() => {
    if (!registerSection || !unregisterSection || !ref.current) return undefined;
    registerSection(id, label, ref.current);
    return () => unregisterSection(id);
  }, [registerSection, unregisterSection, id, label]);

  return ref;
}

export function useConductorSections() {
  const ctx = useContext(ConductorContext);
  return ctx?.sections ?? [];
}
