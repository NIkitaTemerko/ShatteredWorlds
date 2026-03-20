import type { EquipmentSlot } from '../../../documents/Item/types/EquipmentDataTypes';

export const EQUIPMENT_SLOTS: { value: EquipmentSlot; label: string }[] = [
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
