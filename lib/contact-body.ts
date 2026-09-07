import { CONTACT_BODY_BYTES } from './contact-rules';

export class ContactBodyError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}

export async function readContactBody(request: Request): Promise<Record<string, unknown>> {
  if (Number(request.headers.get('content-length')) > CONTACT_BODY_BYTES) throw new ContactBodyError(413, 'body_too_large');
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new ContactBodyError(415, 'unsupported_media_type');
  if (!request.body) throw new ContactBodyError(400, 'invalid_json');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 10_000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (timedOut) throw new ContactBodyError(408, 'request_timeout');
      if (done) break;
      bytes += value.byteLength;
      if (bytes > CONTACT_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        throw new ContactBodyError(413, 'body_too_large');
      }
      chunks.push(value);
    }
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(buffer));
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ContactBodyError(400, 'invalid_json');
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ContactBodyError) throw error;
    throw new ContactBodyError(400, 'invalid_json');
  } finally { clearTimeout(timer); reader.releaseLock(); }
}
