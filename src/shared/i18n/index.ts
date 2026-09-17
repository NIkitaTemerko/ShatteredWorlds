/**
 * Локализация через нативный Foundry VTT API.
 * Вне Foundry (Storybook) — fallback на lang/ru.json.
 */

import translations from '../../../lang/ru.json';

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

export type I18nKey = PathsToStringProps<(typeof translations)['SHW']>;

function lookupShw(key: string): string | undefined {
  const parts = key.split('.');
  let cur: unknown = translations.SHW;
  for (const part of parts) {
    if (!cur || typeof cur !== 'object' || !(part in cur)) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

function formatTemplate(template: string, data?: Record<string, string>): string {
  if (!data) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => data[name] ?? `{${name}}`);
}

/**
 * Получить перевод через Foundry i18n с автодополнением ключей
 */
export function localize(key: I18nKey, data?: Record<string, string>): string {
  const fullKey = `SHW.${key}`;
  if (typeof game !== 'undefined' && game.i18n) {
    const result = game.i18n.format(fullKey, data) ?? fullKey;
    if (result !== fullKey) return result;
  }
  const fallback = lookupShw(key);
  return fallback ? formatTemplate(fallback, data) : key;
}

/**
 * Просто получить перевод без подстановки данных с автодополнением ключей
 */
export function t(key: I18nKey): string {
  const fullKey = `SHW.${key}`;
  if (typeof game !== 'undefined' && game.i18n) {
    const result = game.i18n.localize(fullKey) ?? fullKey;
    if (result !== fullKey) return result;
  }
  return lookupShw(key) ?? key;
}

/**
 * Label for UI options: plain strings pass through; dotted paths go through `t()`.
 */
export function resolveLabel(label: string): string {
  if (!label.includes('.')) return label;
  return t(label as I18nKey);
}
