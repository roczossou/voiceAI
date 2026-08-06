// Sélecteur de thème — spec §C.8. Deux carrés dont la position s'inverse au
// basculement (200ms easeInOutCubic), pas d'icône soleil/lune.
export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle${isDark ? ' is-dark' : ''}`}
      aria-pressed={isDark}
      aria-label={isDark ? 'Basculer en thème clair' : 'Basculer en thème sombre'}
      onClick={onToggle}
    >
      <span className="theme-toggle-squares">
        <span className="theme-toggle-square theme-toggle-square-a" />
        <span className="theme-toggle-square theme-toggle-square-b" />
      </span>
    </button>
  );
}
