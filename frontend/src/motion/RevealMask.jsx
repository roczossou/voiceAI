// Primitive 1 (spec §C.7) — revealMask : mot ou ligne dans une boîte
// overflow:hidden ; span interne translateY(112%) opacity:0 → 0,1.
// 880ms easeOutExpo, stagger 80ms. Rejouable au changement de contenu.
//
// unit="word" (défaut) découpe une chaîne par espaces.
// unit="lines" attend un tableau de lignes déjà préparé par l'appelant (une
// vraie césure visuelle nécessiterait de mesurer les rects au runtime, hors
// scope du système de design — les pages qui en ont besoin passeront leurs
// propres lignes).
import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from './reducedMotion';

export function RevealMask({
  as: Tag = 'span',
  children,
  unit = 'word',
  stagger = 0.08,
  duration = 0.88,
  ease = 'expo.out',
  trigger = 'view',
  threshold = 0.2,
  replayKey,
  className,
  ...rest
}) {
  const containerRef = useRef(null);

  const tokens = useMemo(() => {
    if (unit === 'lines') return Array.isArray(children) ? children : [children];
    return typeof children === 'string' ? children.split(' ') : [children];
  }, [children, unit]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const spans = container.querySelectorAll('[data-reveal-inner]');

    if (prefersReducedMotion()) {
      gsap.set(spans, { y: '0%', opacity: 1 });
      return undefined;
    }

    // État caché posé TOUT DE SUITE, avant d'observer. Sans cela le texte
    // s'affichait à sa place normale, puis sautait brutalement en position
    // basse au moment où l'observateur se déclenchait, avant de remonter :
    // un clignotement très visible sur tout ce qui est déjà à l'écran au
    // chargement (bug signalé le 2026-08-03, « les animations d'entrée
    // c'est vraiment pas ça »).
    gsap.set(spans, { y: '112%', opacity: 0 });

    const play = () => {
      gsap.to(spans, {
        y: '0%', opacity: 1, duration, ease, stagger,
      });
    };

    if (trigger === 'immediate') {
      play();
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        play();
        observer.disconnect();
      }
    }, { threshold });

    observer.observe(container);
    return () => observer.disconnect();
  }, [tokens, stagger, duration, ease, trigger, threshold, replayKey]);

  return (
    <Tag ref={containerRef} className={className} {...rest}>
      {tokens.map((token, i) => (
        <span
          key={i}
          className="reveal-mask-line"
          style={{
            display: unit === 'lines' ? 'block' : 'inline-block',
            overflow: 'hidden',
            // Le masque rogne ce qui dépasse de la boîte de ligne. Sur des
            // capitales accentuées (À PROPOS, ÉVÉNEMENTIEL) composées en Big
            // Shoulders avec un line-height serré (.82 dans les titres), les
            // accents sortent par le haut et disparaissaient purement et
            // simplement. On ouvre le masque vers le haut et on annule le
            // décalage par une marge négative égale : la position finale du
            // texte est inchangée, seuls les accents sont sauvés.
            paddingTop: '0.22em',
            marginTop: '-0.22em',
            paddingBottom: '0.14em',
            verticalAlign: 'top',
          }}
        >
          <span data-reveal-inner style={{ display: 'inline-block' }}>
            {token}
            {unit === 'word' && i < tokens.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}
