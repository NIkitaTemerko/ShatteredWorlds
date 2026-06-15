import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';
import type { I18nKey } from '../i18n';
import { ADDITIONAL_ATTRIBUTE_LABELS } from './constants';
import type { AttributeKey } from './types';

type AttributeFields = 'value' | 'extra' | 'charBonus' | 'saveBonus';
type AttributePath = `attributes.${AttributeKey}.${AttributeFields}`;

type AdditionalAttributeKey = keyof ShwActorSystem['additionalAttributes'];
type AdditionalAttributePath = `additionalAttributes.${AdditionalAttributeKey}`;

type HealthPath = 'health.value' | 'health.max';

type UtilityPath = 'utility.speed' | 'utility.level';

type TotalKey = keyof ShwActorSystem['totals'];
type TotalPath = `totals.${TotalKey}`;

/** @deprecated legacy paths migrated at load */
type LegacyHelperPath = `helpers.total${Capitalize<TotalKey>}`;

export type CharacterStatPath =
  | AttributePath
  | AdditionalAttributePath
  | HealthPath
  | UtilityPath
  | TotalPath
  | LegacyHelperPath;

export interface CharacterStatOption {
  value: CharacterStatPath;
  labelKey: I18nKey;
  attributeKey?: I18nKey;
}

const ATTRIBUTE_KEYS: AttributeKey[] = [
  'fortune',
  'force',
  'finesse',
  'will',
  'presence',
];

type AttributeFieldConfig = {
  field: AttributeFields;
  labelKey: I18nKey;
};

const ATTRIBUTE_FIELD_CONFIGS: AttributeFieldConfig[] = [
  { field: 'value', labelKey: 'ability.passiveDetails.statModifiers.attributeValue' },
  { field: 'extra', labelKey: 'ability.passiveDetails.statModifiers.attributeExtra' },
  { field: 'charBonus', labelKey: 'ability.passiveDetails.statModifiers.attributeCharBonus' },
  { field: 'saveBonus', labelKey: 'ability.passiveDetails.statModifiers.attributeSaveBonus' },
];

const ADDITIONAL_ATTRIBUTE_KEYS = Object.keys(
  ADDITIONAL_ATTRIBUTE_LABELS,
) as AdditionalAttributeKey[];

export const CHARACTER_STAT_OPTIONS: CharacterStatOption[] = [
  ...ATTRIBUTE_KEYS.flatMap((attr) =>
    ATTRIBUTE_FIELD_CONFIGS.map(({ field, labelKey }) => ({
      value: `attributes.${attr}.${field}` as CharacterStatPath,
      labelKey,
      attributeKey: `attributes.${attr}` as I18nKey,
    })),
  ),

  ...ADDITIONAL_ATTRIBUTE_KEYS.map((attr) => ({
    value: `additionalAttributes.${attr}` as CharacterStatPath,
    labelKey: `additionalAttributes.${attr}` as I18nKey,
  })),

  { value: 'totals.health', labelKey: 'character.health.current' as I18nKey },
  { value: 'totals.speed', labelKey: 'character.utility.speed' as I18nKey },
];
