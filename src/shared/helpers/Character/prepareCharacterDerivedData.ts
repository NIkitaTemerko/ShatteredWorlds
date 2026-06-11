import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { HELPER_KEYS, STAT_KEYS } from '../../model/constants/actorKeys';
import { applyBonus, calculateItemBonuses } from './calculateItemBonuses';

function resetAttributeBonuses(attributes: ShwActorSystem['attributes']): void {
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
    const helperKey = HELPER_KEYS.find((key) =>
      key.toLocaleLowerCase().includes(k.toLocaleLowerCase()),
    ) as keyof ShwActorSystem['helpers'];
    const a = attributes[k];

    const bonus = Math.floor(helpers[helperKey] / 5);

    a.charBonus = a.charBonus ? a.charBonus + bonus : bonus;
    a.saveBonus = a.saveBonus ? a.saveBonus + bonus : bonus;
  }
}

function updateHelpers(sys: ShwActorSystem): void {
  sys.helpers.totalImpulse += sys.additionalAttributes.impulse;
  sys.helpers.totalHealth += sys.health.max;
  sys.helpers.totalSpeed += sys.utility.speed;
}

export function prepareCharacterDerivedData(sys: ShwActorSystem, actor: ShwActor<'character'>) {
  const attrs = sys.attributes;
  resetAttributeBonuses(attrs);

  sys.helpers.totalFortune = attrs.fortune.value;
  sys.helpers.totalForce = attrs.force.value;
  sys.helpers.totalFinesse = attrs.finesse.value;
  sys.helpers.totalWill = attrs.will.value;
  sys.helpers.totalPresence = attrs.presence.value;

  sys.helpers.totalActions = sys.additionalAttributes.actions;
  sys.helpers.totalBonusActions = sys.additionalAttributes.bonusActions;
  sys.helpers.totalReactions = sys.additionalAttributes.reactions;
  sys.helpers.totalInitiative = sys.additionalAttributes.initiative;

  const { bonuses } = calculateItemBonuses(actor);
  for (const [path, bonus] of bonuses.entries()) {
    applyBonus(sys, path, bonus);
  }

  updateHelpers(sys);
  updateAttributeBonuses(sys.helpers, attrs);
}
