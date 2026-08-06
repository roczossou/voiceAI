// Primitive 6 (spec §C.7) — parallax : réservée aux calques .watermark-grid
// (--grille). Position du déclencheur mappée sur from→to à chaque frame de
// scroll, via ScrollTrigger (déjà enregistré par initLenis() au démarrage —
// voir motion/lenis.js). En reduced-motion, aucun ScrollTrigger n'est créé.
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './reducedMotion';

export function useParallax(ref, { from = 0, to = 6, scrub = 0.6 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const tween = gsap.fromTo(
      el,
      { yPercent: from },
      {
        yPercent: to,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, from, to, scrub]);
}

export { ScrollTrigger };
