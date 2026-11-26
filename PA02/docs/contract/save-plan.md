# Save a travel plan

## `POST /plans/{planId}/save`

This endpoint saves a final itinerary only after deterministic backend validation. It is the point at which a schedule becomes shareable with the group, so retries are safe but cannot bypass ownership or validation.

### Authorization and ownership

The caller sends `Authorization: Bearer user:{userId}`, where `userId` contains one or more ASCII letters, digits or hyphens. This simplified PA#2 token represents the identity-provider token used in production. Only the plan's `ownerId` may save it. Another authenticated user receives `403` and no plan data; no token receives `401`.

### Request

`planId` is an opaque, case-sensitive single path segment. Send JSON with `Content-Type: application/json`. `Idempotency-Key` is required and must be 8--128 ASCII letters, digits, or hyphens. Reuse it only for the identical JSON body for this plan and owner.

```json
{ "totalVnd": 500000, "stops": [{ "placeId": "place-1", "itemId": "item-1" }] }
```

`totalVnd` is a non-negative JSON integer VND amount, not a string. `stops` is non-empty and every stop has non-empty string `placeId` and `itemId`. The backend rejects totals over the applicable spending cap. PA#2 checks the submitted total against the seeded cap; it does not recalculate costs. Later validators must also enforce checked places/items, opening hours, travel gaps, and weather before saving.

### Success and idempotency

The first accepted request returns `201 Created` with `{ "planId", "savedAt", "saveId", "status": "saved" }`. An identical retry returns `200 OK`, the original body, and `Idempotency-Replayed: true`; it never creates a second save. A changed body with the same key returns `409`.

The success response is JSON. `planId` is the requested string identifier, `savedAt` is a UTC ISO 8601 timestamp, `saveId` is a UUID string, and `status` is the literal `saved`. New keys create new saves, even for the same body. Keys are scoped to a plan and its owner. Failed requests do not reserve keys. Concurrent identical requests within one service instance produce one save.

Replay records last for the lifetime of the in-memory service instance. Restarting loses plans and replay records. JSON whitespace is ignored during parsing, but object field order is significant for the current fingerprint. Clients must preserve field order when retrying. Unknown fields are accepted and included in that fingerprint. Authentication and ownership are checked before replay, so another user cannot retrieve a saved result with its key.

This PA#2 service uses seeded test plans and mock bearer identities. It has no production authentication, persistence or plan-creation endpoint; the default server starts with no plans. Paging does not apply to this save operation.

### Errors

Every error is `application/problem+json` RFC 9457 problem details with string `type`, non-empty string `title`, integer `status` matching the HTTP status, and non-empty string `detail`. Each full `type` is `https://ai-travel-planner.example/problems/` followed by the suffix below. Error bodies contain no saved-plan data. Clients should branch on `type`, not human-readable wording.

| Status | Problem type suffix | When |
|---:|---|---|
| 400 | `invalid-idempotency-key` | Header is absent or invalid. |
| 401 | `authentication-required` | Bearer token is absent or malformed. |
| 403 | `plan-not-owned` | The plan belongs to another user. |
| 404 | `plan-not-found` | No plan has the requested ID, or the method/path does not match the endpoint. |
| 409 | `idempotency-key-reused` | A key is reused with a different body. |
| 422 | `plan-validation-failed` | The body is missing, malformed JSON, invalid by the field rules, or over the cap. |

For a matching route, precedence is authentication, plan existence, ownership, key syntax, replay/conflict, then validation. Unmatched methods or paths return 404 before authentication.

### Change policy

New optional response fields may be added. Existing field meanings, statuses, problem types, ownership rule, and idempotency behaviour are versioned commitments. A breaking change requires a new endpoint version and a migration note.
