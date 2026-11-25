# Save a travel plan

## `POST /plans/{planId}/save`

This endpoint saves a final itinerary only after deterministic backend validation. It is the point at which a schedule becomes shareable with the group, so retries are safe but cannot bypass ownership or validation.

### Authorization and ownership

The caller sends `Authorization: Bearer user:{userId}`. This simplified PA#2 token represents the identity-provider token used in production. Only the plan's `ownerId` may save it. Another authenticated user receives `403` and no plan data; no token receives `401`.

### Request

`planId` is an opaque path identifier. `Idempotency-Key` is required and must be 8--128 ASCII letters, digits, or hyphens. Reuse it only for the identical JSON body for this plan and owner.

```json
{ "totalVnd": 500000, "stops": [{ "placeId": "place-1", "itemId": "item-1" }] }
```

`totalVnd` is a non-negative integer VND amount. `stops` is non-empty and every stop has non-empty string `placeId` and `itemId`. The backend rejects totals over the applicable spending cap. Later validators also enforce checked places/items, opening hours, travel gaps, and weather before saving.

### Success and idempotency

The first accepted request returns `201 Created` with `{ "planId", "savedAt", "saveId", "status": "saved" }`. An identical retry returns `200 OK`, the original body, and `Idempotency-Replayed: true`; it never creates a second save. A changed body with the same key returns `409`.

### Errors

Every error is `application/problem+json` RFC 9457 problem details with `type`, `title`, `status`, and `detail`.

| Status | Problem type suffix | When |
|---:|---|---|
| 400 | `invalid-idempotency-key` | Header is absent or invalid. |
| 401 | `authentication-required` | Bearer token is absent or malformed. |
| 403 | `plan-not-owned` | The plan belongs to another user. |
| 404 | `plan-not-found` | No plan has the requested ID, or the route does not exist. |
| 409 | `idempotency-key-reused` | A key is reused with a different body. |
| 422 | `plan-validation-failed` | Request fields are invalid or its total exceeds the cap. |

### Change policy

New optional response fields may be added. Existing field meanings, statuses, problem types, ownership rule, and idempotency behaviour are versioned commitments. A breaking change requires a new endpoint version and a migration note.
