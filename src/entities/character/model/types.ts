import type { ShwActorSystem, ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';

/** Tab types for character sheets */
export type CharacterTab =
  | 'stats'
  | 'inventory'
  | 'equipment'
  | 'consumable'
  | 'spells'
  | 'passives'
  | 'abilities';

/** Roll mode types */
export type RollMode = 'adv' | 'normal' | 'dis';

/** Roll type for different attributes */
export type RollType = 'natural' | 'fortune' | 'force' | 'perception' | 'psyDefence' | 'diplomacy';

/** Attribute key type */
export type AttributeKey = 'fortune' | 'force' | 'perception' | 'psyDefence' | 'diplomacy';

/** Additional attributes type */
export type AdditionalAttributes = ShwActorSystem['additionalAttributes'];

/** Character helpers type */
export type CharacterHelpers = ShwActorSystem['helpers'];

/** NPC helpers type */
export type NpcHelpers = ShwNpcSystem['helpers'];

/** Tab configuration */
export interface TabConfig {
  id: CharacterTab;
  icon: string;
  label: string;
}

/** Attribute color configuration */
export interface AttributeColors {
  dark: string;
  light: string;
  hover: string;
}

/** Roll type configuration */
export interface RollTypeConfig {
  id: RollType;
  label: string;
  colors: AttributeColors;
}

/** Attribute column configuration */
export interface AttributeColumn {
  key: AttributeKey;
  label: string;
  dark: string;
  light: string;
  hover: string;
}

/** Constants for attribute colors */
export const ATTRIBUTE_COLORS: Record<AttributeKey, AttributeColors> = {
  fortune: { dark: '#f08c00', light: '#ffd580', hover: '#ffae40' },
  force: { dark: '#d7263d', light: '#ff9aa5', hover: '#eb607f' },
  perception: { dark: '#198754', light: '#80d9b3', hover: '#4db083' },
  psyDefence: { dark: '#8e44ad', light: '#c39bd3', hover: '#a86fc0' },
  diplomacy: { dark: '#6c757d', light: '#dee2e6', hover: '#a5acb2' },
};

/** Constants for roll types (labels are i18n keys) */
export const ROLL_TYPE_CONFIGS: RollTypeConfig[] = [
  {
    id: 'natural',
    label: 'attributes.natural',
    colors: { dark: '#3498db', light: '#87ceeb', hover: '#5dade2' },
  },
  { id: 'fortune', label: 'attributes.fortune', colors: ATTRIBUTE_COLORS.fortune },
  { id: 'force', label: 'attributes.force', colors: ATTRIBUTE_COLORS.force },
  { id: 'perception', label: 'attributes.perception', colors: ATTRIBUTE_COLORS.perception },
  { id: 'psyDefence', label: 'attributes.psyDefence', colors: ATTRIBUTE_COLORS.psyDefence },
  { id: 'diplomacy', label: 'attributes.diplomacy', colors: ATTRIBUTE_COLORS.diplomacy },
];

/** Tab configurations (labels are i18n keys) */
export const TAB_CONFIGS: TabConfig[] = [
  { id: 'stats', icon: 'fa-chart-simple', label: 'tabs.stats' },
  { id: 'inventory', icon: 'fa-box-open', label: 'tabs.inventory' },
  { id: 'equipment', icon: 'fa-shield-halved', label: 'tabs.equipment' },
  { id: 'spells', icon: 'fa-wand-magic-sparkles', label: 'tabs.spells' },
  { id: 'passives', icon: 'fa-circle-half-stroke', label: 'tabs.passives' },
  { id: 'abilities', icon: 'fa-person-running', label: 'tabs.abilities' },
];

/** Labels for additional attributes (i18n keys) */
export const ADDITIONAL_ATTRIBUTE_LABELS: Record<keyof AdditionalAttributes, string> = {
  actions: 'additionalAttributes.actions',
  bonusActions: 'additionalAttributes.bonusActions',
  reactions: 'additionalAttributes.reactions',
  impulse: 'additionalAttributes.impulse',
  additionalCloseCombatDamage: 'additionalAttributes.additionalCloseCombatDamage',
  additionalRangeDamage: 'additionalAttributes.additionalRangeDamage',
  range: 'additionalAttributes.range',
  initiative: 'additionalAttributes.initiative',
  damageReduction: 'additionalAttributes.damageReduction',
  armorClass: 'additionalAttributes.armorClass',
};

/** Icons for additional attributes */
export const ADDITIONAL_ATTRIBUTE_ICONS: Record<keyof AdditionalAttributes, string> = {
  actions: 'fas fa-running',
  bonusActions: 'fas fa-plus-circle',
  reactions: 'fas fa-bolt',
  impulse: 'fas fa-forward',
  additionalCloseCombatDamage: 'fas fa-sword',
  additionalRangeDamage: 'fas fa-crosshairs',
  range: 'fas fa-bullseye',
  initiative: 'fas fa-dice-six',
  damageReduction: 'fas fa-shield-alt',
  armorClass: 'fas fa-shield',
};

/** Icon colors for additional attributes */
export const ADDITIONAL_ATTRIBUTE_COLORS: Record<keyof AdditionalAttributes, string> = {
  actions: '#198754',
  bonusActions: '#0d6efd',
  reactions: '#dc3545',
  impulse: '#fd7e14',
  additionalCloseCombatDamage: '#dc3545',
  additionalRangeDamage: '#fd7e14',
  range: '#198754',
  initiative: '#6f42c1',
  damageReduction: '#6f42c1',
  armorClass: '#6c757d',
};
