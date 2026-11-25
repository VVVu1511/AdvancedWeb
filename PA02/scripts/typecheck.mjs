import { createApp, validatePlan } from '../src/app.mjs';

if (typeof createApp !== 'function' || typeof validatePlan !== 'function') {
  throw new Error('Public service exports do not match the documented application boundary.');
}
const valid = validatePlan({ totalVnd: 500000, stops: [{ placeId: 'place-1', itemId: 'item-1' }] });
if (valid.ok !== true) throw new Error('Validator result does not match its documented shape.');
console.log('API boundary check passed. JavaScript has no separate compiler type-check step.');
