// Cartouche de section — ouvre chaque section (spec §C.8). revealTrace sur le
// filet, puis revealMask sur le libellé.
import { useRef } from 'react';
import { useRevealTrace, RevealMask } from '../../motion';
import './ui.css';

export function SectionCartouche({ label }) {
  const borderRef = useRef(null);
  useRevealTrace(borderRef);

  return (
    <div className="cartouche">
      <div ref={borderRef} className="cartouche-border" aria-hidden="true" />
      <p className="cartouche-label">
        <RevealMask as="span">{label}</RevealMask>
      </p>
    </div>
  );
}
