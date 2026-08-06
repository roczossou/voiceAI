// Champs partagés MESSAGE/RENDEZ-VOUS — spec §D.12 : trait bas --graphite,
// libellé mono au-dessus, focus → trait --jaune-signal. Erreur = mono
// --rouge-coupure sous le champ, jamais pendant la saisie (validation au
// submit uniquement, portée par le composant appelant). `ref` est transmise
// au contrôle réel (input/textarea) pour permettre au formulaire appelant de
// donner le focus au premier champ fautif après une validation échouée.
import { forwardRef } from 'react';

export const Field = forwardRef(function Field({
  label, name, type = 'text', required, value, onChange, error, textarea, ...rest
}, ref) {
  const id = `contact-${name}`;
  const errId = `${id}-err`;
  const sharedClassName = 'w-full bg-transparent border-0 border-b-[length:var(--bd)] border-[color:var(--graphite)] py-[var(--space-3)] focus:outline-none focus:border-[color:var(--jaune-signal)] resize-none';

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label htmlFor={id} className="font-mono text-[length:var(--fs-mono)] tracking-[.05em] uppercase opacity-75">
        {label}{required ? ' *' : ''}
      </label>
      {textarea ? (
        <textarea
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errId : undefined}
          className={sharedClassName}
          {...rest}
        />
      ) : (
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errId : undefined}
          className={sharedClassName}
          {...rest}
        />
      )}
      {error && (
        <p id={errId} className="font-mono text-[length:var(--fs-mono)] text-[var(--rouge-coupure)]">{error}</p>
      )}
    </div>
  );
});

export function RadioGroup({
  label, name, options, value, onChange, error,
}) {
  const errId = `contact-${name}-err`;

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <p className="font-mono text-[length:var(--fs-mono)] tracking-[.05em] uppercase opacity-75">{label} *</p>
      <div
        role="radiogroup"
        aria-label={label}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errId : undefined}
        className="flex flex-wrap gap-[var(--space-2)]"
      >
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const disabled = typeof opt === 'object' && !!opt.disabled;
          const checked = value === optValue;

          return (
            <button
              key={optValue}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={disabled}
              onClick={() => onChange(optValue)}
              className={`border-[length:var(--trait)] px-[var(--space-4)] py-[var(--space-2)] font-mono text-[length:var(--fs-mono)] font-semibold uppercase tracking-[.05em] transition-colors duration-100 ${
                checked ? 'bg-[var(--graphite)] text-[var(--calque)] border-[color:var(--graphite)]' : 'border-[color:var(--bordure)]'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {optLabel}
              {disabled ? ' — À VENIR' : ''}
            </button>
          );
        })}
      </div>
      {error && (
        <p id={errId} className="font-mono text-[length:var(--fs-mono)] text-[var(--rouge-coupure)]">{error}</p>
      )}
    </div>
  );
}

export function SubmitButton({ pending, success, children }) {
  return (
    <button
      type="submit"
      disabled={pending || success}
      className={`pill inline-flex items-center gap-[var(--space-2)] px-[var(--space-8)] py-[var(--space-4)] font-mono text-[length:var(--fs-mono-lg)] font-semibold uppercase tracking-[.05em] transition-colors duration-150 ${
        success ? 'bg-[var(--led-vert)] text-[var(--graphite)]' : 'bg-[var(--jaune-signal)] text-[var(--graphite)]'
      } disabled:cursor-not-allowed`}
    >
      {success ? 'DEMANDE ENREGISTRÉE' : children}
    </button>
  );
}
