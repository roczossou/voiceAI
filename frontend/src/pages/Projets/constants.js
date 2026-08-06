// Vocabulaire fixe spec §D.5 — doit rester synchronisé avec les TextChoices
// de main/models.py (Projet.Nature / Projet.Type) côté backend.
export const NATURES = [
  { value: '', label: 'TOUT' },
  { value: 'professionnel', label: 'PROFESSIONNEL' },
  { value: 'entrepreneurial', label: 'ENTREPRENEURIAL' },
  { value: 'institutionnel', label: 'INSTITUTIONNEL' },
];

export const TYPES = [
  { value: 'identite_visuelle', label: 'IDENTITÉ VISUELLE' },
  { value: 'logo', label: 'LOGO' },
  { value: 'affiche', label: 'AFFICHE' },
  { value: 'flyer', label: 'FLYER' },
  { value: 'badge', label: 'BADGE' },
  { value: 'mockup', label: 'MOCKUP' },
  { value: 'banniere', label: 'BANNIÈRE' },
  { value: 'campagne_digitale', label: 'CAMPAGNE DIGITALE' },
  { value: 'site_web', label: 'SITE WEB' },
  { value: 'support_evenementiel', label: 'SUPPORT ÉVÉNEMENTIEL' },
  { value: 'realisation_technique', label: 'RÉALISATION TECHNIQUE' },
  { value: 'photographie', label: 'PHOTOGRAPHIE' },
  { value: 'video', label: 'VIDÉO' },
];
