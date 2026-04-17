import {
  DEFAULT_RESOURCE_CATEGORIES,
  DEFAULT_RESOURCE_TYPES,
  SETTING_RESOURCE_CATEGORIES,
  SETTING_RESOURCE_TYPES,
  SETTINGS_NAMESPACE,
} from '../model/constants';

/** Регистрация всех настроек системы. Вызывается в Hooks.once('init') */
export function registerSettings(
  settingsAppClass: ClientSettings.RegisterSubmenu['type'],
): void {
  game.settings?.registerMenu(SETTINGS_NAMESPACE, 'shwSettingsMenu', {
    name: 'SHW.settings.menu.name',
    label: 'SHW.settings.menu.label',
    hint: 'SHW.settings.menu.hint',
    type: settingsAppClass,
    restricted: true,
    icon: 'fas fa-cogs',
  });

  game.settings?.register(SETTINGS_NAMESPACE, SETTING_RESOURCE_CATEGORIES, {
    name: 'Resource Categories',
    scope: 'world',
    config: false,
    type: Array,
    default: DEFAULT_RESOURCE_CATEGORIES,
  });

  game.settings?.register(SETTINGS_NAMESPACE, SETTING_RESOURCE_TYPES, {
    name: 'Resource Types',
    scope: 'world',
    config: false,
    type: Array,
    default: DEFAULT_RESOURCE_TYPES,
  });
}
