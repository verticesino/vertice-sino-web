// Lengths use UTF-16 code units, matching HTML minlength/maxlength and JS length.
// 32 KiB also accommodates the maximum fields when JSON escapes every code unit.
export const CONTACT_BODY_BYTES = 32 * 1024;
export const CONTACT_TIMEOUT_MS = 20_000;
export const contactRules = {
  name: { min: 2, max: 100 }, company: { min: 2, max: 120 },
  country: { min: 2, max: 80 }, email: { min: 3, max: 254 },
  whatsapp: { min: 0, max: 40 }, product: { min: 2, max: 160 },
  message: { min: 10, max: 4000 }, budget: { min: 0, max: 100 },
  quantity: { min: 0, max: 100 }, deadline: { min: 0, max: 100 },
} as const;
export type ContactField = keyof typeof contactRules;
// ASCII email syntax shared with the browser's email input; require a dotted domain.
export const contactEmailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateContact(input: Record<string, unknown>) {
  const values = {} as Record<ContactField, string>;
  for (const field of Object.keys(contactRules) as ContactField[]) {
    const rule = contactRules[field];
    const raw = input[field] === undefined && rule.min === 0 ? '' : input[field];
    if (typeof raw !== 'string' || raw.length > rule.max) return { ok: false as const, field };
    const value = raw.trim();
    if (value.length < rule.min || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return { ok: false as const, field };
    values[field] = value;
  }
  if (!contactEmailPattern.test(values.email)) return { ok: false as const, field: 'email' as const };
  return { ok: true as const, values };
}
