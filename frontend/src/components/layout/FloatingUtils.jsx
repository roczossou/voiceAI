// WhatsApp + retour en haut — spec §C.8.
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getLenis } from '../../motion/lenis';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { WhatsAppIcon } from '../ui/SocialIcons';

export function FloatingUtils() {
  const whatsappRef = useRef(null);
  const backToTopRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const el = whatsappRef.current;
    if (!el) return undefined;

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return undefined;
    }

    gsap.set(el, { opacity: 0, y: 16 });
    const timer = setTimeout(() => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = backToTopRef.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { opacity: showBackToTop ? 1 : 0, y: 0 });
      el.style.pointerEvents = showBackToTop ? 'auto' : 'none';
      return;
    }

    gsap.to(el, {
      opacity: showBackToTop ? 1 : 0,
      y: showBackToTop ? 0 : 8,
      duration: 0.2,
      ease: 'power2.out',
      onStart: () => {
        if (showBackToTop) el.style.pointerEvents = 'auto';
      },
      onComplete: () => {
        if (!showBackToTop) el.style.pointerEvents = 'none';
      },
    });
  }, [showBackToTop, reduced]);

  const handleBackToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <>
      <a
        ref={whatsappRef}
        className="floating-whatsapp"
        href="https://wa.me/00000000000"
        target="_blank"
        rel="noopener"
        aria-label="Écrire sur WhatsApp"
      >
        <WhatsAppIcon width="1.5rem" height="1.5rem" />
      </a>

      <button
        ref={backToTopRef}
        type="button"
        className="floating-back-to-top"
        aria-label="Retour en haut"
        onClick={handleBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
      >
        <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </>
  );
}
