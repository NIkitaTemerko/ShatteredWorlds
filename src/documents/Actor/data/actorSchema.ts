import { CHAR_DEFAULTS } from '../../../shared/model/constants/characterDefaults';
import { NPC_DEFAULTS } from '../../../shared/model/constants/npcDefaults';

const fields = foundry.data.fields;

const intField = (initial: number) =>
  new fields.NumberField({ required: true, integer: true, initial });

export const characterAttributeSchema = () =>
  new fields.SchemaField({
    value: intField(0),
    extra: intField(0),
    charBonus: intField(0),
    saveBonus: intField(0),
    charBonusBase: intField(0),
    saveBonusBase: intField(0),
    coefficient: intField(0),
  });

export const npcAttributeSchema = () =>
  new fields.SchemaField({
    value: intField(0),
    extra: intField(0),
    charBonus: intField(0),
    saveBonus: intField(0),
    coefficient: intField(0),
    charBonusBase: intField(0),
    saveBonusBase: intField(0),
  });

export const healthSchema = () =>
  new fields.SchemaField({
    value: intField(20),
    max: intField(20),
    extra: intField(0),
  });

export const barrierSchema = () =>
  new fields.SchemaField({
    value: intField(0),
  });

export const utilitySchema = () =>
  new fields.SchemaField({
    speed: intField(CHAR_DEFAULTS.utility.speed),
    speedExtra: intField(CHAR_DEFAULTS.utility.speedExtra),
    level: intField(CHAR_DEFAULTS.utility.level),
  });

export const additionalAttributesSchema = () =>
  new fields.SchemaField({
    actions: intField(CHAR_DEFAULTS.additionalAttributes.actions),
    bonusActions: intField(CHAR_DEFAULTS.additionalAttributes.bonusActions),
    reactions: intField(CHAR_DEFAULTS.additionalAttributes.reactions),
    impulse: intField(CHAR_DEFAULTS.additionalAttributes.impulse),
    initiative: intField(CHAR_DEFAULTS.additionalAttributes.initiative),
    barrier: intField(CHAR_DEFAULTS.additionalAttributes.barrier),
    psiDefense: intField(CHAR_DEFAULTS.additionalAttributes.psiDefense),
    range: intField(CHAR_DEFAULTS.additionalAttributes.range),
    damageReduction: intField(CHAR_DEFAULTS.additionalAttributes.damageReduction),
    armorClass: intField(CHAR_DEFAULTS.additionalAttributes.armorClass),
    massCategory: intField(CHAR_DEFAULTS.additionalAttributes.massCategory),
  });

export const characterAttributesSchema = () =>
  new fields.SchemaField({
    fortune: characterAttributeSchema(),
    force: characterAttributeSchema(),
    finesse: characterAttributeSchema(),
    will: characterAttributeSchema(),
    presence: characterAttributeSchema(),
  });

export const npcAttributesSchema = () =>
  new fields.SchemaField({
    fortune: npcAttributeSchema(),
    force: npcAttributeSchema(),
    finesse: npcAttributeSchema(),
    will: npcAttributeSchema(),
    presence: npcAttributeSchema(),
  });

export const npcUtilitySchema = () =>
  new fields.SchemaField({
    speed: intField(NPC_DEFAULTS.utility.speed),
    speedExtra: intField(NPC_DEFAULTS.utility.speedExtra),
    level: intField(NPC_DEFAULTS.utility.level),
  });
