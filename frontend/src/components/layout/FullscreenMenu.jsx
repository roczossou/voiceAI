// Menu plein écran — redesign adapté au thème "Vibrant Signal"
// Fond semi-transparent, typographie cohérente avec le site, animations GSAP.
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { lockScroll, unlockScroll } from '../../motion/lenis';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { NAV_COLUMNS, isNavActive } from './navigation';
import { WhatsAppIcon, LinkedInIcon } from '../ui/SocialIcons';

const PRIMARY_LINKS = [
  { label: 'À propos', href: '/a-propos' },
  { label: 'Services', href: '/services' },
  { label: 'Projets', href: '/projets' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function FullscreenMenu({ open, onClose, currentPath = '/', triggerRef }) {
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);
  const innerRef = useRef(null);
  const primaryLinksRef = useRef([]);
  const secondaryRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    lockScroll();

    const reduced = prefersReducedMotion();

    if (!reduced) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(innerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.1 }
      );

      gsap.fromTo(primaryLinksRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', stagger: 0.05, delay: 0.2 }
      );

      if (secondaryRef.current) {
        gsap.fromTo(secondaryRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.35 }
        );
      }

      if (footerRef.current) {
        gsap.fromTo(footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.45 }
        );
      }
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key === 'Tab' && overlayRef.current) {
        const focusables = overlayRef.current.querySelectorAll('a[href], button:not([disabled])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const trigger = triggerRef?.current;

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-80 bg-surface/95 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      style={{ zIndex: 80 }}
    >
      {/* Bouton fermeture */}
      <button
        ref={closeButtonRef}
        type="button"
        className="fixed top-6 right-6 z-10 flex items-center gap-2 border border-outline-variant px-4 py-2 rounded-full text-on-surface-variant hover:text-primary hover:border-primary transition-colors font-label-bold"
        aria-label="Fermer le menu"
        onClick={onClose}
      >
        <span className="hidden sm:inline">FERMER</span>
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>

      {/* Contenu */}
      <div ref={innerRef} className="relative min-h-[100svh] flex flex-col justify-between py-16 px-6 max-w-7xl mx-auto">

        {/* Liens primaires */}
        <nav className="mt-8 md:mt-16" aria-label="Navigation principale">
          <ul className="flex flex-col border-t border-outline-variant/30">
            {PRIMARY_LINKS.map(({ label, href }, i) => {
              const active = isNavActive(currentPath, href);
              return (
                <li
                  key={href}
                  ref={(el) => { primaryLinksRef.current[i] = el; }}
                  className="border-b border-outline-variant/30 group"
                >
                  <Link
                    to={href}
                    className={`flex items-center gap-4 py-4 md:py-6 text-on-surface hover:text-primary transition-colors ${active ? 'text-primary' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={onClose}
                  >
                    <span className="font-label-bold text-on-surface-variant opacity-60 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                    <span className="font-headline-lg text-[2rem] md:text-[3rem] font-bold tracking-tight">{label}</span>
                    <span className="material-symbols-outlined text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-auto md:ml-4 text-[2rem]" aria-hidden="true">
                      arrow_forward
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Séparateur */}
        <div className="h-px bg-gradient-to-r from-primary to-transparent my-10 opacity-50" aria-hidden="true" />

        {/* Colonnes secondaires */}
        <div ref={secondaryRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {NAV_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-label-bold text-primary tracking-wider mb-4 text-[12px]">{col.title}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className={`font-body-md text-on-surface-variant hover:text-on-surface transition-colors ${isNavActive(currentPath, href) ? 'text-primary font-bold' : ''}`}
                      aria-current={isNavActive(currentPath, href) ? 'page' : undefined}
                      onClick={onClose}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer ref={footerRef} className="mt-16 flex flex-wrap justify-between items-center gap-4 border-t border-outline-variant/30 pt-6">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-bold">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
            Covè · Zou · Bénin
          </div>
          <div className="flex gap-6">
            <a href="https://wa.me/22900000000" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-bold">
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
            <a href="https://linkedin.com/in/chabelananounon" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-bold">
              <LinkedInIcon className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
