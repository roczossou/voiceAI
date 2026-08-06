// Vocabulaire fixe spec §D.9 — doit rester synchronisé avec Article.Categorie
// côté backend (main/models.py).
export const CATEGORIES = [
  { value: 'leadership', label: 'LEADERSHIP' },
  { value: 'entrepreneuriat', label: 'ENTREPRENEURIAT' },
  { value: 'innovation', label: 'INNOVATION' },
  { value: 'intelligence_artificielle', label: 'INTELLIGENCE ARTIFICIELLE' },
  { value: 'communication', label: 'COMMUNICATION' },
  { value: 'marketing', label: 'MARKETING' },
  { value: 'digital', label: 'DIGITAL' },
  { value: 'developpement_personnel', label: 'DÉVELOPPEMENT PERSONNEL' },
  { value: 'gestion_de_projet', label: 'GESTION DE PROJET' },
  { value: 'evenementiel', label: 'ÉVÉNEMENTIEL' },
  { value: 'jeunesse', label: 'JEUNESSE' },
  { value: 'technologie', label: 'TECHNOLOGIE' },
];

export const CATEGORIE_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

export const PAGE_SIZE = 9;
