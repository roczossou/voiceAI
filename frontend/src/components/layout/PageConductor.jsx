// Conducteur de page — spec §C.8. SIMPLIFICATION ASSUMÉE : un tronc vertical
// unique avec un bornier par section, plutôt que les dérivations orthogonales
// de 4rem entrant dans chaque section décrites au pixel près par la spec.
// Comportement conservé : tracé cuivre au repos, tracé jaune sous tension
// scrubbé sur la hauteur du wrapper, borniers cliquables → lenis.scrollTo,
// recalcul au resize (debounce 120ms), ligne simple sans repères ≤768px,
// désactivé en reduced-motion (aucun ScrollTrigger créé).
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../../motion/lenis';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { BREAKPOINTS } from '../../motion/breakpoints';
import { useConductorSections } from './useConductor';

function remToPx(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function PageConductor({ wrapperRef }) {
  const sections = useConductorSections();
  const trunkRef = useRef(null);
  const [geometry, setGeometry] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    let debounce;

    const recompute = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const wrapperTop = wrapperRect.top + scrollY;
      const height = wrapper.offsetHeight;
      const width = window.innerWidth;
      const mobile = width <= BREAKPOINTS.md;
      const x = mobile ? remToPx(0.75) : width <= BREAKPOINTS.lg ? remToPx(1) : remToPx(3.5);

      const markers = mobile ? [] : sections
        .map(({ id, label, node }) => {
          if (!node) return null;
          const rect = node.getBoundingClientRect();
          return { id, label, y: rect.top + scrollY - wrapperTop };
        })
        .filter(Boolean);

      setGeometry({
        height, x, markers, mobile,
      });
    };

    recompute();

    const onResize = () => {
      clearTimeout(debounce);
      debounce = setTimeout(recompute, 120);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(debounce);
    };
  }, [wrapperRef, sections]);

  useEffect(() => {
    if (reduced || !trunkRef.current || !geometry || geometry.height === 0) return undefined;

    const el = trunkRef.current;
    const length = geometry.height;
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        gsap.set(el, { strokeDashoffset: length * (1 - self.progress) });
        setActiveCount(Math.floor(self.progress * geometry.markers.length));
      },
    });

    return () => trigger.kill();
  }, [reduced, geometry, wrapperRef]);

  if (!geometry || geometry.height === 0) return null;

  const goTo = (node) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(node, { duration: 1.1 });
    } else {
      node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <div className="conductor" style={{ height: geometry.height }}>
      <svg className="conductor-svg" width="100%" height={geometry.height} style={{ overflow: 'visible' }}>
        <line
          x1={geometry.x}
          y1={0}
          x2={geometry.x}
          y2={geometry.height}
          className="conductor-line conductor-line-rest"
        />
        {!reduced && (
          <line
            ref={trunkRef}
            x1={geometry.x}
            y1={0}
            x2={geometry.x}
            y2={geometry.height}
            className="conductor-line conductor-line-live"
          />
        )}
        {reduced && (
          <line
            x1={geometry.x}
            y1={0}
            x2={geometry.x}
            y2={geometry.height}
            className="conductor-line conductor-line-live"
          />
        )}
      </svg>

      {geometry.markers.map(({ id, label, y }, i) => (
        <button
          key={id}
          type="button"
          className={`conductor-marker${reduced || i < activeCount ? ' is-live' : ''}`}
          style={{ left: geometry.x, top: y }}
          aria-label={`Aller à la section ${label}`}
          onClick={() => {
            const section = sections.find((s) => s.id === id)?.node;
            if (section) goTo(section);
          }}
        >
          <span className="conductor-marker-dot" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
