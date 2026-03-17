import type { StatModifierBlock } from './AbilityDataTypes';
import type { BaseItemData, PricedItem } from './ItemDataInterface';

export type EquipmentSlot =
  | 'head'
  | 'cloak'
  | 'amulet'
  | 'hands'
  | 'body'
  | 'belt'
  | 'one-hand'
  | 'two-hand'
  | 'boots'
  | 'ring';

export interface EquipmentSystem extends BaseItemData, PricedItem {
  kind: 'equipment';
  slot: EquipmentSlot;
  armorClass: number;
  statBonuses: StatModifierBlock | null;
  linkedItemIds: string[];
}
