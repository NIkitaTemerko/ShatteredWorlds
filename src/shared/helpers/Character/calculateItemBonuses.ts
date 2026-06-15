import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import type { StatModifierBlock } from '../../../documents/Item/types/AbilityDataTypes';
import type { CharacterStatPath } from '../../model/characterStatPaths';
import { migrateLegacyStatPath } from '../migrateLegacyStatKeys';
import type { ItemBonusResult, ModifierMode, ParsedPath, PathPart } from '../../model/types/characterBonuses';

const applyModifier = (current: number, value: number, mode: ModifierMode): number => {
  switch (mode) {
    case 'add':
    case 'mul':
      return current + value;
    case 'override':
      return Math.max(current, value);
  }
};

const hasStatBonuses = (system: unknown): system is { statBonuses: StatModifierBlock } => {
  if (typeof system !== 'object' || system === null) return false;

  const statBonuses = (system as { statBonuses?: StatModifierBlock | null }).statBonuses;
  return (
    statBonuses?.modifiers !== undefined &&
    Array.isArray(statBonuses.modifiers) &&
    statBonuses.modifiers.length > 0
  );
};

export function calculateItemBonuses(actor: ShwActor<'character'>): ItemBonusResult {
  const bonuses = new Map<CharacterStatPath, number>();

  for (const item of actor.items) {
    const itemSystem = item.system;
    if (!hasStatBonuses(itemSystem)) continue;

    for (const modifier of itemSystem.statBonuses.modifiers) {
      const stat = migrateLegacyStatPath(modifier.stat) as CharacterStatPath;
      const currentBonus = bonuses.get(stat) ?? 0;
      const newBonus = applyModifier(currentBonus, modifier.value, modifier.mode);

      bonuses.set(stat, newBonus);
    }
  }

  return { bonuses };
}

export function getItemBonus(bonuses: Map<CharacterStatPath, number>, path: string): number {
  return bonuses.get(path as CharacterStatPath) ?? 0;
}

export function sumItemBonuses(
  bonuses: Map<CharacterStatPath, number>,
  paths: readonly string[],
): number {
  let sum = 0;
  for (const path of paths) {
    sum += getItemBonus(bonuses, path);
  }
  return sum;
}

const parsePath = (path: CharacterStatPath): ParsedPath => {
  const parts = path.split('.') as PathPart[];

  const isAttributeValue = parts[0] === 'attributes' && parts.length === 3 && parts[2] === 'value';
  const isAttributeExtra = parts[0] === 'attributes' && parts.length === 3 && parts[2] === 'extra';

  return {
    parts,
    isAttributeValue,
    isEditableStat: false,
    attributeKey: isAttributeValue || isAttributeExtra ? parts[1] : undefined,
  };
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

/** Применяет бонусы к persisted-полям (manual / extra). Totals и attribute value — в derived. */
export function applyManualItemBonuses(
  system: ShwActorSystem,
  bonuses: Map<CharacterStatPath, number>,
): void {
  for (const [path, bonus] of bonuses.entries()) {
    if (path.startsWith('totals.')) continue;
    if (path.startsWith('attributes.') && path.endsWith('.value')) continue;

    const parsed = parsePath(path);
    if (path.startsWith('additionalAttributes.') || path.match(/^attributes\.\w+\.extra$/)) {
      applyToOriginalField(system, parsed.parts, bonus);
    } else if (!parsed.isAttributeValue) {
      applyToOriginalField(system, parsed.parts, bonus);
    }
  }
}

/** @deprecated Use applyManualItemBonuses + derived totals assignment */
export function applyBonus(system: ShwActorSystem, path: CharacterStatPath, bonus: number): void {
  applyManualItemBonuses(system, new Map([[path, bonus]]));
}
