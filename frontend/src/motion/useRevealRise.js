// Primitive 2 (spec §C.7) — revealRise :
// {opacity:0,y:26} → {opacity:1,y:0}, ressort {tension:195,friction:26},
// une fois, IntersectionObserver threshold .2, delayIn optionnel.
import { useEffect } from 'react';
import gsap from 'gsap';
import { createSpringValue } from './spring';
import { prefersReducedMotion } from './reducedMotion';

export function useRevealRise(ref, {
  delayIn = 0,
  tension = 195,
  friction = 26,
  distance = 26,
  threshold = 0.2,
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return undefined;
    }

    gsap.set(el, { opacity: 0, y: distance });

    let triggered = false;
    let timeoutId;

    const ySpring = createSpringValue({
      value: distance,
      tension,
      friction,
      onUpdate: (v) => gsap.set(el, { y: v }),
    });
    const opacitySpring = createSpringValue({
      value: 0,
      tension,
      friction,
      onUpdate: (v) => gsap.set(el, { opacity: v }),
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        timeoutId = setTimeout(() => {
          ySpring.set(0);
          opacitySpring.set(1);
        }, delayIn);
        observer.disconnect();
      }
    }, { threshold });

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
      ySpring.stop();
      opacitySpring.stop();
    };
  }, [ref, delayIn, tension, friction, distance, threshold]);
}
