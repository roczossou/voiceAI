// Primitive 4 (spec §C.7) — hoverSpring :
// enter → to, leave → from. Inerte ≤768px (spec §C.6 rupture md) et en
// reduced-motion.
import { useEffect } from 'react';
import gsap from 'gsap';
import { createSpringValue } from './spring';
import { BREAKPOINTS } from './breakpoints';
import { prefersReducedMotion } from './reducedMotion';

export function useHoverSpring(ref, {
  property = 'scale',
  from = 1,
  to = 1.03,
  tension = 240,
  friction = 26,
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    gsap.set(el, { [property]: from });

    const isInert = () => window.innerWidth <= BREAKPOINTS.md || prefersReducedMotion();

    const spring = createSpringValue({
      value: from,
      tension,
      friction,
      onUpdate: (v) => gsap.set(el, { [property]: v }),
    });

    const handleEnter = () => {
      if (!isInert()) spring.set(to);
    };
    const handleLeave = () => {
      if (!isInert()) spring.set(from);
    };

    el.addEventListener('pointerenter', handleEnter);
    el.addEventListener('pointerleave', handleLeave);

    return () => {
      spring.stop();
      el.removeEventListener('pointerenter', handleEnter);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, [ref, property, from, to, tension, friction]);
}
