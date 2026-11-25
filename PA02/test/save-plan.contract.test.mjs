import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from '../src/app.mjs';
import { createHttpServer } from '../src/http.mjs';

function app() { return createApp({ plans: [{ id: 'plan-1', ownerId: 'vu', spendingCapVnd: 600000 }] }); }
const validPlan = { totalVnd: 500000, stops: [{ placeId: 'place-1', itemId: 'item-1' }] };
async function request(service, overrides = {}) {
  const options = { path: '/plans/plan-1/save', headers: { authorization: 'Bearer user:vu', 'idempotency-key': 'request-1' }, body: validPlan, ...overrides };
  const server = createHttpServer(service);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const reply = await fetch(`http://127.0.0.1:${port}${options.path}`, { method: options.method ?? 'POST', headers: { 'content-type': 'application/json', ...options.headers }, body: overrides.rawBody ?? JSON.stringify(options.body) });
    return { status: reply.status, headers: Object.fromEntries(reply.headers), body: await reply.json() };
  } finally { await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
}

test('saves an owned, valid plan', async () => {
  const result = await request(app());
  assert.equal(result.status, 201);
  assert.equal(result.body.planId, 'plan-1');
  assert.equal(result.body.status, 'saved');
});
test('requires authentication', async () => {
  const result = await request(app(), { headers: { 'idempotency-key': 'request-1' } });
  assert.equal(result.status, 401);
  assert.match(result.headers['content-type'], /^application\/problem\+json/);
  assert.equal(result.body.type, 'https://ai-travel-planner.example/problems/authentication-required');
});
test('rejects another user before exposing or saving a plan', async () => {
  const result = await request(app(), { headers: { authorization: 'Bearer user:thai', 'idempotency-key': 'request-1' } });
  assert.equal(result.status, 403);
  assert.equal(result.body.type, 'https://ai-travel-planner.example/problems/plan-not-owned');
});
test('returns the documented 404 problem', async () => {
  const result = await request(app(), { path: '/plans/missing/save' });
  assert.equal(result.status, 404);
  assert.equal(result.body.type, 'https://ai-travel-planner.example/problems/plan-not-found');
});
test('requires a valid idempotency key', async () => {
  const result = await request(app(), { headers: { authorization: 'Bearer user:vu', 'idempotency-key': 'bad' } });
  assert.equal(result.status, 400);
  assert.equal(result.body.type, 'https://ai-travel-planner.example/problems/invalid-idempotency-key');
});
test('rejects invalid or over-cap plans without saving them', async () => {
  const service = app();
  const invalid = await request(service, { body: { totalVnd: 700000, stops: [] } });
  assert.equal(invalid.status, 422);
  assert.equal(invalid.body.type, 'https://ai-travel-planner.example/problems/plan-validation-failed');
  const overCap = await request(service, { body: { ...validPlan, totalVnd: 700000 } });
  assert.equal(overCap.status, 422);
});
test('replays an identical request exactly once', async () => {
  const service = app();
  const first = await request(service);
  const second = await request(service);
  assert.equal(first.status, 201);
  assert.equal(second.status, 200);
  assert.equal(second.headers['idempotency-replayed'], 'true');
  assert.deepEqual(second.body, first.body);
});
test('rejects reuse of an idempotency key for a changed body', async () => {
  const service = app();
  await request(service);
  const result = await request(service, { body: { ...validPlan, totalVnd: 400000 } });
  assert.equal(result.status, 409);
  assert.equal(result.body.type, 'https://ai-travel-planner.example/problems/idempotency-key-reused');
});

function assertProblem(result, status, type) {
  assert.equal(result.status, status);
  assert.match(result.headers['content-type'], /^application\/problem\+json/);
  assert.equal(result.body.status, status);
  assert.equal(result.body.type, `https://ai-travel-planner.example/problems/${type}`);
  assert.equal(typeof result.body.title, 'string');
  assert.ok(result.body.title.length > 0);
  assert.equal(typeof result.body.detail, 'string');
  assert.ok(result.body.detail.length > 0);
  assert.equal(result.body.saveId, undefined);
  assert.equal(result.body.savedAt, undefined);
}

test('every documented error has complete problem details', async () => {
  const service = app();
  assertProblem(await request(service, { headers: {} }), 401, 'authentication-required');
  assertProblem(await request(service, { headers: { authorization: 'Bearer user:thai' } }), 403, 'plan-not-owned');
  assertProblem(await request(service, { path: '/plans/missing/save' }), 404, 'plan-not-found');
  assertProblem(await request(service, { path: '/missing' }), 404, 'plan-not-found');
  assertProblem(await request(service, { method: 'PUT' }), 404, 'plan-not-found');
  assertProblem(await request(service, { headers: { authorization: 'Bearer user:vu' } }), 400, 'invalid-idempotency-key');
  assertProblem(await request(service, { body: null }), 422, 'plan-validation-failed');
  await request(service);
  assertProblem(await request(service, { body: { ...validPlan, totalVnd: 1 } }), 409, 'idempotency-key-reused');
});

test('malformed authentication fails before plan lookup or replay', async () => {
  const service = app();
  await request(service);
  for (const authorization of ['', 'Bearer user:', 'Basic user:vu', 'Bearer user:vu!']) {
    for (const path of ['/plans/plan-1/save', '/plans/missing/save']) {
      assertProblem(await request(service, { path, headers: { authorization, 'idempotency-key': 'request-1' } }), 401, 'authentication-required');
    }
  }
});

test('another user cannot replay a saved response or consume the owner key', async () => {
  const service = app();
  const other = { headers: { authorization: 'Bearer user:thai', 'idempotency-key': 'request-1' } };
  assertProblem(await request(service, other), 403, 'plan-not-owned');
  const first = await request(service);
  assert.equal(first.status, 201);
  assertProblem(await request(service, other), 403, 'plan-not-owned');
  assert.deepEqual((await request(service)).body, first.body);
});

test('idempotency keys enforce length and ASCII boundaries', async () => {
  for (const key of ['', 'a'.repeat(7), 'a'.repeat(129), 'request_1', 'request.1', 'réquest-1']) {
    assertProblem(await request(app(), { headers: { authorization: 'Bearer user:vu', 'idempotency-key': key } }), 400, 'invalid-idempotency-key');
  }
  for (const key of ['a'.repeat(8), 'a'.repeat(128)]) {
    assert.equal((await request(app(), { headers: { authorization: 'Bearer user:vu', 'idempotency-key': key } })).status, 201);
  }
});

test('invalid fields and malformed JSON never reserve a retry key', async () => {
  const invalid = [null, [], {}, { ...validPlan, totalVnd: -1 }, { ...validPlan, totalVnd: 0.5 }, { ...validPlan, totalVnd: '500000' }, { ...validPlan, stops: [] }, { ...validPlan, stops: null }, { ...validPlan, stops: [null] }, { ...validPlan, stops: [{ placeId: '', itemId: 'item-1' }] }, { ...validPlan, stops: [{ placeId: 'place-1', itemId: 1 }] }, { ...validPlan, totalVnd: 600001 }];
  for (const body of invalid) {
    const service = app();
    assertProblem(await request(service, { body }), 422, 'plan-validation-failed');
    assert.equal((await request(service)).status, 201);
  }
  const service = app();
  assertProblem(await request(service, { rawBody: '{' }), 422, 'plan-validation-failed');
  assert.equal((await request(service)).status, 201);
});

test('zero and exact-cap totals return typed save metadata', async () => {
  for (const totalVnd of [0, 600000]) {
    const result = await request(app(), { body: { ...validPlan, totalVnd } });
    assert.equal(result.status, 201);
    assert.match(result.headers['content-type'], /^application\/json/);
    assert.match(result.body.saveId, /^[0-9a-f]{8}-[0-9a-f-]{27}$/);
    assert.equal(new Date(result.body.savedAt).toISOString(), result.body.savedAt);
    assert.equal(result.headers['idempotency-replayed'], undefined);
  }
});

test('keys are scoped to plans and concurrent retries share one save', async () => {
  const service = createApp({ plans: ['plan-1', 'plan-2'].map((id) => ({ id, ownerId: 'vu', spendingCapVnd: 600000 })) });
  const results = await Promise.all([request(service), request(service), request(service)]);
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 200, 201]);
  for (const result of results) assert.deepEqual(result.body, results[0].body);
  const second = await request(service, { path: '/plans/plan-2/save' });
  assert.equal(second.status, 201);
  assert.notEqual(second.body.saveId, results[0].body.saveId);
  assert.equal(second.body.planId, 'plan-2');
});

test('a conflict preserves the original replay and a new key makes a new save', async () => {
  const service = app();
  const first = await request(service);
  assertProblem(await request(service, { body: { ...validPlan, totalVnd: 1 } }), 409, 'idempotency-key-reused');
  assert.deepEqual((await request(service)).body, first.body);
  const next = await request(service, { headers: { authorization: 'Bearer user:vu', 'idempotency-key': 'request-2' } });
  assert.equal(next.status, 201);
  assert.notEqual(next.body.saveId, first.body.saveId);
});
