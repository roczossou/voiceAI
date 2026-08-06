// Thème clair/sombre — spec promptDesign.txt §C.8 « Sélecteur de thème ».
// Persistance localStorage clé "ca-theme", valeurs "light" | "dark".
// L'attribut data-theme sur <html> est déjà posé avant le premier paint par le
// script inline de index.html ; ce module ne fait que lire/écrire cet état.
const STORAGE_KEY = 'ca-theme';

// Le site s'ouvre en clair, quelle que soit la préférence système : c'est le
// thème de référence de la charte (spec §C.4). Le mode sombre reste accessible
// via le sélecteur du header, et le choix du visiteur est mémorisé.
export const DEFAULT_THEME = 'light';

export function getStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getInitialTheme() {
  return document.documentElement.getAttribute('data-theme') || getStoredTheme() || DEFAULT_THEME;
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage indisponible (navigation privée, quota) — le thème reste
    // appliqué pour la session en cours, simplement non persisté.
  }
}
