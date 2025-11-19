/**
 * Локализация через нативный Foundry VTT API
 * Все переводы хранятся в lang/ru.json с префиксом SHW
 */

import type translations from '../../../lang/ru.json';

// Рекурсивный тип для получения всех путей к листовым значениям (без ограничения глубины)
type PathsToStringProps<T, Prefix extends string = ''> = T extends string
  ? Prefix
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: PathsToStringProps<
          T[K],
          Prefix extends '' ? K : `${Prefix}.${K}`
        >;
      }[Extract<keyof T, string>]
    : never;

// Извлекаем все пути из объекта SHW
export type I18nKey = PathsToStringProps<(typeof translations)['SHW']>;

/**
 * Получить перевод через Foundry i18n с автодополнением ключей
 * @param key - Ключ перевода (например, 'attributes.fortune')
 * @param data - Данные для подстановки в шаблон (например, {attribute: 'Сила'})
 * @returns Переведённая строка
 */
export function localize(key: I18nKey, data?: Record<string, string>): string {
  const fullKey = `SHW.${key}`;
  return game.i18n?.format(fullKey, data) ?? fullKey;
}

/**
 * Просто получить перевод без подстановки данных с автодополнением ключей
 */
export function t(key: I18nKey): string {
  const fullKey = `SHW.${key}`;
  return game.i18n?.localize(fullKey) ?? fullKey;
}
