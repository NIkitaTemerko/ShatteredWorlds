import type { ShwActorSystem } from '../documents/ShwActor';

const STAT_KEYS = ['fortune', 'force', 'perception', 'psyDefence', 'diplomacy'] as const;
const ADDITIONAL_KEYS = ['damageReduction', 'range', 'discount', 'damage', 'aoeResist'] as const;

export function prepareCharacterDerivedData(sys: ShwActorSystem) {
   const attrs = sys.attributes;
   const add = sys.additionalAttributes;

   const addAttrMap = {
      health: attrs?.psyDefence.value >= 15 ? 15 : 0,
      damageReduction: attrs?.psyDefence.value >= 25 ? 5 : 0,
      speed: attrs?.perception.value >= 15 ? 5 : 0,
      range: attrs?.perception.value >= 25 ? 2 : 0,
      discount: attrs?.diplomacy.value >= 15 ? 5 : 0,
      damage: attrs?.force.value >= 25 ? 15 : attrs?.force.value >= 15 ? 5 : 0,
      aoeResist: attrs?.fortune.value >= 15 ? 15 : 0,
      impulse: attrs?.force.value >= 25 ? 3 : attrs?.force.value >= 15 ? 1 : 0,
   };

   const bonusMap = {
      diplomacy: attrs?.diplomacy.value >= 25 ? 1 : 0,
   } as const;

   const saveMap = {
      fortune: (attrs?.fortune.value >= 25 ? 1 : 0) + (attrs?.force.value >= 25 ? 1 : 0),
      force: attrs?.force.value >= 25 ? 1 : 0,
      perception: attrs?.force.value >= 25 ? 1 : 0,
      psyDefence: attrs?.force.value >= 25 ? 1 : 0,
      diplomacy: attrs?.force.value >= 25 ? 1 : 0,
   };

   sys.helpers.totalImpulse += addAttrMap.impulse += add.impulse;
   sys.helpers.totalHealth += addAttrMap.health += sys.health.max;
   sys.helpers.totalSpeed += addAttrMap.speed += sys.utility.speed;

   for (const k of ADDITIONAL_KEYS) {
      sys.additionalAttributes[k] += addAttrMap[k];
   }

   for (const k of STAT_KEYS) {
      const a = attrs[k];
      a.charBonus =
         Math.floor(a.value / 5) + (k in bonusMap ? bonusMap[k as keyof typeof bonusMap] : 0);
      a.saveBonus = Math.floor(a.value / 5) + saveMap[k];
   }
}
