// Menu plein écran — spec §C.8. Ouverture par trois volets horizontaux
// descendants (stagger 80ms, 520ms easeInOutCubic), fermeture inverse, focus
// piégé, Escape, focus rendu au déclencheur.
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { lockScroll, unlockScroll } from '../../motion/lenis';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { NAV_COLUMNS, isNavActive } from './navigation';
import { SiteLink } from '../ui/SiteLink';
import { WhatsAppIcon, LinkedInIcon } from '../ui/SocialIcons';

export function FullscreenMenu({
  open, onClose, currentPath = '/', triggerRef,
}) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const voletsRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;

    lockScroll();

    if (prefersReducedMotion()) {
      gsap.set(voletsRef.current, { yPercent: 0 });
    } else {
      gsap.set(voletsRef.current, { yPercent: -100 });
      gsap.to(voletsRef.current, {
        yPercent: 0, duration: 0.52, ease: 'power2.inOut', stagger: 0.08,
      });
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
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
    <div className="fullscreen-menu" role="dialog" aria-modal="true" aria-label="Menu principal">
      <div className="fullscreen-menu-volets" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => { voletsRef.current[i] = el; }}
            className="fullscreen-menu-volet"
          />
        ))}
      </div>

      <div ref={panelRef} className="fullscreen-menu-panel">
        <button
          ref={closeButtonRef}
          type="button"
          className="fullscreen-menu-close"
          aria-label="Fermer le menu"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="fullscreen-menu-columns container">
          {NAV_COLUMNS.map((column) => (
            <div key={column.title} className="fullscreen-menu-column">
              <p className="fullscreen-menu-column-title">{column.title}</p>
              <ul>
                {column.links.map(({ label, href }) => (
                  <li key={href}>
                    <SiteLink
                      href={href}
                      aria-current={isNavActive(currentPath, href) ? 'page' : undefined}
                      className="fullscreen-menu-link"
                      // Fermeture explicite : quand le lien mène à la page
                      // déjà affichée (ancre /a-propos#parcours depuis
                      // /a-propos), SiteLayout ne se remonte pas, donc l'état
                      // `open` ne se réinitialise pas tout seul et le menu
                      // resterait affiché par-dessus le contenu.
                      onClick={onClose}
                    >
                      {label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="fullscreen-menu-footer container">
          <p>COVÈ · ZOU · BÉNIN</p>
          <p className="fullscreen-menu-socials">
            <span><WhatsAppIcon /> WHATSAPP · </span>
            <span><LinkedInIcon /> LINKEDIN · </span>
          </p>
        </div>
      </div>
    </div>
  );
}
