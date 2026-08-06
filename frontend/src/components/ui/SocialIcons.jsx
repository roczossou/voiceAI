// Icônes réseaux sociaux — SVG tracés à la main, spec §C.2 (aucune librairie
// d'icônes, tout le site n'utilise que GSAP/Lenis). Un seul endroit pour ces
// tracés puisqu'ils sont réutilisés à plusieurs endroits (footer, menu plein
// écran, utilitaires flottants).
export function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="1.25rem" height="1.25rem" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.001 3C9.107 3 3.5 8.607 3.5 15.5c0 2.294.617 4.44 1.694 6.29L3 29l7.4-2.148A12.44 12.44 0 0 0 16 28.5C22.893 28.5 28.5 22.893 28.5 16S22.893 3 16.001 3zm0 22.75a10.2 10.2 0 0 1-5.2-1.42l-.373-.222-4.39 1.274 1.298-4.28-.243-.39A10.2 10.2 0 0 1 5.75 15.5C5.75 9.84 10.34 5.25 16 5.25S26.25 9.84 26.25 15.5 21.66 25.75 16.001 25.75zm5.59-7.66c-.306-.154-1.81-.893-2.09-.995-.28-.102-.484-.153-.688.153s-.79.995-.968 1.2-.357.23-.663.077a8.32 8.32 0 0 1-2.45-1.51 9.18 9.18 0 0 1-1.696-2.104c-.178-.306-.019-.472.134-.624.138-.137.306-.357.459-.535a2.1 2.1 0 0 0 .306-.51.562.562 0 0 0-.026-.535c-.077-.153-.688-1.657-.943-2.27-.248-.596-.5-.516-.688-.526-.178-.009-.382-.011-.586-.011a1.13 1.13 0 0 0-.816.382 3.43 3.43 0 0 0-1.07 2.55 5.96 5.96 0 0 0 1.244 3.16 13.65 13.65 0 0 0 5.223 4.618c.73.315 1.298.503 1.742.643a4.19 4.19 0 0 0 1.924.121c.587-.088 1.81-.74 2.065-1.454.256-.715.256-1.327.179-1.454-.077-.128-.281-.204-.587-.358z" />
    </svg>
  );
}

export function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="1.1rem" height="1.1rem" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3.5 6.5h17v11h-17z" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </svg>
  );
}
