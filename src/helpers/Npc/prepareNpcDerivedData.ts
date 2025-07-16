import type { ShwNpcSystem } from '../../documents/Actor/types/ShwActorSystem';

const STAT_KEYS = ['fortune', 'force', 'perception', 'psyDefence', 'diplomacy'] as const;
const ADDITIONAL_KEYS = ['damageReduction', 'range', 'discount', 'damage', 'aoeResist'] as const;

export function prepareNpcDerivedData(sys: ShwNpcSystem) {
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

   sys.helpers.totalImpulse += addAttrMap.impulse + add.impulse;
   sys.helpers.totalHealth += addAttrMap.health + sys.health.max;
   sys.helpers.totalSpeed += addAttrMap.speed + sys.utility.speed;
   sys.helpers.totalAoeResist += addAttrMap.aoeResist + add.aoeResist;
   sys.helpers.totalDamage += addAttrMap.damage + add.damage;
   sys.helpers.totalDamageReduction +=
      addAttrMap.damageReduction +
      add.damageReduction +
      Math.floor(sys.attributes.psyDefence.extra / 3);
   sys.helpers.totalRange += addAttrMap.range + add.range;
   sys.helpers.totalDiscount +=
      addAttrMap.discount + add.discount + Math.floor((sys.attributes.diplomacy.extra ?? 0) / 4);

   for (const k of ADDITIONAL_KEYS) {
      if (k === 'damageReduction') {
         continue;
      }
      sys.additionalAttributes[k] += addAttrMap[k];
   }

   for (const k of STAT_KEYS) {
      const a = attrs[k];
      a.charBonus =
         (a.charBonusBase ?? 0) +
         (Math.floor(a.value / 5) + (k in bonusMap ? bonusMap[k as keyof typeof bonusMap] : 0));
      a.saveBonus = (a.saveBonusBase ?? 0) + (Math.floor(a.value / 5) + saveMap[k]);
   }
}
