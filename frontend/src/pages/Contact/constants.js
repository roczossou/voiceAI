// Vocabulaire fixe spec §D.12 — doit rester synchronisé avec Demande.Canal
// côté backend (main/models.py) pour le champ `canal`.
export const SEGMENTS = [
  'INSTITUTION', 'ORGANISATION INTERNATIONALE', 'ENTREPRISE',
  'JEUNE PORTEUR DE PROJET', 'PARTENAIRE', 'MÉDIA',
];

export const TYPES_RDV = [
  { value: 'CONSULTATION', label: 'CONSULTATION' },
  { value: 'REUNION', label: 'RÉUNION' },
  { value: 'ACCOMPAGNEMENT', label: 'ACCOMPAGNEMENT' },
  { value: 'COACHING', label: 'COACHING', disabled: true },
  { value: 'FORMATION', label: 'FORMATION' },
  { value: 'CONFERENCE', label: 'CONFÉRENCE' },
  { value: 'PARTENARIAT', label: 'PARTENARIAT' },
  { value: 'DEVIS', label: 'DEMANDE DE DEVIS' },
];

export const CRENEAUX = [
  { value: 'matin', label: 'MATIN' },
  { value: 'apres_midi', label: 'APRÈS-MIDI' },
];

// Objet de requête (§D.1 R07, §D.4) présélectionné via ?objet= — pilote
// l'onglet ouvert et préremplit le champ Objet côté MESSAGE. `rdv` seul
// ouvre l'onglet RENDEZ-VOUS (spec §D.12).
export const OBJET_LABELS = {
  devis: 'Demande de devis',
  formation: 'Réserver une formation',
  partenariat: 'Proposer un partenariat',
  collaboration: 'Collaborer',
};
