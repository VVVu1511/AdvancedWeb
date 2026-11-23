import { randomUUID } from 'node:crypto';

const problemBase = 'https://ai-travel-planner.example/problems/';

export function validatePlan(plan) {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) return { ok: false, reason: 'Plan must be an object.' };
  if (!Number.isInteger(plan.totalVnd) || plan.totalVnd < 0) return { ok: false, reason: 'totalVnd must be a non-negative integer.' };
  if (!Array.isArray(plan.stops) || plan.stops.length === 0) return { ok: false, reason: 'stops must contain at least one stop.' };
  if (plan.stops.some((stop) => !stop || typeof stop.placeId !== 'string' || !stop.placeId || typeof stop.itemId !== 'string' || !stop.itemId)) return { ok: false, reason: 'Each stop needs non-empty placeId and itemId.' };
  return { ok: true };
}

function problem(status, type, title, detail) {
  return { status, type: `${problemBase}${type}`, title, detail };
}

function response(status, body, headers = {}) {
  const contentType = body?.type?.startsWith(problemBase) ? 'application/problem+json' : 'application/json';
  return { status, headers: { 'content-type': contentType, ...headers }, body };
}

function readUserId(authorization) {
  return /^Bearer user:([A-Za-z0-9-]+)$/.exec(authorization ?? '')?.[1] ?? null;
}

export function createApp({ plans = [] } = {}) {
  const records = new Map(plans.map((plan) => [plan.id, { ...plan, saved: null, replays: new Map() }]));
  return { async handle({ method, path, headers = {}, body }) {
    const route = /^\/plans\/([^/]+)\/save$/.exec(path);
    if (method !== 'POST' || !route) return response(404, problem(404, 'not-found', 'Not found', 'No matching endpoint exists.'));
    const userId = readUserId(headers.authorization);
    if (!userId) return response(401, problem(401, 'authentication-required', 'Authentication required', 'Use a bearer token for a user.'));
    const plan = records.get(route[1]);
    if (!plan) return response(404, problem(404, 'plan-not-found', 'Plan not found', 'The requested plan does not exist.'));
    if (plan.ownerId !== userId) return response(403, problem(403, 'plan-not-owned', 'Plan is not owned by caller', 'Only the plan owner may save this plan.'));
    const idempotencyKey = headers['idempotency-key'];
    if (typeof idempotencyKey !== 'string' || !/^[A-Za-z0-9-]{8,128}$/.test(idempotencyKey)) return response(400, problem(400, 'invalid-idempotency-key', 'Invalid idempotency key', 'Idempotency-Key must be 8-128 letters, digits, or hyphens.'));
    const fingerprint = JSON.stringify(body);
    const prior = plan.replays.get(idempotencyKey);
    if (prior) {
      if (prior.fingerprint !== fingerprint) return response(409, problem(409, 'idempotency-key-reused', 'Idempotency key reused', 'Reuse a key only for the identical request body.'));
      return response(200, prior.result, { 'idempotency-replayed': 'true' });
    }
    const validation = validatePlan(body);
    if (!validation.ok) return response(422, problem(422, 'plan-validation-failed', 'Plan validation failed', validation.reason));
    if (body.totalVnd > plan.spendingCapVnd) return response(422, problem(422, 'plan-validation-failed', 'Plan validation failed', 'Plan total exceeds the applicable spending cap.'));
    const result = { planId: plan.id, savedAt: new Date().toISOString(), saveId: randomUUID(), status: 'saved' };
    plan.saved = result;
    plan.replays.set(idempotencyKey, { fingerprint, result });
    return response(201, result);
  } };
}
