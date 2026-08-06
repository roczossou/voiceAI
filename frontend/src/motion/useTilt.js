// Primitive de profondeur — inclinaison 3D suivant le pointeur.
//
// Ajoutée le 2026-08-03 sur demande client (« je veux un site en 3D »), en
// extension des primitives §C.7 : la spec ne la prévoit pas, mais elle reste
// dans ses contraintes — pilotée par le ressort partagé de spring.js (une
// seule boucle gsap.ticker, jamais de requestAnimationFrame par composant),
// aucune librairie supplémentaire (§C.2 : GSAP + Lenis, rien d'autre).
//
// Inerte ≤768px (§C.6, comme useHoverSpring : sur mobile il n'y a pas de
// pointeur à suivre) et en reduced-motion (§C.10) — dans ces deux cas
// l'élément reste strictement plat.
import { useEffect } from 'react';
import gsap from 'gsap';
import { createSpringValue } from './spring';
import { BREAKPOINTS } from './breakpoints';
import { prefersReducedMotion } from './reducedMotion';

export function useTilt(ref, {
  max = 6,
  perspective = 900,
  lift = 0,
  tension = 200,
  friction = 26,
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const isInert = () => window.innerWidth <= BREAKPOINTS.md || prefersReducedMotion();

    gsap.set(el, { transformPerspective: perspective, transformStyle: 'preserve-3d' });

    const rotateX = createSpringValue({
      value: 0, tension, friction, onUpdate: (v) => gsap.set(el, { rotationX: v }),
    });
    const rotateY = createSpringValue({
      value: 0, tension, friction, onUpdate: (v) => gsap.set(el, { rotationY: v }),
    });
    const depth = createSpringValue({
      value: 0, tension, friction, onUpdate: (v) => gsap.set(el, { z: v }),
    });

    const handleMove = (event) => {
      if (isInert()) return;
      const rect = el.getBoundingClientRect();
      const ratioX = (event.clientX - rect.left) / rect.width - 0.5;
      const ratioY = (event.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(ratioX * max * 2);
      rotateX.set(-ratioY * max * 2);
      depth.set(lift);
    };

    const handleLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
      depth.set(0);
    };

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerleave', handleLeave);

    return () => {
      rotateX.stop();
      rotateY.stop();
      depth.stop();
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, [ref, max, perspective, lift, tension, friction]);
}
