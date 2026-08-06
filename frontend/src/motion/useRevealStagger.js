// Révélation en cascade des ENFANTS d'un conteneur (cartes, bornes, cellules).
//
// Ajoutée le 2026-08-03 : le bloc « Compétences » ne bougeait pas. Il est
// imbriqué en fin de section Parcours, si bas que la révélation de la section
// (déclenchée sur son haut) était terminée depuis longtemps quand le lecteur y
// arrivait — le bloc et ses cartes semblaient donc figés. Une cascade propre
// au conteneur règle le cas, et sert pour toute grille de cartes.
//
// Même easing que useRevealSection (`power2.inOut`) : `expo.out` concentre le
// mouvement sur le premier quart du temps et se lit comme instantané.
import { useEffect } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from './reducedMotion';

// `itemCount` est OBLIGATOIRE dès que les éléments viennent de données
// asynchrones : au premier rendu la liste est vide, le hook ne trouve rien et
// sort. Sans cette dépendance il ne se rejoue jamais, et les cartes restent
// visibles sans animation — exactement le symptôme constaté sur le bloc
// Compétences, alimenté par /api/competences/ (2026-08-03).
export function useRevealStagger(ref, {
  selector = '[data-reveal-item]',
  itemCount = 0,
  distance = 60,
  duration = 1.15,
  stagger = 0.09,
  ease = 'power2.inOut',
  threshold = 0,
  rootMargin = '0px 0px -10% 0px',
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const items = el.querySelectorAll(selector);
    if (items.length === 0) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return undefined;
    }

    gsap.set(items, { opacity: 0, y: distance });

    let tween;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      tween = gsap.to(items, {
        opacity: 1, y: 0, duration, ease, stagger,
      });
      observer.disconnect();
    }, { threshold, rootMargin });

    observer.observe(el);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [ref, selector, itemCount, distance, duration, stagger, ease, threshold, rootMargin]);
}
