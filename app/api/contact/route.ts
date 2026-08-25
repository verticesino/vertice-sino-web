import { NextResponse } from 'next/server';

const requiredFields = ['name', 'company', 'country', 'email', 'product', 'message'] as const;
const limits: Record<string, number> = { name: 100, company: 120, country: 80, email: 254, whatsapp: 40, product: 160, message: 4000, budget: 100, quantity: 100, deadline: 100 };
const attempts = new Map<string, number[]>();

function clean(value: unknown, limit: number) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter(time => now - time < 10 * 60_000);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 12_000) return NextResponse.json({ ok: false }, { status: 413 });

  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403 });

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (isRateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (clean(body.website, 200)) return NextResponse.json({ ok: true });
  const startedAt = Number(body.startedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 2_000 || elapsed > 2 * 60 * 60_000) return NextResponse.json({ ok: false }, { status: 400 });

  const values = Object.fromEntries(Object.entries(limits).map(([field, limit]) => [field, clean(body[field], limit)]));
  if (requiredFields.some(field => !values[field])) return NextResponse.json({ ok: false }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.message.length < 10) return NextResponse.json({ ok: false }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? 'verticesino@gmail.com';
  if (!apiKey || !from) return NextResponse.json({ ok: false }, { status: 503 });

  const labels: Record<string, string> = { name: 'Nombre', company: 'Empresa', country: 'País', email: 'Email', whatsapp: 'WhatsApp / teléfono', product: 'Producto o tecnología', message: 'Descripción del proyecto', budget: 'Presupuesto', quantity: 'Cantidad', deadline: 'Plazo' };
  const text = Object.entries(labels).map(([field, label]) => `${label}: ${values[field] || '—'}`).join('\n');
  const html = Object.entries(labels).map(([field, label]) => `<p><strong>${label}:</strong> ${escapeHtml(values[field] || '—').replace(/\n/g, '<br>')}</p>`).join('');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: values.email, subject: `Nueva consulta web — ${values.company}`, text, html }),
  });

  if (!response.ok) {
    const providerBody = await response.text();
    let providerType = 'unknown_error';
    let providerMessage = 'Resend returned an unreadable error response';

    try {
      const providerError = JSON.parse(providerBody) as Record<string, unknown>;
      if (typeof providerError.name === 'string') providerType = providerError.name;
      else if (typeof providerError.type === 'string') providerType = providerError.type;
      if (typeof providerError.message === 'string') providerMessage = providerError.message;
    } catch {
      if (providerBody) providerType = 'non_json_error';
    }

    const safeMessage = providerMessage
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted email]')
      .slice(0, 500);
    console.error('Contact email provider rejected the request', {
      status: response.status,
      type: providerType.slice(0, 100),
      message: safeMessage,
    });
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
