interface AttributeFields {
  value: number;
  extra: number;
  charBonus: number;
  saveBonus: number;
}

interface HealthFields {
  value: number;
  max: number;
}

interface Attributes<T> {
  fortune: T;
  force: T;
  perception: T;
  psyDefence: T;
  diplomacy: T;
}

interface AdditionalAttributes {
  actions: number;
  bonusActions: number;
  reactions: number;
  impulse: number;
  initiative: number;
  additionalCloseCombatDamage: number;
  additionalRangeDamage: number;
  range: number;
  damageReduction: number;
  armorClass: number;
}

interface UtilityFields {
  speed: number;
  level: number;
}

interface BaseHelpers {
  totalHealth: number;
  totalImpulse: number;
  totalSpeed: number;
}

interface NpcAttribute {
  value: number;
  extra: number;
  charBonusBase: number;
  charBonus: number;
  saveBonusBase: number;
  saveBonus: number;
}

export interface ShwActorSystem {
  health: HealthFields;
  attributes: Attributes<AttributeFields>;
  additionalAttributes: AdditionalAttributes;
  utility: UtilityFields;
  helpers: BaseHelpers;
}

export interface ShwNpcSystem {
  health: HealthFields;
  attributes: Attributes<NpcAttribute>;
  additionalAttributes: AdditionalAttributes;
  utility: UtilityFields;
  helpers: BaseHelpers & {
    totalDamageReduction: number;
    totalArmorClass: number;
    totalRange: number;
  };
}
