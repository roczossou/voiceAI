// Ressort minimal partagé — spec promptDesign.txt §C.7 :
//   v += (-tension*(x-target) - friction*v)*dt ; x += v*dt   (dt clampé à 1/30s)
// Toutes les valeurs "spring" de l'app (revealRise, hoverSpring, panneau
// d'onglets…) sont des particules poussées par une unique boucle gsap.ticker,
// plutôt que d'ouvrir une boucle requestAnimationFrame par composant.
import gsap from 'gsap';

const SETTLE_EPSILON = 0.001;

const particles = new Set();
let tickerAttached = false;

function step(_time, deltaTime) {
  const dt = Math.min(deltaTime / 1000, 1 / 30);
  particles.forEach((p) => {
    p.velocity += (-p.tension * (p.value - p.target) - p.friction * p.velocity) * dt;
    p.value += p.velocity * dt;

    const settled = Math.abs(p.target - p.value) < SETTLE_EPSILON
      && Math.abs(p.velocity) < SETTLE_EPSILON;

    if (settled) {
      p.value = p.target;
      p.velocity = 0;
    }

    p.onUpdate(p.value);

    if (settled) {
      particles.delete(p);
      p.onSettle?.();
    }
  });
}

function ensureTicker() {
  if (!tickerAttached) {
    gsap.ticker.add(step);
    tickerAttached = true;
  }
}

/**
 * Crée une valeur numérique pilotée par ressort.
 * @param {{value?:number, tension?:number, friction?:number, onUpdate:(v:number)=>void, onSettle?:()=>void}} opts
 */
export function createSpringValue({
  value = 0,
  tension = 220,
  friction = 24,
  onUpdate,
  onSettle,
}) {
  ensureTicker();

  const particle = {
    value, target: value, velocity: 0, tension, friction, onUpdate, onSettle,
  };

  return {
    set(target, overrides = {}) {
      particle.target = target;
      if (overrides.tension != null) particle.tension = overrides.tension;
      if (overrides.friction != null) particle.friction = overrides.friction;
      particles.add(particle);
    },
    jumpTo(next) {
      particle.value = next;
      particle.target = next;
      particle.velocity = 0;
      particles.delete(particle);
      onUpdate(next);
    },
    stop() {
      particles.delete(particle);
    },
    get value() {
      return particle.value;
    },
  };
}
