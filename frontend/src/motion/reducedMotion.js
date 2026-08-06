// spec §C.10 : prefers-reduced-motion coupe toute parallaxe, tout pinning
// ScrollTrigger, remplace les révélations par leur état final. Chaque
// primitive de ce dossier vérifie ce flag avant d'animer quoi que ce soit.
export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function onReducedMotionChange(callback) {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (event) => callback(event.matches);
  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}
