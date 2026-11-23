import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from '../src/app.mjs';
import { createHttpServer } from '../src/http.mjs';

function app() { return createApp({ plans: [{ id: 'plan-1', ownerId: 'vu', spendingCapVnd: 600000 }] }); }
const validPlan = { totalVnd: 500000, stops: [{ placeId: 'place-1', itemId: 'item-1' }] };
async function request(service, overrides = {}) {
  const options = { path: '/plans/plan-1/save', headers: { authorization: 'Bearer user:vu', 'idempotency-key': 'request-1', ...overrides.headers }, body: validPlan, ...overrides };
  const server = createHttpServer(service);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const reply = await fetch(`http://127.0.0.1:${port}${options.path}`, { method: options.method ?? 'POST', headers: { 'content-type': 'application/json', ...options.headers }, body: JSON.stringify(options.body) });
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
