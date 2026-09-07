import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the actual TS handlers without starting Next or sending external email.
function load(entry, overrides = {}) {
  const cache = new Map();
  const context = vm.createContext({ Request, Response, URL, TextDecoder, Uint8Array, AbortController, setTimeout, clearTimeout, Date, console: { error() {} }, process: { env: {} }, fetch: async () => { throw Error('External delivery forbidden in tests'); }, ...overrides });
  function module(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const require = name => name === 'next/server' ? { NextResponse: { json: Response.json } } : module(name.startsWith('@/') ? `${name.slice(2)}.ts` : path.resolve(path.dirname(file), `${name}.ts`));
    vm.runInContext(`(function(exports, require){${code}\n})`, context)(exports, require);
    return exports;
  }
  return module(entry);
}
const good = () => ({ name: 'Test Person', company: 'Test Company', country: 'Argentina', email: 'test@example.invalid', product: 'Equipment', message: 'Isolated regression test.', website: '', locale: 'es', startedAt: Date.now() - 5000 });
const request = (body, headers = {}) => new Request('https://test.invalid/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const env = { RESEND_API_KEY: 'test-only', RESEND_FROM_EMAIL: 'Test <sender@example.invalid>', CONTACT_TO_EMAIL: 'recipient@example.invalid' };
const handler = (overrides = {}) => load('app/api/contact/route.ts', { process: { env }, fetch: async () => Response.json({ id: 'mock-accepted-id' }), ...overrides }).POST;

for (const [name, body, status, headers] of [
  ['normal', good(), 200], ['malformed JSON', '{', 400], ['null JSON', 'null', 400], ['array JSON', [], 400],
  ['invalid email', { ...good(), email: 'x@-bad.test' }, 400], ['short name', { ...good(), name: 'x' }, 400],
  ['oversize field is rejected without truncation', { ...good(), product: 'x'.repeat(161) }, 400],
  ['null optional field', { ...good(), budget: null }, 400],
  ['malformed timestamp type', { ...good(), startedAt: { toString: null } }, 400],
  ['malformed locale type', { ...good(), locale: { toString: null } }, 400],
  ['actual oversize without length', { ...good(), extra: 'x'.repeat(32768) }, 413],
  ['false small declared length', { ...good(), extra: 'x'.repeat(32768) }, 413, { 'content-length': '1' }],
  ['declared oversize', good(), 413, { 'content-length': '32769' }],
  ['native POST fails safely', 'name=test', 415, { 'content-type': 'application/x-www-form-urlencoded' }],
  ['cross origin', good(), 403, { origin: 'https://other.invalid' }],
  ['expired form', { ...good(), startedAt: Date.now() - 7201000 }, 400],
]) test(name, async () => {
  const result = await handler()(request(body, headers));
  assert.equal(result.status, status);
  const json = await result.json();
  assert.equal(json.ok, status === 200);
  if (status !== 200) assert.equal(typeof json.error.code, 'string');
});

test('all field boundaries and maximum UTF-8 ES/PT/ZH text', async () => {
  const { contactRules, validateContact, CONTACT_BODY_BYTES } = load('lib/contact-rules.ts');
  const maximumEmail = `${'x'.repeat(64)}@${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(61)}`;
  assert.equal(maximumEmail.length, 254);
  assert.equal((await handler()(request({ ...good(), email: maximumEmail }))).status, 200);
  assert.equal(validateContact({ ...good(), email: `x${maximumEmail}` }).ok, false);
  assert.equal(validateContact({ ...good(), email: `x@${'a'.repeat(64)}.test` }).ok, false);
  for (const [field, rule] of Object.entries(contactRules)) {
    if (field === 'email') continue;
    for (const character of ['中', 'ñ', 'ã']) {
      const data = { ...good(), [field]: character.repeat(rule.max) };
      assert.equal(validateContact(data).ok, true, field);
      assert.equal((await handler()(request(data))).status, 200);
    }
    assert.equal(validateContact({ ...good(), [field]: 'x'.repeat(rule.max + 1) }).ok, false);
  }
  const maximum = { ...good() };
  for (const [field, rule] of Object.entries(contactRules)) if (field !== 'email') maximum[field] = '中'.repeat(rule.max);
  const escaped = JSON.stringify(maximum).replace(/中/g, '\\u4e2d');
  assert.ok(Buffer.byteLength(escaped) < CONTACT_BODY_BYTES);
  assert.equal((await handler()(request(escaped))).status, 200);
});

test('repeated requests trigger limit and provide retry header', async () => {
  const post = handler();
  for (let i = 0; i < 5; i++) assert.equal((await post(request(good()))).status, 200);
  const result = await post(request(good()));
  assert.equal(result.status, 429);
  assert.ok(Number(result.headers.get('retry-after')) > 0);
});

test('limiter capacity stays bounded, rejected attempts do not extend window, expiry restores service', () => {
  const { createContactRateLimiter } = load('lib/contact-rate-limit.ts');
  const limiter = createContactRateLimiter(1000, 2, 2);
  assert.equal(limiter.check('a', 0), 0);
  assert.equal(limiter.check('a', 1), 0);
  for (let i = 2; i < 900; i++) assert.ok(limiter.check('a', i) > 0);
  assert.equal(limiter.check('b', 0), 0);
  assert.ok(limiter.check('c', 1) > 0);
  assert.equal(limiter.size, 2);
  assert.equal(limiter.check('c', 1000), 0);
  assert.equal(limiter.size, 1);
  assert.equal(limiter.check('a', 1001), 0);
});

test('provider accepted id, server-controlled recipient and reply-to, escaped HTML', async () => {
  let sent;
  const post = handler({ fetch: async (url, init) => { assert.equal(url, 'https://api.resend.com/emails'); sent = JSON.parse(init.body); return Response.json({ id: 'mock-id' }); } });
  assert.equal((await post(request({ ...good(), message: '<script>test</script>', to: 'attacker@example.invalid' }))).status, 200);
  assert.deepEqual(sent.to, [env.CONTACT_TO_EMAIL]);
  assert.equal(sent.reply_to, good().email);
  assert.ok(sent.html.includes('&lt;script&gt;'));
});

for (const [name, fetcher] of [
  ['rejection', async () => Response.json({ error: 'private detail' }, { status: 400 })],
  ['network failure', async () => { throw Error('private detail'); }],
  ['false success without id', async () => Response.json({})],
  ['malformed provider result', async () => new Response('bad JSON')],
]) test(`provider ${name} is generic 502`, async () => {
  const result = await handler({ fetch: fetcher })(request(good()));
  assert.equal(result.status, 502);
  assert.deepEqual(await result.json(), { ok: false, error: { code: 'provider_failure' } });
});

test('provider timeout is 504 and next request can succeed', async () => {
  let count = 0;
  const post = handler({ setTimeout: (fn, ms) => setTimeout(fn, ms === 12000 ? 5 : ms), fetch: async (_, { signal }) => ++count === 1 ? new Promise((_, reject) => signal.addEventListener('abort', () => reject(Error('timeout')))) : Response.json({ id: 'mock-id' }) });
  assert.equal((await post(request(good()))).status, 504);
  assert.equal((await post(request(good()))).status, 200);
});

test('missing config fails closed and honeypot never calls provider', async () => {
  let called = false;
  const post = handler({ process: { env: {} }, fetch: async () => { called = true; throw Error(); } });
  assert.equal((await post(request(good()))).status, 503);
  assert.equal((await post(request({ ...good(), website: 'spam' }))).status, 200);
  assert.equal(called, false);
});

test('body streaming cancels at the limit and malformed UTF-8 is rejected', async () => {
  const { readContactBody } = load('lib/contact-body.ts');
  let cancelled = false;
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(32769)); }, cancel() { cancelled = true; } });
  await assert.rejects(readContactBody(new Request('https://test.invalid', { method: 'POST', headers: { 'content-type': 'application/json' }, body: stream, duplex: 'half' })), error => error.status === 413);
  assert.equal(cancelled, true);
  await assert.rejects(readContactBody(new Request('https://test.invalid', { method: 'POST', headers: { 'content-type': 'application/json' }, body: new Uint8Array([0xff]) })), error => error.status === 400);
});

test('slow body read is a recoverable 408', async () => {
  const { readContactBody } = load('lib/contact-body.ts', { setTimeout: fn => setTimeout(fn, 5) });
  const stream = new ReadableStream({ start() {} });
  await assert.rejects(readContactBody(new Request('https://test.invalid', { method: 'POST', headers: { 'content-type': 'application/json' }, body: stream, duplex: 'half' })), error => error.status === 408);
});
