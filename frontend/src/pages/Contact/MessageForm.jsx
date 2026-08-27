// Onglet MESSAGE — spec §D.12. Validation au submit uniquement, anti-spam
// honeypot + horodatage de rendu (vérifiés côté serveur, voir
// backend/back/main/serializers.py DemandeSerializer).
import { useEffect, useRef, useState } from 'react';
import { Field, RadioGroup, SubmitButton } from './FormFields';
import { SEGMENTS } from './constants';
import { postDemande } from '../../api/client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields) {
  const errors = {};
  if (!fields.segment) errors.segment = 'Sélectionnez une catégorie.';
  if (!fields.nom.trim()) errors.nom = 'Ce champ est obligatoire.';
  if (!fields.email.trim()) errors.email = 'Ce champ est obligatoire.';
  else if (!EMAIL_RE.test(fields.email)) errors.email = 'Adresse e-mail invalide.';
  if (!fields.objet.trim()) errors.objet = 'Ce champ est obligatoire.';
  if (!fields.message.trim()) errors.message = 'Ce champ est obligatoire.';
  return errors;
}

export function MessageForm({ initialObjet }) {
  const [fields, setFields] = useState({
    segment: '', nom: '', organisation: '', email: '', telephone: '',
    objet: initialObjet || '', message: '', _gotcha: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const renderedAt = useRef(null);
  const segmentRef = useRef(null);
  const nomRef = useRef(null);
  const emailRef = useRef(null);
  const objetRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    renderedAt.current = Date.now() / 1000;
  }, []);

  const setField = (name) => (e) => setFields((f) => ({ ...f, [name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    const orderedRefs = [
      ['segment', segmentRef], ['nom', nomRef], ['email', emailRef],
      ['objet', objetRef], ['message', messageRef],
    ];
    const firstInvalid = orderedRefs.find(([key]) => nextErrors[key]);
    if (firstInvalid) {
      firstInvalid[1].current?.focus();
      return;
    }

    setStatus('pending');
    try {
      await postDemande({
        canal: 'message',
        segment: fields.segment,
        nom: fields.nom,
        organisation: fields.organisation,
        email: fields.email,
        telephone: fields.telephone,
        objet: fields.objet,
        message: fields.message,
        _gotcha: fields._gotcha,
        _rendu_le: renderedAt.current,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px]"
        value={fields._gotcha}
        onChange={setField('_gotcha')}
      />

      <div ref={segmentRef} tabIndex={-1}>
        <RadioGroup
          label="Vous êtes"
          name="segment"
          options={SEGMENTS}
          value={fields.segment}
          onChange={(v) => setFields((f) => ({ ...f, segment: v }))}
          error={errors.segment}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field ref={nomRef} label="Nom et prénom" name="nom" required value={fields.nom} onChange={setField('nom')} error={errors.nom} />
        <Field label="Organisation" name="organisation" value={fields.organisation} onChange={setField('organisation')} />
        <Field ref={emailRef} label="E-mail" name="email" type="email" required value={fields.email} onChange={setField('email')} error={errors.email} />
        <Field label="Téléphone" name="telephone" type="tel" value={fields.telephone} onChange={setField('telephone')} />
      </div>

      <Field ref={objetRef} label="Objet" name="objet" required value={fields.objet} onChange={setField('objet')} error={errors.objet} />
      <Field ref={messageRef} label="Message" name="message" required textarea value={fields.message} onChange={setField('message')} error={errors.message} />

      <div className="flex flex-col gap-2">
        <SubmitButton pending={status === 'pending'} success={status === 'success'}>ENVOYER LE MESSAGE</SubmitButton>
        {status === 'success' && (
          <p aria-live="polite" className="font-mono text-[length:var(--fs-mono)]">
            Vous recevrez une réponse par e-mail dans les meilleurs délais.
          </p>
        )}
        {status === 'error' && (
          <p aria-live="polite" className="font-mono text-[length:var(--fs-mono)] text-[var(--rouge-coupure)]">
            Une erreur est survenue. Merci de réessayer dans quelques instants.
          </p>
        )}
      </div>
    </form>
  );
}
