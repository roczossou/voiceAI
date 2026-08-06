// Registre des sections pour le conducteur de page (spec §C.8). Les hooks
// useConductorSection / useConductorSections vivent dans useConductor.js
// (react-refresh exige qu'un fichier de composant n'exporte que des
// composants).
import {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { ConductorContext } from './conductorContext';

export function ConductorProvider({ children }) {
  const [sections, setSections] = useState([]);
  const registryRef = useRef(new Map());

  // `setSections` reçoit toujours un tableau neuf : sans le garde-fou
  // ci-dessous, un réenregistrement identique suffirait à relancer un rendu
  // (et, si l'appelant réagit à ce rendu, une boucle infinie). On ne
  // republie donc l'état que si la section a réellement changé.
  const registerSection = useCallback((id, label, node) => {
    const existing = registryRef.current.get(id);
    if (existing && existing.label === label && existing.node === node) return;
    registryRef.current.set(id, { id, label, node });
    setSections(Array.from(registryRef.current.values()));
  }, []);

  const unregisterSection = useCallback((id) => {
    if (!registryRef.current.delete(id)) return;
    setSections(Array.from(registryRef.current.values()));
  }, []);

  const value = useMemo(
    () => ({ sections, registerSection, unregisterSection }),
    [sections, registerSection, unregisterSection],
  );

  return <ConductorContext.Provider value={value}>{children}</ConductorContext.Provider>;
}
