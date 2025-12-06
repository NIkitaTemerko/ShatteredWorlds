import type { I18nKey } from '../i18n';
import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';
import type { AttributeKey } from './types';
import { ADDITIONAL_ATTRIBUTE_LABELS } from './constants';

/**
 * Типизированные пути к характеристикам персонажа
 * Генерируются автоматически на основе типа ShwActorSystem
 */

// Базовые атрибуты
type AttributeFields = 'value' | 'extra' | 'charBonus' | 'saveBonus';
type AttributePath = `attributes.${AttributeKey}.${AttributeFields}`;

// Дополнительные атрибуты
type AdditionalAttributeKey = keyof ShwActorSystem['additionalAttributes'];
type AdditionalAttributePath = `additionalAttributes.${AdditionalAttributeKey}`;

// Здоровье
type HealthPath = 'health.value' | 'health.max';

// Утилиты
type UtilityPath = 'utility.speed' | 'utility.level';

// Хелперы
type HelperKey = keyof ShwActorSystem['helpers'];
type HelperPath = `helpers.${HelperKey}`;

// Итоговый тип всех путей
export type CharacterStatPath =
  | AttributePath
  | AdditionalAttributePath
  | HealthPath
  | HelperPath
  | UtilityPath;

export interface CharacterStatOption {
  value: CharacterStatPath;
  labelKey: I18nKey;
  attributeKey?: I18nKey;
}

/**
 * Конфигурация для генерации опций характеристик
 */
const ATTRIBUTE_KEYS: AttributeKey[] = ['fortune', 'force', 'perception', 'psyDefence', 'diplomacy'];

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

// Используем ключи из ADDITIONAL_ATTRIBUTE_LABELS чтобы не дублировать
const ADDITIONAL_ATTRIBUTE_KEYS = Object.keys(
  ADDITIONAL_ATTRIBUTE_LABELS
) as AdditionalAttributeKey[];

/**
 * Список всех доступных характеристик для выбора
 * Использует существующие ключи локализации из SHW.*
 */
export const CHARACTER_STAT_OPTIONS: CharacterStatOption[] = [
  // Атрибуты с различными полями (value, extra, charBonus, saveBonus)
  ...ATTRIBUTE_KEYS.flatMap((attr) =>
    ATTRIBUTE_FIELD_CONFIGS.map(({ field, labelKey }) => ({
      value: `attributes.${attr}.${field}` as CharacterStatPath,
      labelKey,
      attributeKey: `attributes.${attr}` as I18nKey,
    }))
  ),

  // Дополнительные атрибуты
  ...ADDITIONAL_ATTRIBUTE_KEYS.map((attr) => ({
    value: `additionalAttributes.${attr}` as CharacterStatPath,
    labelKey: `additionalAttributes.${attr}` as I18nKey,
  })),

  // Здоровье
  { value: 'helpers.totalHealth', labelKey: 'character.health.current' as I18nKey },
];
