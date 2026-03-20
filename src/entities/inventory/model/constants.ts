import type { EquipmentSlot } from '../../../documents/Item/types/EquipmentDataTypes';
import type { SelectOption } from '../../consumable/model/types';

export const EQUIPMENT_SLOTS: SelectOption<EquipmentSlot>[] = [
  { value: 'head', label: 'equipment.slot.head' },
  { value: 'cloak', label: 'equipment.slot.cloak' },
  { value: 'amulet', label: 'equipment.slot.amulet' },
  { value: 'hands', label: 'equipment.slot.hands' },
  { value: 'body', label: 'equipment.slot.body' },
  { value: 'belt', label: 'equipment.slot.belt' },
  { value: 'one-hand', label: 'equipment.slot.oneHand' },
  { value: 'two-hand', label: 'equipment.slot.twoHand' },
  { value: 'boots', label: 'equipment.slot.boots' },
  { value: 'ring', label: 'equipment.slot.ring' },
];

/** Маппинг слот → i18n-ключ для быстрого доступа */
export const EQUIPMENT_SLOT_KEYS: Record<EquipmentSlot, string> = Object.fromEntries(
  EQUIPMENT_SLOTS.map((s) => [s.value, s.label]),
) as Record<EquipmentSlot, string>;
