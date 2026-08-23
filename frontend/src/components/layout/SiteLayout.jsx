// Assemblage du chrome partagé — header, menu, conducteur, footer,
// utilitaires flottants (présents dès la V1 sur toutes les pages, spec §B).
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { FullscreenMenu } from './FullscreenMenu';
import { Footer } from './Footer';
import { Newsletter } from './Newsletter';
import { FloatingUtils } from './FloatingUtils';
import { PageConductor } from './PageConductor';
import { ConductorProvider } from './ConductorContext';
import { getLenis } from '../../motion/lenis';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import './layout.css';

export function SiteLayout({ children }) {
  const { pathname: currentPath, hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef(null);
  const mainRef = useRef(null);

  // Défilement au changement de route. react-router ne réinitialise PAS le
  // scroll, et Lenis garde en plus sa propre position interne : en quittant
  // une page longue (l'accueil) défilée vers le bas, la page suivante, plus
  // courte, s'ouvrait au-delà de son propre contenu — écran vide, "le lien
  // change mais rien ne se passe", corrigé seulement par un rechargement
  // (bug remonté le 2026-08-03). D'où : remise à zéro immédiate (jamais
  // animée : on change de page, on ne parcourt pas la précédente), puis
  // resize() pour que Lenis reprenne la hauteur du nouveau document.
  //   Cas de l'ancre (/a-propos#parcours) : on défile vers la section au
  // lieu du haut, après un court délai — les sections s'enregistrent auprès
  // du conducteur après le premier rendu.
  useEffect(() => {
    const lenis = getLenis();

    if (!hash) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        lenis.resize();
      } else {
        window.scrollTo(0, 0);
      }
      return undefined;
    }

    const id = hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [hash, currentPath]);

  return (
    <ConductorProvider>
      <a href="#contenu" className="skip-link">Aller au contenu</a>

      <Header
        currentPath={currentPath}
        onOpenMenu={() => setMenuOpen(true)}
        menuTriggerRef={menuTriggerRef}
      />

      <FullscreenMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentPath={currentPath}
        triggerRef={menuTriggerRef}
      />

      <main id="contenu" ref={mainRef} className="pt-20 min-h-screen">
        <PageConductor wrapperRef={mainRef} />
        {children}
      </main>

      <Footer />
    </ConductorProvider>
  );
}
