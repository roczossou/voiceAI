// Scroll fluide — spec promptDesign.txt §C.2. Instance unique, initialisée une
// fois depuis main.jsx. En reduced-motion, on ne l'initialise pas du tout : le
// scroll natif prend le relais et ScrollTrigger n'est jamais enregistré (donc
// aucun pinning), conformément à §C.10.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { prefersReducedMotion } from './reducedMotion';

let lenis = null;
let initialized = false;

export function initLenis() {
  if (initialized) return lenis;
  initialized = true;

  if (prefersReducedMotion()) {
    return null;
  }

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({ smoothWheel: true, lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}

// lock()/unlock() — menu plein écran, modale, lightbox, recherche (spec §C.2)
export function lockScroll() {
  lenis?.stop();
  document.documentElement.classList.add('scroll-locked');
}

export function unlockScroll() {
  lenis?.start();
  document.documentElement.classList.remove('scroll-locked');
}
