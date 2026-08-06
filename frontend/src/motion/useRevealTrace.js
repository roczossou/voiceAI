// Primitive 3 (spec §C.7) — revealTrace :
// scaleX(0) → scaleX(1), transform-origin:left, 520ms easeInOutCubic.
// Bordures, dérivations, séparateurs. easeInOutCubic ≈ "power2.inOut" (GSAP
// core, aucune extension payante nécessaire).
import { useEffect } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from './reducedMotion';

export function useRevealTrace(ref, {
  duration = 0.52,
  ease = 'power2.inOut',
  threshold = 0.2,
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    gsap.set(el, { transformOrigin: 'left center' });

    if (prefersReducedMotion()) {
      gsap.set(el, { scaleX: 1 });
      return undefined;
    }

    gsap.set(el, { scaleX: 0 });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, { scaleX: 1, duration, ease });
        observer.disconnect();
      }
    }, { threshold });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, duration, ease, threshold]);
}
