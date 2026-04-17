import type { ResourceCategory } from '../../../documents/Item/types/ResourceDataTypes';
import { getResourceCategories, getResourceTypes } from '../../../modules/settings/lib';
import type { SelectOption } from '../../consumable/model/types';

/** Категории для SelectInput — берутся из настроек мира */
export function getCategoryOptions(): SelectOption<ResourceCategory>[] {
  return getResourceCategories().map((c) => ({
    value: c.id as ResourceCategory,
    label: c.label,
  }));
}

/** Типы ресурсов для AutocompleteInput — берутся из настроек мира */
export function getTypeOptions(): SelectOption[] {
  return getResourceTypes().map((t) => ({
    value: t.type,
    label: t.label,
  }));
}

/** Цвет категории (dark) из настроек. Светлый вычисляется автоматически. */
export function getCategoryColor(category: ResourceCategory): { dark: string; light: string } {
  const cats = getResourceCategories();
  const found = cats.find((c) => c.id === category);
  const dark = found?.color ?? '#6B7280';
  return { dark, light: hexToLight(dark) };
}

/** Иконка типа ресурса из настроек */
export function getTypeIcon(type: string): string {
  const types = getResourceTypes();
  const found = types.find((t) => t.type === type);
  return found?.icon ?? 'fas fa-box';
}

/** Из тёмного hex делает светлый оттенок для фона */
function hexToLight(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Смешиваем с белым ~85%
  const mix = (c: number) => Math.round(c + (255 - c) * 0.85);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}
