// Carte partagée — spec promptDesign.txt §C.8 « Carte ».
import { useRef } from 'react';
import { useHoverSpring } from '../../motion';
import './ui.css';

export function Card({
  as: Tag = 'div', visual, children, className = '', ...rest
}) {
  const visualRef = useRef(null);
  useHoverSpring(visualRef, {
    property: 'scale', from: 1, to: 1.03, tension: 240, friction: 26,
  });

  return (
    <Tag className={`card ${className}`} {...rest}>
      {visual && (
        <div className="card-visual">
          <div ref={visualRef} className="card-visual-inner">{visual}</div>
        </div>
      )}
      <div className="card-body">{children}</div>
    </Tag>
  );
}
