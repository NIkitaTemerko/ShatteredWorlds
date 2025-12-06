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

interface CharacterHelpers extends BaseHelpers {
  // Total значения атрибутов (value + бонусы от предметов)
  totalFortune: number;
  totalForce: number;
  totalPerception: number;
  totalPsyDefence: number;
  totalDiplomacy: number;
  // Total значения только для editable additionalAttributes
  totalActions: number;
  totalBonusActions: number;
  totalReactions: number;
  totalInitiative: number;
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
  helpers: CharacterHelpers;
}

export interface ShwNpcSystem {
  health: HealthFields;
  attributes: Attributes<NpcAttribute>;
  additionalAttributes: AdditionalAttributes;
  utility: UtilityFields;
  helpers: CharacterHelpers & {
    totalDamageReduction: number;
    totalArmorClass: number;
    totalRange: number;
  };
}
