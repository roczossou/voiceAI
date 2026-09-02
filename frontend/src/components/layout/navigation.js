// Entrées du menu plein écran et du footer — spec promptDesign.txt §C.8.
// Consolidation 18 → 12 URLs actée en §A.3 : Compétences fusionnée dans
// /a-propos#competences, Réalisations+Projets+Galerie fusionnées dans
// /projets, Rendez-vous fusionné dans /contact. Le parcours (spec §D.3)
// est lui-même fusionné dans /a-propos#parcours sur décision client
// (2026-08-02) : plus de route /parcours séparée.
export const NAV_COLUMNS = [
  {
    title: 'PROFIL',
    links: [
      { label: 'À propos', href: '/a-propos' },
      { label: 'Mon parcours', href: '/a-propos#parcours' },
      { label: "Domaines d'expertise", href: '/expertise' },
      { label: 'Télécharger le CV', href: '/cv/cv-chabel-ananounon.pdf' },
    ],
  },
  {
    title: 'ACTIVITÉ',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Projets & réalisations', href: '/projets' },
      { label: 'Blog', href: '/blog' },
      { label: 'Prendre rendez-vous', href: '/contact?objet=rdv' },
    ],
  },
  {
    title: 'INITIATIVES',
    links: [
      { label: 'AndroCréa', href: 'https://androcrea.pythonanywhere.com' },
      { label: "DIGIT'S CRÉA AWARDS", href: 'https://www.digitscreaawards.com' },
    ],
  }
];

// Raccourcis du header. BLOG ajouté le 2026-08-03 : la page existait mais
// n'était atteignable que par le menu plein écran et le pied de page, ce qui
// la rendait invisible depuis l'accueil (retour utilisateur).
export const QUICK_NAV = [
  { label: 'PARCOURS', href: '/a-propos#parcours' },
  { label: 'PROJETS', href: '/projets' },
  { label: 'SERVICES', href: '/services' },
  { label: 'BLOG', href: '/blog' },
];

// Actif sur la page elle-même ET ses sous-routes (ex. /projets/[slug] garde
// PROJETS en aria-current) ; la query string (?mode=galerie…) et l'ancre
// (#parcours…) d'un lien sont ignorées pour ce calcul, seule l'identité de
// page compte.
export function isNavActive(currentPath, href) {
  const hrefPath = href.split('?')[0].split('#')[0];
  if (hrefPath === '/') return currentPath === '/';
  return currentPath === hrefPath || currentPath.startsWith(`${hrefPath}/`);
}
