// Header collant — spec §C.8. Compact après 120px de scroll (220ms), le
// monogramme seul reste à gauche.
import { useEffect, useState } from 'react';
import { useTheme } from '../../theme';
import { ThemeToggle } from './ThemeToggle';
import { ButtonPrincipal } from '../ui/Button';
import { SiteLink } from '../ui/SiteLink';
import { QUICK_NAV, isNavActive } from './navigation';

export function Header({ currentPath = '/', onOpenMenu, menuTriggerRef }) {
  const [compact, setCompact] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header${compact ? ' is-compact' : ''}`}>
      <div className="site-header-inner container">
        <SiteLink href="/" className="site-header-brand" aria-label="Chabel ANANOUNON — Accueil">
          <span className="site-header-mark" aria-hidden="true">CA</span>
          {!compact && <span className="site-header-name">ANANOUNON</span>}
        </SiteLink>

        <nav className="site-header-nav" aria-label="Navigation rapide">
          {QUICK_NAV.map(({ label, href }) => (
            <SiteLink key={href} href={href} aria-current={isNavActive(currentPath, href) ? 'page' : undefined}>
              {label}
            </SiteLink>
          ))}
        </nav>

        <div className="site-header-actions">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <ButtonPrincipal as={SiteLink} href="/contact" className="site-header-contact">
            ME CONTACTER
          </ButtonPrincipal>
          <button
            ref={menuTriggerRef}
            type="button"
            className="site-header-menu-btn"
            aria-label="Ouvrir le menu"
            onClick={onOpenMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
