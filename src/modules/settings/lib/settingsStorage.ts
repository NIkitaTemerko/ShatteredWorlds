import {
  DEFAULT_RESOURCE_CATEGORIES,
  DEFAULT_RESOURCE_TYPES,
  SETTING_RESOURCE_CATEGORIES,
  SETTING_RESOURCE_TYPES,
  SETTINGS_NAMESPACE,
} from '../model/constants';
import type { ResourceCategorySetting, ResourceTypeSetting } from '../model/types';

/** Получить текущие категории ресурсов из world settings */
export function getResourceCategories(): ResourceCategorySetting[] {
  return (
    (game.settings?.get(SETTINGS_NAMESPACE, SETTING_RESOURCE_CATEGORIES) as
      | ResourceCategorySetting[]
      | undefined) ?? DEFAULT_RESOURCE_CATEGORIES
  );
}

/** Получить текущие типы ресурсов из world settings */
export function getResourceTypes(): ResourceTypeSetting[] {
  return (
    (game.settings?.get(SETTINGS_NAMESPACE, SETTING_RESOURCE_TYPES) as
      | ResourceTypeSetting[]
      | undefined) ?? DEFAULT_RESOURCE_TYPES
  );
}

/** Сохранить категории ресурсов */
export async function setResourceCategories(categories: ResourceCategorySetting[]): Promise<void> {
  await game.settings?.set(SETTINGS_NAMESPACE, SETTING_RESOURCE_CATEGORIES, categories);
}

/** Сохранить типы ресурсов */
export async function setResourceTypes(types: ResourceTypeSetting[]): Promise<void> {
  await game.settings?.set(SETTINGS_NAMESPACE, SETTING_RESOURCE_TYPES, types);
}
