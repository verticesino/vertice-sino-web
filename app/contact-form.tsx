'use client';

import { useRef, useState, type FormEvent } from 'react';
import type { Locale } from './i18n';

type ContactCopy = {
  fields: Record<string, readonly string[]>;
  submit: string;
};

const feedback = {
  es: {
    sending: 'Enviando…',
    success: 'Su consulta fue enviada correctamente. Nos pondremos en contacto a la brevedad.',
    error: 'No pudimos enviar su consulta. Inténtelo nuevamente o escríbanos a verticesino@gmail.com.',
  },
  pt: {
    sending: 'Enviando…',
    success: 'Sua consulta foi enviada com sucesso. Entraremos em contato em breve.',
    error: 'Não foi possível enviar sua consulta. Tente novamente ou escreva para verticesino@gmail.com.',
  },
  zh: {
    sending: '正在提交…',
    success: '您的咨询已成功提交。我们会尽快与您联系。',
    error: '咨询提交失败。请重试或发送邮件至 verticesino@gmail.com。',
  },
} satisfies Record<Locale, Record<'sending' | 'success' | 'error', string>>;

export default function ContactForm({ locale, contact }: { locale: Locale; contact: ContactCopy }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const startedAt = useRef(Date.now());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setStatus('sending');
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale, startedAt: startedAt.current }),
      });
      if (!response.ok) throw new Error('Contact request failed');
      form.reset();
      startedAt.current = Date.now();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const f = contact.fields;
  const message = status === 'success' ? feedback[locale].success : status === 'error' ? feedback[locale].error : '';

  return <form className="contact-form" onSubmit={submit} noValidate={false}>
    <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-row"><label>{f.name[0]}<input name="name" type="text" placeholder={f.name[1]} required minLength={2} maxLength={100} autoComplete="name" /></label><label>{f.company[0]}<input name="company" type="text" placeholder={f.company[1]} required minLength={2} maxLength={120} autoComplete="organization" /></label></div>
    <div className="form-row"><label>{f.country[0]}<input name="country" type="text" placeholder={f.country[1]} required minLength={2} maxLength={80} autoComplete="country-name" /></label><label>{f.email[0]}<input name="email" type="email" placeholder={f.email[1]} required maxLength={254} autoComplete="email" /></label></div>
    <div className="form-row"><label>{f.whatsapp[0]}<input name="whatsapp" type="tel" placeholder={f.whatsapp[1]} maxLength={40} autoComplete="tel" /></label><label>{f.product[0]}<input name="product" type="text" placeholder={f.product[1]} required minLength={2} maxLength={160} /></label></div>
    <label>{f.message[0]}<textarea name="message" rows={4} placeholder={f.message[1]} required minLength={10} maxLength={4000}></textarea></label>
    <div className="form-row optional-fields"><label>{f.budget[0]}<input name="budget" type="text" placeholder={f.budget[1]} maxLength={100} /></label><label>{f.quantity[0]}<input name="quantity" type="text" placeholder={f.quantity[1]} maxLength={100} /></label></div>
    <label>{f.deadline[0]}<input name="deadline" type="text" placeholder={f.deadline[1]} maxLength={100} /></label>
    <button className="button button-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? feedback[locale].sending : contact.submit} <span>↗</span></button>
    <small className={`form-feedback${status === 'error' ? ' form-feedback-error' : ''}`} role="status" aria-live="polite">{message}</small>
  </form>;
}
