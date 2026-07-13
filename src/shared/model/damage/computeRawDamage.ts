import type { DamageEntry } from './types';

export function computeFallRawDamage(massCategory: number, fallHeight: number): number {
  return Math.max(0, massCategory * fallHeight * 10);
}

export function computeRawDamage(
  entry: DamageEntry,
  massCategory: number,
): number {
  if (entry.type === 'fall') {
    const height = entry.fallHeight ?? 0;
    return computeFallRawDamage(massCategory, height);
  }
  return Math.max(0, entry.amount);
}
