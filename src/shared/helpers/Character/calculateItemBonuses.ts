import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import type { CharacterStatPath } from '../../model/characterStatPaths';
import type { ItemBonusResult, ParsedPath, PathPart } from '../../model/types/characterBonuses';
import {
  collectStatBonusesBySource,
  mergeSourcedBonuses,
} from './collectStatBonusesBySource';

export function calculateItemBonuses(actor: ShwActor<'character'>): ItemBonusResult {
  const sourced = collectStatBonusesBySource(actor);
  return { bonuses: mergeSourcedBonuses(sourced) };
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

/** Применяет бонусы к persisted-полям (extra и пр.). additionalAttributes — только «Доп», без item-бонусов. */
export function applyManualItemBonuses(
  system: ShwActorSystem,
  bonuses: Map<CharacterStatPath, number>,
): void {
  for (const [path, bonus] of bonuses.entries()) {
    if (path.startsWith('totals.')) continue;
    if (path.startsWith('additionalAttributes.')) continue;
    if (path.startsWith('health.')) continue;
    if (path.startsWith('attributes.') && path.endsWith('.value')) continue;
    if (path.match(/^attributes\.\w+\.extra$/)) continue;

    const parsed = parsePath(path);
    if (!parsed.isAttributeValue) {
      applyToOriginalField(system, parsed.parts, bonus);
    }
  }
}

/** @deprecated Use applyManualItemBonuses + derived totals assignment */
export function applyBonus(system: ShwActorSystem, path: CharacterStatPath, bonus: number): void {
  applyManualItemBonuses(system, new Map([[path, bonus]]));
}
