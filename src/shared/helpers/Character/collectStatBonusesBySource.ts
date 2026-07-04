import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { AbilitySystem } from '../../../documents/Item/types/AbilityDataTypes';
import type { StatModifierBlock } from '../../../documents/Item/types/AbilityDataTypes';
import type { CharacterStatPath } from '../../model/characterStatPaths';
import type { ModifierMode } from '../../model/types/characterBonuses';
import { migrateLegacyStatPath } from '../migrateLegacyStatKeys';
import { getCharacterAbilityPool } from './getCharacterAbilityPool';
import { getEquippedItems } from './getEquippedItems';

export interface ItemSourcedBonuses {
  equipment: Map<CharacterStatPath, number>;
  abilities: Map<CharacterStatPath, number>;
}

export function applyModifier(current: number, value: number, mode: ModifierMode): number {
  switch (mode) {
    case 'add':
    case 'mul':
      return current + value;
    case 'override':
      return Math.max(current, value);
  }
}

const hasStatBonuses = (system: unknown): system is { statBonuses: StatModifierBlock } => {
  if (typeof system !== 'object' || system === null) return false;

  const statBonuses = (system as { statBonuses?: StatModifierBlock | null }).statBonuses;
  return (
    statBonuses?.modifiers !== undefined &&
    Array.isArray(statBonuses.modifiers) &&
    statBonuses.modifiers.length > 0
  );
};

function accumulateModifiers(
  target: Map<CharacterStatPath, number>,
  itemSystem: unknown,
): void {
  if (!hasStatBonuses(itemSystem)) return;

  for (const modifier of itemSystem.statBonuses.modifiers) {
    const stat = migrateLegacyStatPath(modifier.stat) as CharacterStatPath;
    const currentBonus = target.get(stat) ?? 0;
    target.set(stat, applyModifier(currentBonus, modifier.value, modifier.mode));
  }
}

function collectEquipmentBonuses(actor: ShwActor<'character'>): Map<CharacterStatPath, number> {
  const bonuses = new Map<CharacterStatPath, number>();

  for (const item of getEquippedItems(actor)) {
    accumulateModifiers(bonuses, item.system);
  }

  return bonuses;
}

function collectAbilityBonuses(actor: ShwActor<'character'>): Map<CharacterStatPath, number> {
  const bonuses = new Map<CharacterStatPath, number>();

  for (const item of getCharacterAbilityPool(actor)) {
    const system = item.system as AbilitySystem;
    if (system.category !== 'passive') continue;

    accumulateModifiers(bonuses, system);
  }

  return bonuses;
}

export function collectStatBonusesBySource(actor: ShwActor<'character'>): ItemSourcedBonuses {
  return {
    equipment: collectEquipmentBonuses(actor),
    abilities: collectAbilityBonuses(actor),
  };
}

export function mergeSourcedBonuses(sourced: ItemSourcedBonuses): Map<CharacterStatPath, number> {
  const merged = new Map<CharacterStatPath, number>();

  for (const map of [sourced.equipment, sourced.abilities]) {
    for (const [path, value] of map.entries()) {
      merged.set(path, (merged.get(path) ?? 0) + value);
    }
  }

  return merged;
}

export function sumBonusForAdditionalStat(
  bonuses: Map<CharacterStatPath, number>,
  key: string,
): number {
  return (
    (bonuses.get(`additionalAttributes.${key}` as CharacterStatPath) ?? 0) +
    (bonuses.get(`totals.${key}` as CharacterStatPath) ?? 0)
  );
}

export function sumStatSources(sources: {
  base: number;
  growth: number;
  equipment: number;
  abilities: number;
  extra: number;
}): number {
  return sources.base + sources.growth + sources.equipment + sources.abilities + sources.extra;
}
