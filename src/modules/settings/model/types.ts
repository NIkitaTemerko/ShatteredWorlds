import type { ResourceCategory } from '../../../documents/Item/types/ResourceDataTypes';

/** Настройка категории ресурса (сохраняется в world settings) */
export interface ResourceCategorySetting {
  id: ResourceCategory;
  label: string;
  color: string;
}

/** Настройка типа ресурса (сохраняется в world settings) */
export interface ResourceTypeSetting {
  type: string;
  category: ResourceCategory;
  label: string;
  icon: string;
}
