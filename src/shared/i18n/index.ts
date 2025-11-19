/**
 * Локализация через нативный Foundry VTT API
 * Все переводы хранятся в lang/ru.json с префиксом SHW
 */

/**
 * Получить перевод через Foundry i18n
 * @param key - Ключ перевода (например, 'attributes.fortune')
 * @param data - Данные для подстановки в шаблон (например, {attribute: 'Сила'})
 * @returns Переведённая строка
 */
export function localize(key: string, data?: Record<string, string>): string {
  const fullKey = `SHW.${key}`;
  return game.i18n?.format(fullKey, data) ?? fullKey;
}

/**
 * Просто получить перевод без подстановки данных
 */
export function t(key: string): string {
  const fullKey = `SHW.${key}`;
  return game.i18n?.localize(fullKey) ?? fullKey;
}
