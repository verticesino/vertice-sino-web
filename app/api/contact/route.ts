import { NextResponse } from 'next/server';
import { contactEmailPattern, validateContact } from '@/lib/contact-rules';
import { ContactBodyError, readContactBody } from '@/lib/contact-body';
import { createContactRateLimiter } from '@/lib/contact-rate-limit';

const limiter = createContactRateLimiter();
const fail = (status: number, code: string, headers?: Record<string, string>) => NextResponse.json({ ok: false, error: { code } }, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
const success = () => NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return fail(403, 'forbidden');
  const retryAfter = limiter.check(request.headers.get('cf-connecting-ip') ?? 'unknown');
  if (retryAfter) return fail(429, 'rate_limited', { 'Retry-After': String(retryAfter) });
  let body: Record<string, unknown>;
  try { body = await readContactBody(request); }
  catch (error) {
    return error instanceof ContactBodyError ? fail(error.status, error.code) : fail(400, 'invalid_json');
  }
  if (typeof body.website !== 'string' || body.website.length > 200) return fail(400, 'validation_failed');
  // Deliberately indistinguishable spam response; no provider call is made.
  if (body.website.trim()) return success();
  if (typeof body.startedAt !== 'number') return fail(400, 'form_expired');
  const elapsed = Date.now() - body.startedAt;
  if (!Number.isFinite(elapsed) || elapsed < 2000 || elapsed > 2 * 60 * 60_000) return fail(400, 'form_expired');
  if (typeof body.locale !== 'string' || !['es', 'pt', 'zh'].includes(body.locale)) return fail(400, 'validation_failed');
  const validated = validateContact(body);
  if (!validated.ok) return fail(400, 'validation_failed');
  const values = validated.values;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = from?.match(/<([^<>]+)>$/)?.[1] ?? from;
  if (!apiKey || !from || !fromEmail || !contactEmailPattern.test(fromEmail) || !to || !contactEmailPattern.test(to)) return fail(503, 'service_unavailable');
  const labels: Record<string, string> = { name: 'Nombre', company: 'Empresa', country: 'País', email: 'Email', whatsapp: 'WhatsApp / teléfono', product: 'Producto o tecnología', message: 'Descripción del proyecto', budget: 'Presupuesto', quantity: 'Cantidad', deadline: 'Plazo' };
  const text = Object.entries(values).map(([field, value]) => `${labels[field]}: ${value || '—'}`).join('\n');
  const html = Object.entries(values).map(([field, value]) => `<p><strong>${labels[field]}:</strong> ${escapeHtml(value || '—').replace(/\n/g, '<br>')}</p>`).join('');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: values.email, subject: `Nueva consulta web — ${values.company.replace(/[\r\n]/g, ' ')}`, text, html }),
    });
    if (!response.ok) {
      // Never log provider bodies: they can contain customer data or configuration.
      console.error('Contact provider rejected request', { status: response.status });
      return fail(502, 'provider_failure');
    }
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id || ('error' in result && result.error)) return fail(502, 'provider_failure');
    return success();
  } catch {
    return fail(controller.signal.aborted ? 504 : 502, controller.signal.aborted ? 'provider_timeout' : 'provider_failure');
  } finally { clearTimeout(timer); }
}
