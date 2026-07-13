import { COMBAT_DAMAGE_TYPE_DEFINITIONS } from './damageTypeConfig';
import type { DamageTypeOption } from './types';

export const COMBAT_DAMAGE_TYPE_OPTIONS: DamageTypeOption[] =
  COMBAT_DAMAGE_TYPE_DEFINITIONS.map(({ id, labelKey }) => ({
    value: id,
    labelKey,
  }));

export const ITEM_DAMAGE_TYPE_OPTIONS: DamageTypeOption[] =
  COMBAT_DAMAGE_TYPE_DEFINITIONS.filter((d) => d.selectableInItems !== false).map(
    ({ id, labelKey }) => ({
      value: id,
      labelKey,
    }),
  );
