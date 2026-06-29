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
}

export interface ShwNpcSystem {
  health: HealthFields;
  attributes: Attributes<NpcAttribute>;
  additionalAttributes: AdditionalAttributes;
  utility: UtilityFields;
  totals: CharacterTotals & {
    armorClass: number;
    range: number;
  };
}

/** Persisted actor system (schema); totals — runtime-only. */
export type ShwActorSystemSource = Omit<ShwActorSystem, 'totals'>;
export type ShwNpcSystemSource = Omit<ShwNpcSystem, 'totals'>;

/** additionalAttributes keys that may exist on runtime totals */
export type AdditionalAttributesTotalKey = Extract<
  keyof AdditionalAttributes,
  keyof CharacterTotals | keyof ShwNpcSystem['totals']
>;

export type { CharacterTotals, AdditionalAttributes, AttributeFields };
