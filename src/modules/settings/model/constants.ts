import type { ResourceCategorySetting, ResourceTypeSetting } from './types';

export const SETTINGS_NAMESPACE = 'shattered-worlds';
export const SETTING_RESOURCE_CATEGORIES = 'resourceCategories';
export const SETTING_RESOURCE_TYPES = 'resourceTypes';

/** Дефолтные категории ресурсов */
export const DEFAULT_RESOURCE_CATEGORIES: ResourceCategorySetting[] = [
  { id: 'raw', label: 'Сырьё', color: '#92400E' },
  { id: 'refined', label: 'Обработанные материалы', color: '#6B7280' },
  { id: 'magical', label: 'Магические компоненты', color: '#7C3AED' },
  { id: 'organic', label: 'Органические материалы', color: '#059669' },
  { id: 'special', label: 'Специальные материалы', color: '#B45309' },
];

/** Дефолтные типы ресурсов */
export const DEFAULT_RESOURCE_TYPES: ResourceTypeSetting[] = [
  // Сырьё (raw)
  { type: 'ore', category: 'raw', label: 'Руда', icon: 'fas fa-mountain' },
  { type: 'wood', category: 'raw', label: 'Древесина', icon: 'fas fa-tree' },
  { type: 'stone', category: 'raw', label: 'Камень', icon: 'fas fa-cube' },
  { type: 'fuel', category: 'raw', label: 'Топливо', icon: 'fas fa-fire' },
  { type: 'herb', category: 'raw', label: 'Травы', icon: 'fas fa-leaf' },
  { type: 'cloth', category: 'raw', label: 'Ткань', icon: 'fas fa-scroll' },
  { type: 'gem', category: 'raw', label: 'Самоцветы', icon: 'fas fa-gem' },

  // Обработанные (refined)
  { type: 'ingot', category: 'refined', label: 'Слитки', icon: 'fas fa-cubes' },
  { type: 'leather', category: 'refined', label: 'Кожа', icon: 'fas fa-shield' },
  { type: 'glass', category: 'refined', label: 'Стекло', icon: 'fas fa-flask' },

  // Магические (magical)
  { type: 'essence', category: 'magical', label: 'Эссенция', icon: 'fas fa-sparkles' },
  { type: 'reagent', category: 'magical', label: 'Реагенты', icon: 'fas fa-vial' },

  // Органические (organic)
  { type: 'bone', category: 'organic', label: 'Кости', icon: 'fas fa-bone' },
  { type: 'scale', category: 'organic', label: 'Чешуя', icon: 'fas fa-dragon' },
  { type: 'feather', category: 'organic', label: 'Перья', icon: 'fas fa-feather' },
  { type: 'blood', category: 'organic', label: 'Кровь', icon: 'fas fa-droplet' },

  // Специфические (special)
  { type: 'sand', category: 'special', label: 'Песок', icon: 'fas fa-hourglass' },
  { type: 'clay', category: 'special', label: 'Глина', icon: 'fas fa-mortar-pestle' },
  { type: 'resin', category: 'special', label: 'Смола', icon: 'fas fa-droplet' },
];
