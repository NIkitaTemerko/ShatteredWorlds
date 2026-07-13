import type { CombatDamageType, DamageTypeDefinition } from './types';

export const COMBAT_DAMAGE_TYPE_DEFINITIONS: DamageTypeDefinition[] = [
  {
    id: 'physical',
    labelKey: 'damage.types.physical',
    inputKind: 'amount',
    defenseLayers: ['armorClass', 'damageReduction'],
    allowsPenetration: true,
  },
  {
    id: 'force',
    labelKey: 'damage.types.force',
    inputKind: 'amount',
    defenseLayers: ['armorClass'],
    allowsPenetration: true,
  },
  {
    id: 'elemental',
    labelKey: 'damage.types.elemental',
    inputKind: 'amount',
    defenseLayers: ['armorClass', 'damageReduction'],
    allowsPenetration: true,
  },
  {
    id: 'magical',
    labelKey: 'damage.types.magical',
    inputKind: 'amount',
    defenseLayers: ['psiDefense', 'damageReduction'],
    allowsPenetration: false,
  },
  {
    id: 'mental',
    labelKey: 'damage.types.mental',
    inputKind: 'amount',
    defenseLayers: ['psiDefense'],
    allowsPenetration: false,
  },
  {
    id: 'necrotic',
    labelKey: 'damage.types.necrotic',
    inputKind: 'amount',
    defenseLayers: ['damageReduction'],
    allowsPenetration: false,
  },
  {
    id: 'radiant',
    labelKey: 'damage.types.radiant',
    inputKind: 'amount',
    defenseLayers: ['damageReduction'],
    allowsPenetration: false,
  },
  {
    id: 'void',
    labelKey: 'damage.types.void',
    inputKind: 'amount',
    defenseLayers: ['damageReduction'],
    allowsPenetration: false,
    ignoresArmor: true,
    ignoresPsiDefense: true,
  },
  {
    id: 'soul',
    labelKey: 'damage.types.soul',
    inputKind: 'amount',
    defenseLayers: [],
    allowsPenetration: false,
    selectableInItems: false,
  },
  {
    id: 'fall',
    labelKey: 'damage.types.fall',
    inputKind: 'fallHeight',
    defenseLayers: [],
    allowsPenetration: false,
    selectableInItems: false,
  },
];

export const COMBAT_DAMAGE_TYPE_IDS = COMBAT_DAMAGE_TYPE_DEFINITIONS.map(
  (d) => d.id,
) as [CombatDamageType, ...CombatDamageType[]];

const definitionById = new Map(
  COMBAT_DAMAGE_TYPE_DEFINITIONS.map((d) => [d.id, d]),
);

export function getDamageTypeDefinition(id: CombatDamageType): DamageTypeDefinition {
  const def = definitionById.get(id);
  if (!def) {
    throw new Error(`Unknown damage type: ${id}`);
  }
  return def;
}

/** Тип урона проходит через слой брони — доступно пробитие. */
export function damageTypeHitsArmor(def: DamageTypeDefinition): boolean {
  return def.defenseLayers.includes('armorClass') && !def.ignoresArmor;
}
