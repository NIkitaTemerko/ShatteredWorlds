import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import type { PassiveAbilitySystem } from '../../../documents/Item/types/AbilityDataTypes';
import type { CharacterStatPath } from '../../model/characterStatPaths';
import { EDITABLE_STATS } from '../../model/constants/characterDefaults';
import type { ItemBonusResult, ModifierMode, ParsedPath, PathPart } from '../../model/types/characterBonuses';

const applyModifier = (current: number, value: number, mode: ModifierMode): number => {
  switch (mode) {
    case 'add':
    case 'mul': // TODO: реализовать мультипликативную логику отдельно
      return current + value;
    case 'override':
      return Math.max(current, value);
  }
};

const hasStatBonuses = (system: PassiveAbilitySystem): boolean => {
  if (typeof system !== 'object' || system === null) return false;

  return (
    system.statBonuses?.modifiers !== undefined &&
    Array.isArray(system.statBonuses.modifiers) &&
    system.statBonuses.modifiers.length > 0
  );
};

/**
 * Вычисляет все бонусы от предметов актёра (способности, снаряжение, расходники и т.д.)
 */
export function calculateItemBonuses(actor: ShwActor<'character'>): ItemBonusResult {
  const bonuses = new Map<CharacterStatPath, number>();

  for (const item of actor.items) {
    const itemSystem = item.system as PassiveAbilitySystem;

    if (!hasStatBonuses(itemSystem)) continue;

    for (const modifier of itemSystem?.statBonuses?.modifiers ?? []) {
      const stat = modifier.stat as CharacterStatPath;
      const currentBonus = bonuses.get(stat) ?? 0;
      const newBonus = applyModifier(currentBonus, modifier.value, modifier.mode);

      bonuses.set(stat, newBonus);
    }
  }

  return { bonuses };
}

const toTotalFieldName = (key: string): keyof ShwActorSystem['helpers'] =>
  `total${key.capitalize()}` as keyof ShwActorSystem['helpers'];

const hasTotalField = (
  system: ShwActorSystem,
  totalKey: keyof ShwActorSystem['helpers'],
): boolean => totalKey in system.helpers && typeof system.helpers[totalKey] === 'number';

const parsePath = (path: CharacterStatPath): ParsedPath => {
  const parts = path.split('.') as PathPart[];

  const isAttributeValue = parts[0] === 'attributes' && parts.length === 3 && parts[2] === 'value';

  const isEditableStat =
    parts[0] === 'additionalAttributes' &&
    parts.length === 2 &&
    EDITABLE_STATS.has(parts[1] as typeof EDITABLE_STATS extends Set<infer T> ? T : never);

  return {
    parts,
    isAttributeValue,
    isEditableStat,
    attributeKey: isAttributeValue || isEditableStat ? parts[1] : undefined,
  };
};

const tryApplyToTotalField = (
  system: ShwActorSystem,
  parsed: ParsedPath,
  bonus: number,
): boolean => {
  if (!parsed.attributeKey) return false;
  if (!parsed.isAttributeValue && !parsed.isEditableStat) return false;

  const totalKey = toTotalFieldName(parsed.attributeKey);

  if (!hasTotalField(system, totalKey)) return false;

  system.helpers[totalKey] += bonus;
  return true;
};

const applyToOriginalField = (system: ShwActorSystem, parts: PathPart[], bonus: number): void => {
  let current = system as unknown as Record<PathPart, unknown>;

  for (let i = 0; i < parts.length - 1; i++) {
    const next = current[parts[i]];
    if (typeof next !== 'object' || next === null) return;
    current = next as Record<PathPart, unknown>;
  }

  const lastKey = parts[parts.length - 1];
  const value = current[lastKey];
  if (typeof value === 'number') {
    current[lastKey] = value + bonus;
  }
};

/**
 * Применяет бонус к характеристике персонажа
 *
 * Для attributes.*.value и editable stats применяется к total-полю в helpers.
 * Для остальных путей — прибавляется к оригинальному полю.
 */
export function applyBonus(system: ShwActorSystem, path: CharacterStatPath, bonus: number): void {
  const parsed = parsePath(path);

  const appliedToTotal = tryApplyToTotalField(system, parsed, bonus);
  if (appliedToTotal) return;

  applyToOriginalField(system, parsed.parts, bonus);
}
