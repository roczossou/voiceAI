import { useCallback, useEffect, useState } from 'react';
import { applyTheme, getInitialTheme } from './theme';

// Sélecteur de thème (spec §C.8) : deux carrés dont l'ordre s'inverse au
// basculement — ce hook fournit juste l'état, le composant visuel viendra avec
// le header partagé.
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, setTheme };
}
