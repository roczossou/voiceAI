// Onglet RENDEZ-VOUS — spec §D.12. Même politique de validation/anti-spam
// que MessageForm.jsx. `Date souhaitée` : min = aujourd'hui + 1 jour.
import { useEffect, useRef, useState } from 'react';
import { Field, RadioGroup, SubmitButton } from './FormFields';
import { TYPES_RDV, CRENEAUX } from './constants';
import { postDemande } from '../../api/client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function validate(fields) {
  const errors = {};
  if (!fields.type) errors.type = 'Sélectionnez un type de rendez-vous.';
  if (!fields.nom.trim()) errors.nom = 'Ce champ est obligatoire.';
  if (!fields.email.trim()) errors.email = 'Ce champ est obligatoire.';
  else if (!EMAIL_RE.test(fields.email)) errors.email = 'Adresse e-mail invalide.';
  if (!fields.objet.trim()) errors.objet = 'Ce champ est obligatoire.';
  if (!fields.date) errors.date = 'Choisissez une date souhaitée.';
  if (!fields.creneau) errors.creneau = 'Choisissez un créneau.';
  if (!fields.message.trim()) errors.message = 'Ce champ est obligatoire.';
  return errors;
}

export function RdvForm({ initialType }) {
  const [fields, setFields] = useState({
    type: initialType || '', nom: '', organisation: '', email: '', telephone: '',
    objet: '', date: '', creneau: '', message: '', _gotcha: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const renderedAt = useRef(null);
  const typeRef = useRef(null);
  const nomRef = useRef(null);
  const emailRef = useRef(null);
  const objetRef = useRef(null);
  const dateRef = useRef(null);
  const creneauRef = useRef(null);
  const messageRef = useRef(null);
  const [dateMin] = useState(() => minDate());

  useEffect(() => {
    renderedAt.current = Date.now() / 1000;
  }, []);

  const setField = (name) => (e) => setFields((f) => ({ ...f, [name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    const orderedRefs = [
      ['type', typeRef], ['nom', nomRef], ['email', emailRef], ['objet', objetRef],
      ['date', dateRef], ['creneau', creneauRef], ['message', messageRef],
    ];
    const firstInvalid = orderedRefs.find(([key]) => nextErrors[key]);
    if (firstInvalid) {
      firstInvalid[1].current?.focus();
      return;
    }

    setStatus('pending');
    try {
      await postDemande({
        canal: 'rdv',
        segment: fields.type,
        nom: fields.nom,
        organisation: fields.organisation,
        email: fields.email,
        telephone: fields.telephone,
        objet: fields.objet,
        date_souhaitee: fields.date,
        creneau: fields.creneau,
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

      <div ref={typeRef} tabIndex={-1}>
        <RadioGroup
          label="Type de rendez-vous"
          name="type"
          options={TYPES_RDV}
          value={fields.type}
          onChange={(v) => setFields((f) => ({ ...f, type: v }))}
          error={errors.type}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field ref={nomRef} label="Nom" name="nom" required value={fields.nom} onChange={setField('nom')} error={errors.nom} />
        <Field label="Organisation" name="organisation" value={fields.organisation} onChange={setField('organisation')} />
        <Field ref={emailRef} label="E-mail" name="email" type="email" required value={fields.email} onChange={setField('email')} error={errors.email} />
        <Field label="Téléphone" name="telephone" type="tel" value={fields.telephone} onChange={setField('telephone')} />
      </div>

      <Field ref={objetRef} label="Objet" name="objet" required value={fields.objet} onChange={setField('objet')} error={errors.objet} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field ref={dateRef} label="Date souhaitée" name="date" type="date" required min={dateMin} value={fields.date} onChange={setField('date')} error={errors.date} />
        <div ref={creneauRef} tabIndex={-1}>
          <RadioGroup
            label="Créneau"
            name="creneau"
            options={CRENEAUX}
            value={fields.creneau}
            onChange={(v) => setFields((f) => ({ ...f, creneau: v }))}
            error={errors.creneau}
          />
        </div>
      </div>

      <Field ref={messageRef} label="Message" name="message" required textarea value={fields.message} onChange={setField('message')} error={errors.message} />

      <div className="flex flex-col gap-2">
        <SubmitButton pending={status === 'pending'} success={status === 'success'}>ENVOYER LA DEMANDE</SubmitButton>
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
