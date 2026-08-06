// Bande newsletter avant le footer — spec §C.8. L'appel réseau vers le
// back-office (spec §F) n'existe pas encore : confirmation locale seulement.
import { useState } from 'react';
import { ButtonPrincipal } from '../ui/Button';

export function Newsletter() {
  const [status, setStatus] = useState('idle');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) return;
    setStatus('done');
  };

  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <p className="newsletter-text">
          Recevez mes actualités, mes articles et les prochaines éditions des
          DIGIT&apos;S CRÉA AWARDS.
        </p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">Adresse e-mail</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Votre e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="newsletter-input"
          />
          <ButtonPrincipal type="submit">JE M&apos;INSCRIS</ButtonPrincipal>
        </form>
        <p className="newsletter-status" aria-live="polite">
          {status === 'done' ? 'Inscription enregistrée.' : ''}
        </p>
      </div>
    </section>
  );
}
