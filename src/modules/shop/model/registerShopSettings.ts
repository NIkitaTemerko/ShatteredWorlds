import { SETTINGS_NAMESPACE } from '../../settings/model/constants';
import { SETTING_SHOP_DATABASE, SHOP_DATABASE_VERSION } from './constants';
import type { ShopDatabase } from './types';

const DEFAULT_SHOP_DATABASE: ShopDatabase = {
  version: SHOP_DATABASE_VERSION,
  nodes: [],
};

/** Регистрация world setting для базы данных магазина. Вызывается в Hooks.once('init') */
export function registerShopSettings(): void {
  game.settings?.register(SETTINGS_NAMESPACE, SETTING_SHOP_DATABASE, {
    name: 'Shop Database',
    scope: 'world',
    config: false,
    default: DEFAULT_SHOP_DATABASE,
  });
}
