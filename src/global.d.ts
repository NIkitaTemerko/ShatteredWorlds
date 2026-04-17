import '@league-of-foundry-developers/foundry-vtt-types';
import type { ShwActor } from './documents/Actor/ShwActor';
import type { ShwItem } from './documents/Item/ShwItem';
import type { ShwTokenDocument } from './documents/ShwTokenDocument';
import type {
  ResourceCategorySetting,
  ResourceTypeSetting,
} from './modules/settings/model/types';

/**
 * Аугментация типов Foundry VTT для системы Shattered Worlds.
 *
 * AssumeHookRan — сообщаем fvtt-types, что хуки инициализации уже отработали,
 * поэтому `game.actors`, `game.items` и т.д. гарантированно доступны.
 * @see https://foundryvtt.com/api/v12/classes/client.Game.html
 * @see https://github.com/League-of-Foundry-Developers/foundry-vtt-types — AssumeHookRan
 *
 * DocumentClassConfig — регистрируем кастомные document-классы,
 * чтобы `CONFIG.Actor.documentClass = ShwActor` не требовал `@ts-expect-error`.
 * @see https://foundryvtt.com/api/v12/classes/client.Actor.html
 * @see https://foundryvtt.com/api/v12/classes/client.Item.html
 * @see https://foundryvtt.com/api/v12/classes/client.TokenDocument.html
 */
declare global {
  // После ready: game.actors, game.items, game.settings — все инициализированы
  interface AssumeHookRan {
    ready: true;
  }

  // Кастомные document-классы системы
  interface DocumentClassConfig {
    Actor: typeof ShwActor;
    Item: typeof ShwItem;
    TokenDocument: typeof ShwTokenDocument;
  }

  // Регистрация world settings системы — расширяем тип, чтобы namespace "shattered-worlds" был валидным
  interface SettingConfig {
    'shattered-worlds.resourceCategories': ResourceCategorySetting[];
    'shattered-worlds.resourceTypes': ResourceTypeSetting[];
  }
}
