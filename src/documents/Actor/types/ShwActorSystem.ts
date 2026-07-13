interface AttributeFields {
  value: number;
  extra: number;
  charBonus: number;
  saveBonus: number;
  charBonusBase: number;
  saveBonusBase: number;
  /** Runtime: значение 1 коэффициента от итогового доп. стата (25%). */
  coefficient: number;
}

interface HealthFields {
  value: number;
  max: number;
  /** Ручной доп. бонус HP (персонаж). */
  extra: number;
}

interface BarrierFields {
  /** Текущий барьер (persisted). */
  value: number;
}

interface Attributes<T> {
  fortune: T;
  force: T;
  finesse: T;
  will: T;
  presence: T;
}

interface AdditionalAttributes {
  actions: number;
  bonusActions: number;
  reactions: number;
  impulse: number;
  initiative: number;
  barrier: number;
  psiDefense: number;
  range: number;
  damageReduction: number;
  armorClass: number;
  massCategory: number;
}

/** MVP-источники additional-статов, порядок = порядок строк в попапе */
export type StatSourceKey = 'base' | 'growth' | 'equipment' | 'abilities' | 'extra';

export interface StatSourceValues {
  base: number;
  growth: number;
  equipment: number;
  abilities: number;
  extra: number;
}

/** Runtime-only: разбивка additional-статов по источникам */
export type AdditionalStatSources = Record<keyof AdditionalAttributes, StatSourceValues>;

export type HealthStatSourceKey = 'base' | 'equipment' | 'abilities' | 'extra';

export interface HealthStatSources {
  base: number;
  equipment: number;
  abilities: number;
  extra: number;
}

export const HEALTH_STAT_SOURCE_KEYS: HealthStatSourceKey[] = [
  'base',
  'equipment',
  'abilities',
  'extra',
];

export const STAT_SOURCE_KEYS: StatSourceKey[] = [
  'base',
  'growth',
  'equipment',
  'abilities',
  'extra',
];

/** Упрощённая разбивка additional-статов для NPC */
export const NPC_STAT_SOURCE_KEYS: StatSourceKey[] = ['base', 'growth', 'extra'];

export type AttributeKey = keyof Attributes<unknown>;

export interface AttributeValueSources {
  base: number;
  equipment: number;
  abilities: number;
}

export interface AttributeExtraSources {
  equipment: number;
  abilities: number;
  extra: number;
}

export interface AttributeRollSources {
  base: number;
  equipment: number;
  abilities: number;
  extra: number;
}

export interface AttributeStatSourceBreakdown {
  value: AttributeValueSources;
  extra: AttributeExtraSources;
  charBonus: AttributeRollSources;
  saveBonus: AttributeRollSources;
}

/** Runtime-only: разбивка основных атрибутов по источникам */
export type AttributeStatSources = Record<AttributeKey, AttributeStatSourceBreakdown>;

export const ATTRIBUTE_VALUE_SOURCE_KEYS: (keyof AttributeValueSources)[] = [
  'base',
  'equipment',
  'abilities',
];

export const ATTRIBUTE_EXTRA_SOURCE_KEYS: (keyof AttributeExtraSources)[] = [
  'equipment',
  'abilities',
  'extra',
];

export const ATTRIBUTE_ROLL_SOURCE_KEYS: (keyof AttributeRollSources)[] = [
  'base',
  'equipment',
  'abilities',
  'extra',
];

interface UtilityFields {
  speed: number;
  /** Ручной доп. бонус скорости (персонаж). */
  speedExtra: number;
  level: number;
}

/** Runtime-only aggregated totals (prepareDerivedData). */
interface CharacterTotals {
  fortune: number;
  force: number;
  finesse: number;
  will: number;
  presence: number;
  actions: number;
  bonusActions: number;
  reactions: number;
  impulse: number;
  initiative: number;
  barrier: number;
  psiDefense: number;
  damageReduction: number;
  health: number;
  /** Runtime: значение 1 коэффициента здоровья (10% от max HP). */
  healthCoefficient: number;
  speed: number;
  range: number;
  armorClass: number;
  massCategory: number;
}

interface NpcAttribute {
  value: number;
  extra: number;
  charBonusBase: number;
  charBonus: number;
  saveBonusBase: number;
  saveBonus: number;
  coefficient: number;
}

export interface ShwActorSystem {
  health: HealthFields;
  barrier: BarrierFields;
  attributes: Attributes<AttributeFields>;
  additionalAttributes: AdditionalAttributes;
  utility: UtilityFields;
  totals: CharacterTotals;
  /** Runtime-only: разбивка additional-статов */
  additionalStatSources: AdditionalStatSources;
  /** Runtime-only: разбивка макс. HP */
  healthStatSources: HealthStatSources;
  /** Runtime-only: разбивка скорости */
  speedStatSources: StatSourceValues;
  /** Runtime-only: разбивка основных атрибутов */
  attributeStatSources: AttributeStatSources;
}

export interface ShwNpcSystem {
  health: HealthFields;
  barrier: BarrierFields;
  attributes: Attributes<NpcAttribute>;
  additionalAttributes: AdditionalAttributes;
  utility: UtilityFields;
  totals: CharacterTotals;
  /** Runtime-only: разбивка additional-статов */
  additionalStatSources: AdditionalStatSources;
  /** Runtime-only: разбивка макс. HP */
  healthStatSources: HealthStatSources;
  /** Runtime-only: разбивка скорости */
  speedStatSources: StatSourceValues;
  /** Runtime-only: разбивка основных атрибутов */
  attributeStatSources: AttributeStatSources;
}

/** Persisted actor system (schema); totals и additionalStatSources — runtime-only. */
export type ShwActorSystemSource = Omit<
  ShwActorSystem,
  'totals' | 'additionalStatSources' | 'healthStatSources' | 'speedStatSources' | 'attributeStatSources'
>;
export type ShwNpcSystemSource = Omit<
  ShwNpcSystem,
  'totals' | 'additionalStatSources' | 'healthStatSources' | 'speedStatSources' | 'attributeStatSources'
>;

/** additionalAttributes keys that may exist on runtime totals */
export type AdditionalAttributesTotalKey = Extract<
  keyof AdditionalAttributes,
  keyof CharacterTotals | keyof ShwNpcSystem['totals']
>;

export type { BarrierFields, CharacterTotals, AdditionalAttributes, AttributeFields };
