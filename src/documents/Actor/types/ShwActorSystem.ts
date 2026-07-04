interface AttributeFields {
  value: number;
  extra: number;
  charBonus: number;
  saveBonus: number;
  /** Runtime: значение 1 коэффициента от итоговой характеристики (25%). */
  coefficient: number;
}

interface HealthFields {
  value: number;
  max: number;
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

export const STAT_SOURCE_KEYS: StatSourceKey[] = [
  'base',
  'growth',
  'equipment',
  'abilities',
  'extra',
];

/** Упрощённая разбивка additional-статов для NPC */
export const NPC_STAT_SOURCE_KEYS: StatSourceKey[] = ['base', 'growth', 'extra'];

interface UtilityFields {
  speed: number;
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
  attributes: Attributes<AttributeFields>;
  additionalAttributes: AdditionalAttributes;
  utility: UtilityFields;
  totals: CharacterTotals;
  /** Runtime-only: разбивка additional-статов */
  additionalStatSources: AdditionalStatSources;
}

export interface ShwNpcSystem {
  health: HealthFields;
  attributes: Attributes<NpcAttribute>;
  additionalAttributes: AdditionalAttributes;
  utility: UtilityFields;
  totals: CharacterTotals;
  /** Runtime-only: разбивка additional-статов */
  additionalStatSources: AdditionalStatSources;
}

/** Persisted actor system (schema); totals и additionalStatSources — runtime-only. */
export type ShwActorSystemSource = Omit<ShwActorSystem, 'totals' | 'additionalStatSources'>;
export type ShwNpcSystemSource = Omit<ShwNpcSystem, 'totals' | 'additionalStatSources'>;

/** additionalAttributes keys that may exist on runtime totals */
export type AdditionalAttributesTotalKey = Extract<
  keyof AdditionalAttributes,
  keyof CharacterTotals | keyof ShwNpcSystem['totals']
>;

export type { CharacterTotals, AdditionalAttributes, AttributeFields };
