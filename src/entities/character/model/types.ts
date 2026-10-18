import type { ShwActorSystem, ShwNpcSystem } from '../../../documents/Actor/types/ShwActorSystem';
import type { I18nKey } from '../../../shared/i18n';
import type { AdditionalAttributes, AttributeKey } from '../../../shared/model/types';

/** Tab types for character sheets */
export type CharacterTab =
  | 'stats'
  | 'inventory'
  | 'equipment'
  | 'consumable'
  | 'spells'
  | 'abilities';

/** Roll mode types */
export type RollMode = 'adv' | 'normal' | 'dis';

/** Roll type for different attributes */
export type RollType = 'natural' | 'fortune' | 'force' | 'finesse' | 'will' | 'presence';

/** Character runtime totals */
export type CharacterTotals = ShwActorSystem['totals'];

/** NPC runtime totals */
export type NpcTotals = ShwNpcSystem['totals'];

/** @deprecated Use CharacterTotals */
export type CharacterHelpers = CharacterTotals;

/** @deprecated Use NpcTotals */
export type NpcHelpers = NpcTotals;

/** Tab configuration */
export interface TabConfig {
  id: CharacterTab;
  icon: string;
  label: I18nKey;
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
  label: I18nKey;
  colors: AttributeColors;
}

/** Attribute column configuration */
export interface AttributeColumn {
  key: AttributeKey;
  label: I18nKey;
  dark: string;
  light: string;
  hover: string;
}

/** Constants for attribute colors — crystal triad */
export const ATTRIBUTE_COLORS: Record<AttributeKey, AttributeColors> = {
  fortune: { dark: '#c4922a', light: 'rgb(196 146 42 / 28%)', hover: '#e0b44a' },
  force: { dark: '#c45a6a', light: 'rgb(196 90 106 / 28%)', hover: '#e07a88' },
  finesse: { dark: '#2a9b8f', light: 'rgb(42 155 143 / 28%)', hover: '#4ec4b6' },
  will: { dark: '#8b4fc9', light: 'rgb(139 79 201 / 28%)', hover: '#b57aef' },
  presence: { dark: '#6e6488', light: 'rgb(74 66 92 / 35%)', hover: '#9a93ad' },
};

/** Constants for roll types (labels are i18n keys) */
export const ROLL_TYPE_CONFIGS: RollTypeConfig[] = [
  {
    id: 'natural',
    label: 'attributes.natural',
    colors: { dark: '#4ec4b6', light: 'rgb(78 196 182 / 28%)', hover: '#2a9b8f' },
  },
  { id: 'fortune', label: 'attributes.fortune', colors: ATTRIBUTE_COLORS.fortune },
  { id: 'force', label: 'attributes.force', colors: ATTRIBUTE_COLORS.force },
  { id: 'finesse', label: 'attributes.finesse', colors: ATTRIBUTE_COLORS.finesse },
  { id: 'will', label: 'attributes.will', colors: ATTRIBUTE_COLORS.will },
  { id: 'presence', label: 'attributes.presence', colors: ATTRIBUTE_COLORS.presence },
];

/** Tab configurations (labels are i18n keys) */
export const TAB_CONFIGS: TabConfig[] = [
  { id: 'stats', icon: 'fa-chart-simple', label: 'tabs.stats' },
  { id: 'inventory', icon: 'fa-box-open', label: 'tabs.inventory' },
  { id: 'equipment', icon: 'fa-shield-halved', label: 'tabs.equipment' },
  { id: 'spells', icon: 'fa-wand-magic-sparkles', label: 'tabs.spells' },
  { id: 'abilities', icon: 'fa-person-running', label: 'tabs.abilities' },
];

/** Icons for additional attributes */
export const ADDITIONAL_ATTRIBUTE_ICONS: Record<keyof AdditionalAttributes, string> = {
  actions: 'fas fa-running',
  bonusActions: 'fas fa-plus-circle',
  reactions: 'fas fa-bolt',
  impulse: 'fas fa-forward',
  barrier: 'fas fa-shield-virus',
  psiDefense: 'fas fa-brain',
  range: 'fas fa-bullseye',
  initiative: 'fas fa-dice-six',
  damageReduction: 'fas fa-shield-alt',
  armorClass: 'fas fa-shield',
  massCategory: 'fas fa-weight-hanging',
};

/** Icon colors for additional attributes — crystal triad */
export const ADDITIONAL_ATTRIBUTE_COLORS: Record<keyof AdditionalAttributes, string> = {
  actions: '#2a9b8f',
  bonusActions: '#4ec4b6',
  reactions: '#c45a6a',
  impulse: '#c4922a',
  barrier: '#4ec4b6',
  psiDefense: '#8b4fc9',
  range: '#2a9b8f',
  initiative: '#b57aef',
  damageReduction: '#6e6488',
  armorClass: '#9a93ad',
  massCategory: '#c4922a',
};
