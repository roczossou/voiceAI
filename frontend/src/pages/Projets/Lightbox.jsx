// Lightbox — spec §D.5. Fixed plein écran, navigation clavier/boutons,
// focus piégé, partage natif ou lien copié.
import { useEffect, useRef, useState } from 'react';
import { lockScroll, unlockScroll } from '../../motion/lenis';

export function Lightbox({ items, index, onClose, onNavigate, returnFocusRef }) {
  const panelRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const item = items[index];

  // Toujours à jour, lu par le handler clavier — évite de reconstruire
  // l'effet (verrouillage du scroll, focus initial) à chaque navigation.
  const latestRef = useRef({ index, items, onNavigate, onClose });
  useEffect(() => {
    latestRef.current = { index, items, onNavigate, onClose };
  });

  useEffect(() => {
    lockScroll();
    panelRef.current?.focus();
    const elementToRefocus = returnFocusRef?.current;

    const handleKeyDown = (event) => {
      const { index: i, items: currentItems, onNavigate: navigate, onClose: close } = latestRef.current;
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowRight') navigate((i + 1) % currentItems.length);
      else if (event.key === 'ArrowLeft') navigate((i - 1 + currentItems.length) % currentItems.length);
      else if (event.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll('button, a[href]');
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
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
      elementToRefocus?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!item) return null;

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${item.id}`;
    if (navigator.share) {
      navigator.share({ url, title: item.legende }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Visionneuse">
      <div ref={panelRef} className="lightbox-panel" tabIndex={-1}>
        <button type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Fermer">
          <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <button
          type="button"
          className="lightbox-btn lightbox-prev"
          onClick={() => onNavigate((index - 1 + items.length) % items.length)}
          aria-label="Visuel précédent"
        >
          <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <div className="lightbox-media">
          {item.type === 'video' ? (
            <video src={item.src} poster={item.poster} controls />
          ) : (
            <img src={item.src} alt={item.legende || ''} />
          )}
        </div>

        <button
          type="button"
          className="lightbox-btn lightbox-next"
          onClick={() => onNavigate((index + 1) % items.length)}
          aria-label="Visuel suivant"
        >
          <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <div className="lightbox-footer">
          {item.legende && <p className="lightbox-caption">{item.legende}</p>}
          <p className="lightbox-counter" aria-live="polite">{`[${index + 1} / ${items.length}]`}</p>
          <button type="button" className="lightbox-share" onClick={handleShare}>
            {copied ? 'LIEN COPIÉ' : 'PARTAGER'}
          </button>
        </div>
      </div>
    </div>
  );
}
