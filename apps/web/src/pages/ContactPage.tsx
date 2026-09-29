import { useState, type ChangeEvent, type FormEvent } from 'react';
import { contactPageFaqs, services } from '../content.ts';
import { getLeadsEndpoint } from '../site.ts';
import { Container, FaqList, PageHero, SectionHeading } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';

interface FormValues {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
  website: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

type ApiErrorBody = {
  readonly ok?: boolean;
  readonly error?: {
    readonly code?: string;
    readonly message?: string;
    readonly fields?: Record<string, string>;
  };
};

const initialValues: FormValues = {
  name: '',
  email: '',
  company: '',
  phone: '',
  service: '',
  message: '',
  consent: false,
  website: ''
};

const nextSteps = [
  { number: '01', title: 'We read the request', text: 'Your message reaches us with the details you chose to share, including the service area you selected.' },
  { number: '02', title: 'We reply with a specific question', text: 'The first response asks something useful about your situation rather than sending a scripted follow-up.' },
  { number: '03', title: 'We agree one next step', text: 'A short call or a written scope. You decide whether the work continues from there.' }
];

const messageMinLength = 20;

const formFields: readonly (keyof FormValues)[] = ['name', 'email', 'company', 'phone', 'service', 'message', 'consent'];

function pickServerFields(fields: Record<string, string> | undefined): FormErrors {
  if (fields === undefined) return {};
  const picked: FormErrors = {};
  for (const field of formFields) {
    const message = fields[field];
    if (typeof message === 'string' && message.length > 0) picked[field] = message;
  }
  return picked;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Enter your name.';
  if (!values.email.trim()) {
    errors.email = 'Enter your work email.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter an email address in the format name@company.com.';
  }
  if (!values.company.trim()) errors.company = 'Enter your company or organization.';
  if (!values.service) errors.service = 'Choose the area that best fits your question.';
  if (!values.message.trim()) {
    errors.message = 'Tell us a little about what you are working through.';
  } else if (values.message.trim().length < messageMinLength) {
    errors.message = `Add a little more context so we can understand the request (${messageMinLength} characters minimum).`;
  }
  if (!values.consent) errors.consent = 'Confirm that Stellan may use these details to respond.';
  return errors;
}

export function ContactPage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const updateValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const { name, type, value } = target;
    const field = name as keyof FormValues;
    const nextValue = type === 'checkbox' ? (target as HTMLInputElement).checked : value;
    setValues((current) => ({ ...current, [field]: nextValue } as FormValues));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === 'error') {
      setStatus('idle');
      setStatusMessage('');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setStatusMessage('Please review the highlighted fields and try again.');
      const firstError = Object.keys(nextErrors)[0];
      document.getElementById(`contact-${firstError}`)?.focus();
      return;
    }

    setStatus('submitting');
    setStatusMessage('Sending your request…');

    try {
      const response = await fetch(getLeadsEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          phone: values.phone.trim() || undefined,
          service: values.service,
          message: values.message.trim(),
          consent: values.consent,
          website: values.website
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => undefined) as ApiErrorBody | undefined;
        const serverFields = pickServerFields(body?.error?.fields);

        if (Object.keys(serverFields).length > 0) {
          setErrors(serverFields);
          setStatus('error');
          setStatusMessage(body?.error?.message ?? 'Please review the highlighted fields and try again.');
          const firstError = Object.keys(serverFields)[0];
          document.getElementById(`contact-${firstError}`)?.focus();
          return;
        }

        setStatus('error');
        setStatusMessage(body?.error?.message ?? 'We could not send your request. Please try again in a moment.');
        return;
      }

      setStatus('success');
      setStatusMessage('Your request has been received. We read every message and reply with a specific question about your situation.');
      setValues(initialValues);
      setErrors({});
    } catch {
      setStatus('error');
      setStatusMessage('We could not send your request. Check your connection and try again — your entries are still here.');
    }
  };

  const fieldClass = (field: keyof FormValues) => errors[field] ? 'field has-error' : 'field';
  const describedBy = (field: keyof FormValues) => errors[field] ? `contact-${field}-error` : field === 'message' ? 'contact-message-hint' : undefined;

  return (
    <main>
      <PageHero eyebrow="Contact" title="Start with the question behind the request." description="Tell us what is changing, what feels stuck, or what you want to make possible. A focused first conversation is enough to find a useful next step." >
        <a className="button button-primary" href="#contact-form">Go to the form <Icon name="arrow-down" size={17} /></a>
        <a className="button button-ghost-light" href="/services">Browse service areas <Icon name="arrow-right" size={17} /></a>
      </PageHero>

      <section className="section contact-section" id="contact-form">
        <Container>
          <div className="contact-layout">
            <div className="contact-intro">
              <p className="eyebrow">A useful first message</p>
              <h2>Context beats a perfect brief.</h2>
              <p>Share the decision, the constraint, or the system that needs attention. We will respond with a practical next question rather than a generic sales script.</p>
              <div className="contact-detail-list">
                <div><span className="contact-detail-icon"><Icon name="globe" size={19} /></span><span><strong>Remote by design</strong><small>Distributed teams, clear handoffs</small></span></div>
                <div><span className="contact-detail-icon"><Icon name="clock" size={19} /></span><span><strong>Reply from a person</strong><small>A considered answer, not a sequence</small></span></div>
                <div><span className="contact-detail-icon"><Icon name="shield" size={19} /></span><span><strong>Only used to respond</strong><small>No marketing list, no resale</small></span></div>
              </div>
              <div className="contact-next">
                <h3>What happens next</h3>
                <ol className="contact-next-list">
                  {nextSteps.map((step) => (
                    <li key={step.number}>
                      <span className="contact-next-number" aria-hidden="true">{step.number}</span>
                      <span className="contact-next-body"><strong>{step.title}</strong><small>{step.text}</small></span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="contact-form-panel">
              <div className="form-panel-header"><div><p className="eyebrow">Tell us what is changing</p><h2>Start a conversation</h2></div><span className="required-note"><span>*</span> Required</span></div>
              <div aria-live="polite" className={`form-status form-status-${status}`} id="contact-form-status" role={status === 'error' ? 'alert' : 'status'}>
                {statusMessage || 'Fields marked with an asterisk are required.'}
              </div>
              <form aria-busy={status === 'submitting'} aria-describedby="contact-form-status" className="contact-form" noValidate onSubmit={handleSubmit}>
                <div aria-hidden="true" className="honeypot-field">
                  <label htmlFor="contact-website">Website</label>
                  <input autoComplete="off" id="contact-website" name="website" onChange={updateValue} tabIndex={-1} type="text" value={values.website} />
                </div>
                <fieldset className="form-group">
                  <legend>Your details</legend>
                  <div className="form-grid-two">
                    <div className={fieldClass('name')}><label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label><input aria-describedby={describedBy('name')} aria-invalid={Boolean(errors.name)} autoComplete="name" id="contact-name" name="name" onChange={updateValue} required value={values.name} />{errors.name ? <p className="field-error" id="contact-name-error">{errors.name}</p> : null}</div>
                    <div className={fieldClass('email')}><label htmlFor="contact-email">Work email <span aria-hidden="true">*</span></label><input aria-describedby={describedBy('email')} aria-invalid={Boolean(errors.email)} autoComplete="email" id="contact-email" name="email" onChange={updateValue} required type="email" value={values.email} />{errors.email ? <p className="field-error" id="contact-email-error">{errors.email}</p> : null}</div>
                  </div>
                  <div className="form-grid-two">
                    <div className={fieldClass('company')}><label htmlFor="contact-company">Company <span aria-hidden="true">*</span></label><input aria-describedby={describedBy('company')} aria-invalid={Boolean(errors.company)} autoComplete="organization" id="contact-company" name="company" onChange={updateValue} required value={values.company} />{errors.company ? <p className="field-error" id="contact-company-error">{errors.company}</p> : null}</div>
                    <div className="field"><label htmlFor="contact-phone">Phone <span className="optional-label">Optional</span></label><input aria-describedby={describedBy('phone')} aria-invalid={Boolean(errors.phone)} autoComplete="tel" id="contact-phone" name="phone" onChange={updateValue} type="tel" value={values.phone} />{errors.phone ? <p className="field-error" id="contact-phone-error">{errors.phone}</p> : null}</div>
                  </div>
                </fieldset>
                <fieldset className="form-group">
                  <legend>The request</legend>
                  <div className={fieldClass('service')}><label htmlFor="contact-service">What can we help with? <span aria-hidden="true">*</span></label><select aria-describedby={describedBy('service')} aria-invalid={Boolean(errors.service)} id="contact-service" name="service" onChange={updateValue} required value={values.service}><option value="">Choose a service area</option>{services.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}</select>{errors.service ? <p className="field-error" id="contact-service-error">{errors.service}</p> : null}</div>
                  <div className={fieldClass('message')}><label htmlFor="contact-message">What are you working through? <span aria-hidden="true">*</span></label><textarea aria-describedby={describedBy('message')} aria-invalid={Boolean(errors.message)} id="contact-message" name="message" onChange={updateValue} required rows={6} value={values.message} />{errors.message ? <p className="field-error" id="contact-message-error">{errors.message}</p> : <p className="field-hint" id="contact-message-hint">A few sentences are enough. Please do not include passwords or sensitive data.</p>}<p className={`field-counter${values.message.trim().length >= messageMinLength ? ' is-valid' : ''}`}>{values.message.trim().length} characters &middot; {messageMinLength} minimum</p></div>
                </fieldset>
                <div className={fieldClass('consent')}><label className="checkbox-label" htmlFor="contact-consent"><input aria-describedby={describedBy('consent')} aria-invalid={Boolean(errors.consent)} id="contact-consent" name="consent" onChange={updateValue} required type="checkbox" checked={values.consent} /><span className="checkbox-box" aria-hidden="true"><Icon name="check" size={14} /></span><span>I agree that Stellan Solutions may use these details to respond to my request. <span aria-hidden="true">*</span></span></label>{errors.consent ? <p className="field-error" id="contact-consent-error">{errors.consent}</p> : null}</div>
                <button className="button button-dark form-submit" disabled={status === 'submitting'} type="submit">{status === 'submitting' ? 'Sending…' : 'Send inquiry'}<Icon name="arrow-up-right" size={17} /></button>
                <ul className="form-assurances">
                  <li><Icon name="shield" size={16} /><span>Used only to reply to this enquiry.</span></li>
                  <li><Icon name="lock" size={16} /><span>Sent over an encrypted connection and stored securely.</span></li>
                  <li><Icon name="clock" size={16} /><span>One considered response, not an automated sequence.</span></li>
                </ul>
                <p className="form-privacy-note">By using this form, you are not opting into marketing. Read the <a href="/privacy">privacy overview</a> for how your details are handled.</p>
              </form>
            </div>
          </div>
        </Container>
      </section>

      <section className="section contact-faq-section">
        <Container><div className="split-section-heading"><SectionHeading eyebrow="Before you send" title="A few things teams wonder." description="The form is designed to make the next step easy. These answers clarify how the conversation works." /><div className="faq-wrap"><FaqList idPrefix="contact-faq" items={contactPageFaqs} /></div></div></Container>
      </section>

    </main>
  );
}
