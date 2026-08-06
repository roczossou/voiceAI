// Complément JS à grid.css (spec promptDesign.txt §C.6) : au-delà de 1920px,
// aucune media query ne s'applique, ce script agrandit légèrement la base rem.
// En dessous de 1920px, le calcul donne une taille <=16px et s'efface pour
// laisser les media queries vw-based de grid.css piloter la valeur.
const FONT_BASE = 16;
const BASE_W = 1920;
const COEF = 0.6666;

function applyViewportScale() {
  const reduction = ((BASE_W - window.innerWidth) / BASE_W) * 100 * COEF;
  const size = FONT_BASE - (FONT_BASE * reduction) / 100;
  const html = document.documentElement;
  if (size > FONT_BASE) {
    html.style.fontSize = `${size}px`;
  } else {
    html.style.removeProperty('font-size');
  }
}

let attached = false;
let resizeFrame;

export function initViewportScale() {
  if (attached) return;
  attached = true;

  applyViewportScale();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(applyViewportScale);
  });
}
