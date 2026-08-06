// Boutons partagés — spec promptDesign.txt §C.8 « Boutons ».
import { useRef } from 'react';
import { useHoverSpring } from '../../motion';
import './ui.css';

export function ButtonPrincipal({ as: Tag = 'button', className = '', children, ...rest }) {
  const ref = useRef(null);
  useHoverSpring(ref, {
    property: 'scale', from: 1, to: 1.03, tension: 300, friction: 18,
  });

  return (
    <Tag ref={ref} className={`btn btn-principal pill on-signal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function ButtonSecondaire({ as: Tag = 'button', className = '', children, ...rest }) {
  return (
    <Tag className={`btn btn-secondaire ${className}`} {...rest}>
      <span className="btn-secondaire-fill" aria-hidden="true" />
      <span className="btn-secondaire-label">{children}</span>
    </Tag>
  );
}

export function ButtonTertiaire({ as: Tag = 'a', className = '', children, ...rest }) {
  const arrowRef = useRef(null);
  useHoverSpring(arrowRef, {
    property: 'x', from: 0, to: 8, tension: 300, friction: 20,
  });

  return (
    <Tag className={`btn btn-tertiaire ${className}`} {...rest}>
      <span>{children}</span>
      <svg
        ref={arrowRef}
        className="btn-tertiaire-arrow"
        viewBox="0 0 24 24"
        width="1.25rem"
        height="1.25rem"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Tag>
  );
}
