// Révélation à l'échelle d'une SECTION entière (demande client 2026-08-03 :
// « des animations d'entrée au scroll de toutes les sections, bien visibles,
// assez lentes pour qu'on les ressente »), déclinée en plusieurs variantes
// pour ne pas rejouer le même mouvement à chaque section (même retour).
//
// Différences assumées avec revealRise (§C.7, primitive 2), qui reste réservée
// aux éléments individuels :
//   · amplitude bien plus large — le mouvement doit se lire de loin ;
//   · durée longue pilotée par une interpolation, pas par un ressort : un
//     ressort surdimensionné rebondit ou traîne selon la distance, alors qu'ici
//     la durée doit être perçue comme constante d'une section à l'autre.
//     Easing : voir la constante EASE plus bas — surtout PAS `expo.out` ;
//   · déclenchement calé sur le HAUT de la section (`threshold: 0`) avec une
//     marge basse négative : la section s'anime une fois entrée d'environ 12%
//     dans le viewport. Plus tôt, l'animation se jouerait hors champ ; plus
//     tard, elle serait déjà lue avant de bouger. C'est le « champ d'action »
//     demandé.
//
// Les variantes horizontales débordent forcément du document pendant leur
// course. C'est RevealSection qui règle le problème, en enveloppant l'élément
// animé dans un conteneur `overflow-x: clip` : le débordement est rogné
// localement, sans jamais provoquer de défilement horizontal (proscrit
// §C.10) et sans toucher au reste du site. `clip` — et surtout pas `hidden` —
// parce qu'il ne crée pas de conteneur de défilement : les `position: sticky`
// du site continuent de fonctionner.
//
// Comme toutes les primitives : jouée une seule fois, et neutralisée en
// reduced-motion, où la section est posée directement à son état final (§C.10).
import { useEffect } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from './reducedMotion';

// EASING — le point décisif, mesuré au navigateur le 2026-08-03. Avec
// `expo.out` (easeOutExpo, §C.7), ~90% de la distance est parcourue pendant le
// premier quart du temps : la section « arrive » en 400ms puis rampe. Allonger
// la durée ne changeait donc rien au ressenti (« pas assez lente » malgré 2s).
// `power2.inOut` (= easeInOutCubic, également au catalogue §C.7) répartit le
// mouvement au lieu de le concentrer : c'est lui qui rend l'entrée perceptible.
const EASE = 'power2.inOut';

// Durées longues et amplitudes larges : le client veut « ressentir » l'entrée.
// Resserrées d'environ 25% le 2026-08-03 (« augmenter un peu la vitesse, un
// peu, juste ») : 2,6–2,9s -> 1,95–2,2s. L'easing, lui, ne bouge pas — c'est
// power2.inOut qui rend le mouvement lisible, le raccourcir le rendrait sec.
const VARIANTS = {
  // Montée ample.
  rise: {
    from: { opacity: 0, y: 220 },
    rest: { opacity: 1, y: 0 },
    duration: 2,
  },
  // Arrivée par la gauche.
  slideLeft: {
    from: { opacity: 0, x: -280, y: 60 },
    rest: { opacity: 1, x: 0, y: 0 },
    duration: 2.1,
  },
  // Arrivée par la droite.
  slideRight: {
    from: { opacity: 0, x: 280, y: 60 },
    rest: { opacity: 1, x: 0, y: 0 },
    duration: 2.1,
  },
  // Bascule autour du bord bas — la section se redresse vers le lecteur.
  tilt3d: {
    from: {
      opacity: 0, y: 190, rotationX: 20, transformPerspective: 1300, transformOrigin: '50% 100%',
    },
    rest: { opacity: 1, y: 0, rotationX: 0 },
    duration: 2.1,
  },
  // Pivot autour du bord droit — la plus « 3D » des variantes : la section
  // s'ouvre comme une page qu'on tourne.
  swing: {
    from: {
      opacity: 0, x: -240, rotationY: -24, transformPerspective: 1300, transformOrigin: '100% 50%',
    },
    rest: { opacity: 1, x: 0, rotationY: 0 },
    duration: 2.2,
  },
  // Rapprochement — la section arrive « depuis le fond ».
  zoom: {
    from: { opacity: 0, scale: 0.82, y: 120 },
    rest: { opacity: 1, scale: 1, y: 0 },
    duration: 1.95,
  },
  // Rideau. Ne pas l'utiliser sur une section dont les enfants sortent de la
  // boîte (useTilt avec `lift`) : le clip les rognerait.
  wipe: {
    from: { opacity: 1, y: 60, clipPath: 'inset(0 0 100% 0)' },
    rest: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' },
    duration: 2.1,
  },
};

export function useRevealSection(ref, {
  variant = 'rise',
  duration,
  ease = EASE,
  delayIn = 0,
  threshold = 0,
  rootMargin = '0px 0px -12% 0px',
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const config = VARIANTS[variant] || VARIANTS.rise;

    if (prefersReducedMotion()) {
      gsap.set(el, config.rest);
      return undefined;
    }

    gsap.set(el, config.from);

    let tween;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      tween = gsap.to(el, {
        ...config.rest,
        duration: duration ?? config.duration,
        ease,
        delay: delayIn / 1000,
      });
      observer.disconnect();
    }, { threshold, rootMargin });

    observer.observe(el);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [ref, variant, duration, ease, delayIn, threshold, rootMargin]);
}
