import { getDamageTypeDefinition, damageTypeHitsArmor } from '../../model/damage/damageTypeConfig';
import type {
  ActorCombatDefenses,
  CombatDamageType,
  DefenseStepBreakdown,
} from '../../model/damage/types';

export interface DefenseResolution {
  hpDamage: number;
  steps: DefenseStepBreakdown[];
}

export function resolveDefenseDetailed(
  damage: number,
  type: CombatDamageType,
  defenses: ActorCombatDefenses,
  penetration = 0,
): DefenseResolution {
  if (damage <= 0) return { hpDamage: 0, steps: [] };

  const def = getDamageTypeDefinition(type);
  let remaining = damage;
  const steps: DefenseStepBreakdown[] = [];
  const armorPenetration = damageTypeHitsArmor(def) ? penetration : 0;

  for (const layer of def.defenseLayers) {
    const before = remaining;

    if (layer === 'armorClass' && !def.ignoresArmor) {
      const effectiveArmor = Math.max(0, defenses.armorClass - armorPenetration);
      remaining = Math.max(0, remaining - effectiveArmor);
      steps.push({
        layer,
        stat: defenses.armorClass,
        effectiveStat: effectiveArmor,
        penetration: armorPenetration,
        blocked: before - remaining,
      });
    } else if (layer === 'psiDefense' && !def.ignoresPsiDefense) {
      remaining = Math.max(0, remaining - defenses.psiDefense);
      steps.push({
        layer,
        stat: defenses.psiDefense,
        blocked: before - remaining,
      });
    } else if (layer === 'damageReduction') {
      remaining = Math.max(0, remaining - defenses.damageReduction);
      steps.push({
        layer,
        stat: defenses.damageReduction,
        blocked: before - remaining,
      });
    }
  }

  return { hpDamage: remaining, steps };
}

export function resolveDefense(
  damage: number,
  type: CombatDamageType,
  defenses: ActorCombatDefenses,
  penetration = 0,
): number {
  return resolveDefenseDetailed(damage, type, defenses, penetration).hpDamage;
}
