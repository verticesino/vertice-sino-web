'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import type { Locale } from './i18n';
import { CONTACT_TIMEOUT_MS, contactRules, validateContact } from '@/lib/contact-rules';
import { siteConfig } from './site-config';

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

const requiredFieldLabel = {
  es: 'Campo obligatorio',
  pt: 'Campo obrigatório',
  zh: '必填项',
} satisfies Record<Locale, string>;

const recovery = {
  es: { validation: 'Revise los campos y sus límites de longitud.', expired: 'El formulario se ha renovado. Espere dos segundos y vuelva a enviarlo; su texto se conserva.', rate: 'Demasiados intentos. Espere 10 minutos y vuelva a intentarlo.', timeout: 'No se pudo confirmar el envío. Su texto se conserva; puede reintentar o contactarnos por email.', noscript: 'Para enviar el formulario, active JavaScript o contáctenos por email.' },
  pt: { validation: 'Revise os campos e seus limites de tamanho.', expired: 'O formulário foi renovado. Aguarde dois segundos e envie novamente; seu texto foi preservado.', rate: 'Muitas tentativas. Aguarde 10 minutos e tente novamente.', timeout: 'Não foi possível confirmar o envio. Seu texto foi preservado; tente novamente ou entre em contato por email.', noscript: 'Para enviar o formulário, ative o JavaScript ou entre em contato por email.' },
  zh: { validation: '请检查字段内容和长度限制。', expired: '表单已刷新，内容已保留。请等待两秒后重新提交。', rate: '提交次数过多，请等待 10 分钟后重试。', timeout: '暂时无法确认是否已发送。内容已保留，您可以重试或通过邮箱联系我们。', noscript: '请启用 JavaScript 提交表单，或通过邮箱联系我们。' },
};
const subscribe = () => () => {};

export default function ContactForm({ locale, contact }: { locale: Locale; contact: ContactCopy }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const startedAt = useRef(0);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    if (!validateContact(data).ok) {
      setErrorMessage(recovery[locale].validation);
      setStatus('error');
      return;
    }
    setStatus('sending');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale, startedAt: startedAt.current }),
      });
      const result = await response.json() as { ok?: boolean; error?: { code?: string } } | null;
      if (!response.ok || result?.ok !== true) {
        if (result?.error?.code === 'form_expired') startedAt.current = Date.now();
        setErrorMessage(result?.error?.code === 'form_expired' ? recovery[locale].expired : response.status === 429 ? recovery[locale].rate : response.status === 400 ? recovery[locale].validation : response.status === 504 ? recovery[locale].timeout : feedback[locale].error);
        setStatus('error');
        return;
      }
      form.reset();
      startedAt.current = Date.now();
      setStatus('success');
    } catch {
      setErrorMessage(recovery[locale].timeout);
      setStatus('error');
    } finally { clearTimeout(timer); }
  }

  const f = contact.fields;
  const message = status === 'success' ? feedback[locale].success : status === 'error' ? errorMessage : '';
  const requiredLabel = (label: string) => <span className="field-label">{label}<span className="required-mark" aria-hidden="true">*</span><span className="sr-only">({requiredFieldLabel[locale]})</span></span>;

  return <form className="contact-form" method="post" action="/api/contact" onSubmit={submit} noValidate={false}>
    <noscript><p>{recovery[locale].noscript} {siteConfig.contactEmail && <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>}</p></noscript>
    <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-row"><label>{requiredLabel(f.name[0])}<input name="name" type="text" placeholder={f.name[1]} required minLength={contactRules.name.min} maxLength={contactRules.name.max} autoComplete="name" /></label><label>{requiredLabel(f.company[0])}<input name="company" type="text" placeholder={f.company[1]} required minLength={contactRules.company.min} maxLength={contactRules.company.max} autoComplete="organization" /></label></div>
    <div className="form-row"><label>{requiredLabel(f.country[0])}<input name="country" type="text" placeholder={f.country[1]} required minLength={contactRules.country.min} maxLength={contactRules.country.max} autoComplete="country-name" /></label><label>{requiredLabel(f.email[0])}<input name="email" type="email" placeholder={f.email[1]} required maxLength={contactRules.email.max} autoComplete="email" /></label></div>
    <div className="form-row"><label>{f.whatsapp[0]}<input name="whatsapp" type="tel" placeholder={f.whatsapp[1]} maxLength={contactRules.whatsapp.max} autoComplete="tel" /></label><label>{requiredLabel(f.product[0])}<input name="product" type="text" placeholder={f.product[1]} required minLength={contactRules.product.min} maxLength={contactRules.product.max} /></label></div>
    <label>{requiredLabel(f.message[0])}<textarea name="message" rows={4} placeholder={f.message[1]} required minLength={contactRules.message.min} maxLength={contactRules.message.max}></textarea></label>
    <div className="form-row optional-fields"><label>{f.budget[0]}<input name="budget" type="text" placeholder={f.budget[1]} maxLength={contactRules.budget.max} /></label><label>{f.quantity[0]}<input name="quantity" type="text" placeholder={f.quantity[1]} maxLength={contactRules.quantity.max} /></label></div>
    <label>{f.deadline[0]}<input name="deadline" type="text" placeholder={f.deadline[1]} maxLength={contactRules.deadline.max} /></label>
    <button className="button button-submit" type="submit" disabled={!ready || status === 'sending'}>{status === 'sending' ? feedback[locale].sending : contact.submit} <span>↗</span></button>
    <small className={`form-feedback${status === 'error' ? ' form-feedback-error' : ''}`} role="status" aria-live="polite">{message}</small>
  </form>;
}
