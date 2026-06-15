/** Ключ world setting для базы данных магазина */
export const SETTING_SHOP_DATABASE = 'shopDatabase';

/**
 * Устаревший ключ LocalStorage (используется только для одноразовой миграции)
 */
export const SHOP_STORAGE_KEY = 'shattered-worlds.shop-database';

/**
 * Текущая версия структуры данных магазина
 */
export const SHOP_DATABASE_VERSION = 1;

/**
 * Значение для неограниченного количества предметов
 */
export const UNLIMITED_QUANTITY = -1;

/**
 * Цвета для разных типов нод
 */
export const SHOP_NODE_COLORS = {
  location: {
    dark: '#8B5CF6',
    light: '#EDE9FE',
  },
  merchant: {
    dark: '#F59E0B',
    light: '#FEF3C7',
  },
} as const;

/**
 * Иконки для разных типов нод
 */
export const SHOP_NODE_ICONS = {
  location: 'fa-map-marker-alt',
  merchant: 'fa-user-tie',
} as const;
