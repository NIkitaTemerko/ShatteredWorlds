import type { ShwActor } from '../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';
import { ADDITIONAL_KEYS, ATTR_MAX_RIM, ATTR_RIM, HELPER_KEYS, STAT_KEYS } from '../constants';
import { applyBonus, calculateItemBonuses } from './calculateItemBonuses';

function calculateAdditionalAttributes(
  attrs: ShwActorSystem['helpers'],
  isLevelAboveFive: boolean,
): Pick<
  ShwActorSystem['additionalAttributes'],
  | 'damageReduction'
  | 'additionalRangeDamage'
  | 'armorClass'
  | 'additionalCloseCombatDamage'
  | 'impulse'
  | 'range'
> {
  return {
    damageReduction: isLevelAboveFive ? attrs.totalPsyDefence : 0,
    additionalRangeDamage: isLevelAboveFive ? attrs.totalPerception : 0,
    armorClass: isLevelAboveFive ? attrs.totalDiplomacy : 0,
    additionalCloseCombatDamage: isLevelAboveFive ? attrs.totalForce : 0,
    impulse: attrs?.totalForce >= ATTR_RIM ? 1 : 0,
    range: attrs?.totalPerception >= ATTR_MAX_RIM ? 2 : 0,
  };
}

function resetAttributeBonuses(
  attributes: ShwActorSystem['attributes'],
): void {
  for (const k of STAT_KEYS) {
    const a = attributes[k];
    a.extra = 0;
    a.charBonus = 0;
    a.saveBonus = 0;
  }
}

function updateAttributeBonuses(
  helpers: ShwActorSystem['helpers'],
  attributes: ShwActorSystem['attributes'],
): void {
  for (const k of STAT_KEYS) {
    const helperKey = HELPER_KEYS.find((key) => key.toLocaleLowerCase().includes(k.toLocaleLowerCase())) as keyof ShwActorSystem['helpers'];
    const a = attributes[k];

    const bonus = Math.floor(helpers[helperKey] / 5);

    a.charBonus = a.charBonus ? a.charBonus + bonus : bonus;
    a.saveBonus = a.saveBonus ? a.saveBonus + bonus : bonus;
  }
}

function updateHelpers(
  sys: ShwActorSystem,
  addAttrMap: ReturnType<typeof calculateAdditionalAttributes>,
): void {
  sys.helpers.totalImpulse += addAttrMap.impulse + sys.additionalAttributes.impulse;
  sys.helpers.totalHealth += sys.health.max;
  sys.helpers.totalSpeed += sys.utility.speed;
}

export function prepareCharacterDerivedData(sys: ShwActorSystem, actor: ShwActor<'character'>) {
  const attrs = sys.attributes;
  const isLevelAboveFive = sys.utility.level >= 5;
  resetAttributeBonuses(attrs);

  // Копируем базовые значения в total поля (только для 5 атрибутов и 4 editable stats)
  sys.helpers.totalFortune = attrs.fortune.value;
  sys.helpers.totalForce = attrs.force.value;
  sys.helpers.totalPerception = attrs.perception.value;
  sys.helpers.totalPsyDefence = attrs.psyDefence.value;
  sys.helpers.totalDiplomacy = attrs.diplomacy.value;
  
  sys.helpers.totalActions = sys.additionalAttributes.actions;
  sys.helpers.totalBonusActions = sys.additionalAttributes.bonusActions;
  sys.helpers.totalReactions = sys.additionalAttributes.reactions;
  sys.helpers.totalInitiative = sys.additionalAttributes.initiative;

  // Применяем бонусы от предметов
  const { bonuses } = calculateItemBonuses(actor);
  for (const [path, bonus] of bonuses.entries()) {
    applyBonus(sys, path, bonus);
  }

  // Теперь используем totalX для расчёта математики
  const addAttrMap = calculateAdditionalAttributes(sys.helpers, isLevelAboveFive);

  updateHelpers(sys, addAttrMap);

  for (const k of ADDITIONAL_KEYS) {
    if (k in addAttrMap && k in sys.additionalAttributes && k !== 'impulse') {
      sys.additionalAttributes[k] += (addAttrMap as any)[k];
    }
  }

  updateAttributeBonuses(sys.helpers, attrs);
}
