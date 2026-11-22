import assert from 'node:assert/strict';
import { syncBarrierValue } from '../src/shared/helpers/Character/syncBarrierValue.ts';

function state(current, normal = 50) {
  return { barrier: { value: current }, totals: { barrier: normal } };
}

globalThis.game = { combat: { started: true } };
for (const current of [0, 10, 50, 75, 100, 150]) {
  const character = state(current);
  syncBarrierValue(character, true);
  assert.equal(character.barrier.value, current, 'character reserve must survive recalculation');
}
const negative = state(-5);
syncBarrierValue(negative, true);
assert.equal(negative.barrier.value, 0);
const npc = state(150);
syncBarrierValue(npc);
assert.equal(npc.barrier.value, 50, 'NPC cap must remain unchanged');
globalThis.game.combat.started = false;
const depleted = state(10);
syncBarrierValue(depleted, true);
assert.equal(depleted.barrier.value, 50, 'normal out-of-combat regeneration');
const overcharged = state(150);
syncBarrierValue(overcharged, true);
assert.equal(overcharged.barrier.value, 150, 'overcharge must not disappear outside combat');
const noNormalBarrier = state(15, 0);
syncBarrierValue(noNormalBarrier, true);
assert.equal(noNormalBarrier.barrier.value, 15);
console.log('Character barrier checks passed (depleted, normal, ×1.5/×2/×3, NPC, regeneration).');
