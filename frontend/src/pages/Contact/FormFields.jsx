import { forwardRef } from 'react';

export const Field = forwardRef(function Field({
  label, name, type = 'text', required, value, onChange, error, textarea, ...rest
}, ref) {
  const id = `contact-${name}`;
  const errId = `${id}-err`;
  const sharedClassName = `w-full bg-surface px-4 py-3 rounded-xl border transition-all outline-none font-body-md text-on-background ${error ? 'border-error-red focus:border-error-red focus:ring-2 focus:ring-error-red/20' : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20'}`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-label-sm text-on-background tracking-wider">
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
          className={`${sharedClassName} resize-y`}
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
        <p id={errId} className="font-label-sm text-error-red mt-1">{error}</p>
      )}
    </div>
  );
});

export function RadioGroup({
  label, name, options, value, onChange, error,
}) {
  const errId = `contact-${name}-err`;

  return (
    <div className="flex flex-col gap-3">
      <p className="font-label-sm text-on-background tracking-wider">{label} *</p>
      <div
        role="radiogroup"
        aria-label={label}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errId : undefined}
        className="flex flex-wrap gap-2"
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
              className={`px-4 py-2 rounded-full border-2 font-label-lg tracking-wider transition-all duration-150 ${checked ? 'bg-primary text-on-primary border-primary shadow-md scale-[1.03]' : 'bg-surface text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {optLabel}
              {disabled ? ' — À VENIR' : ''}
            </button>
          );
        })}
      </div>
      {error && (
        <p id={errId} className="font-label-sm text-error-red mt-1">{error}</p>
      )}
    </div>
  );
}

export function SubmitButton({ pending, success, children }) {
  return (
    <button
      type="submit"
      disabled={pending || success}
      className={`w-full font-label-lg text-label-lg py-4 px-8 rounded-xl transition-all flex justify-center items-center gap-2 group disabled:cursor-not-allowed mt-2 shadow-md hover:shadow-lg hover:scale-[1.01] ${success ? 'bg-success-green text-on-primary' : 'bg-secondary-container text-on-background hover:bg-secondary'
        }`}
    >
      <span>{success ? 'DEMANDE ENREGISTRÉE' : children}</span>
      {!success && (
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
      )}
    </button>
  );
}
