// Primitive 5 (spec §C.7) — countUp : 1200ms easeOutQuart, stagger 90ms,
// threshold .4. Le stagger se pilote depuis l'appelant via `delay` (index*90ms)
// sur chaque item d'un groupe (ex. les 6 indicateurs de l'accueil, spec §D.1 R01).
//
// Si `end` est null/undefined (donnée de back-office absente — spec §F stats),
// le hook ne touche à rien : le "—" déjà présent dans le JSX reste affiché et
// aucune animation n'est jouée, conformément à la règle "ne rien inventer".
import { useEffect } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from './reducedMotion';

const defaultFormatter = (v) => Math.round(v).toLocaleString('fr-FR');

export function useCountUp(ref, {
  end,
  start = 0,
  duration = 1.2,
  ease = 'power3.out',
  delay = 0,
  threshold = 0.4,
  formatter = defaultFormatter,
} = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || end == null) return undefined;

    if (prefersReducedMotion()) {
      el.textContent = formatter(end);
      return undefined;
    }

    el.textContent = formatter(start);
    const proxy = { value: start };
    let tween;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        tween = gsap.to(proxy, {
          value: end,
          duration,
          ease,
          delay,
          onUpdate: () => {
            el.textContent = formatter(proxy.value);
          },
        });
        observer.disconnect();
      }
    }, { threshold });

    observer.observe(el);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [ref, end, start, duration, ease, delay, threshold, formatter]);
}
