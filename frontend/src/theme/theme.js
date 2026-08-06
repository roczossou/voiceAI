// Thème clair/sombre — spec promptDesign.txt §C.8 « Sélecteur de thème ».
// Persistance localStorage clé "ca-theme", valeurs "light" | "dark".
// L'attribut data-theme sur <html> est déjà posé avant le premier paint par le
// script inline de index.html ; ce module ne fait que lire/écrire cet état.
const STORAGE_KEY = 'ca-theme';

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
  return document.documentElement.getAttribute('data-theme') || getStoredTheme() || getSystemTheme();
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
