import { mount, unmount } from 'svelte';
import { SETTINGS_NAMESPACE } from './model/constants';
import SettingsShell from './ui/SettingsShell.svelte';

/** Минимальный ApplicationV2 — нужен как type для registerMenu (создаёт вкладку в настройках) */
export class ShwSettingsApp extends foundry.applications.api.ApplicationV2 {
  static override DEFAULT_OPTIONS = {
    id: 'shw-settings',
    window: {
      title: 'Shattered Worlds',
    },
  };
}

// === Инжекция настроек ресурсов в панель настроек Foundry ===

let _svelteInstance: ReturnType<typeof mount> | null = null;

/**
 * Настраивает хуки для встраивания Svelte UI напрямую
 * во вкладку «Shattered Worlds» панели настроек Foundry.
 */
export function initSettingsHooks(): void {
  // ApplicationV2 (v13): (app, element: HTMLElement, context, options)
  // FormApplication (v12): (app, html: JQuery, data)
  Hooks.on('renderSettingsConfig', (app: any, html: any) => {
    requestAnimationFrame(() => {
      _cleanupSvelte();
      _tryInject(app, html);

      // Если не нашли секцию сразу — наблюдаем за DOM
      // (v13 CategoryBrowser может рендерить contents позже)
      if (!_svelteInstance) {
        _observeForSection(app, html);
      }
    });
  });

  Hooks.on('closeSettingsConfig', () => {
    _cleanupSvelte();
    _disconnectObserver();
  });
}

let _observer: MutationObserver | null = null;

function _observeForSection(app: any, html: any): void {
  _disconnectObserver();
  const root = _getRoot(app, html);
  if (!root) return;

  _observer = new MutationObserver(() => {
    if (_svelteInstance) return;
    const section = _findSystemSection(root);
    if (section) {
      _disconnectObserver();
      section.innerHTML = '';
      _svelteInstance = mount(SettingsShell, { target: section });
    }
  });

  _observer.observe(root, { childList: true, subtree: true });
}

function _disconnectObserver(): void {
  _observer?.disconnect();
  _observer = null;
}

function _cleanupSvelte(): void {
  if (_svelteInstance) {
    unmount(_svelteInstance);
    _svelteInstance = null;
  }
}

/** Получаем root-элемент окна настроек */
function _getRoot(app: any, html: any): HTMLElement | null {
  // v13 ApplicationV2: app.element — HTMLElement
  if (app?.element instanceof HTMLElement) return app.element;
  // v13: html может быть HTMLElement
  if (html instanceof HTMLElement) return html;
  // v12 FormApplication: html — jQuery
  if (html?.[0] instanceof HTMLElement) return html[0];
  // v12: app.element — jQuery
  if (app?.element?.[0] instanceof HTMLElement) return app.element[0];
  return null;
}

/** Пытаемся найти и заменить секцию настроек системы */
function _tryInject(app: any, html: any): void {
  const root = _getRoot(app, html);
  if (!root) {
    console.warn('ShwSettings: не удалось получить root-элемент');
    return;
  }

  const section = _findSystemSection(root);
  if (!section) {
    console.warn('ShwSettings: секция не найдена. root:', root.tagName, root.className);
    console.warn('ShwSettings: root.innerHTML (первые 500 симв.):', root.innerHTML.slice(0, 500));
    return;
  }

  section.innerHTML = '';
  _svelteInstance = mount(SettingsShell, { target: section });
}

/** Ищем контейнер «Shattered Worlds» в панели настроек */
function _findSystemSection(root: HTMLElement): HTMLElement | null {
  const ns = SETTINGS_NAMESPACE;

  // Стратегия 1: v12 — вкладки по data-tab
  for (const tag of ['section', 'div', '*']) {
    const el = root.querySelector<HTMLElement>(`${tag}[data-tab="${ns}"]`);
    if (el && !el.matches('button, a, nav')) return el;
  }

  // Стратегия 2: v13 — категории content-area (не sidebar кнопки)
  const catEls = root.querySelectorAll<HTMLElement>(`[data-category="${ns}"]`);
  for (const el of catEls) {
    if (!el.matches('button, a') && !el.closest('nav, aside')) return el;
  }

  // Стратегия 3: кнопка меню по data-key → поднимаемся к контейнеру контента
  const menuBtn = root.querySelector<HTMLElement>(`[data-key="${ns}.shwSettingsMenu"]`);
  if (menuBtn) {
    return _getContentContainerFromButton(menuBtn, root);
  }

  // Стратегия 4: кнопка меню по иконке .fa-cogs (может не быть data-key в v13)
  const allButtons = root.querySelectorAll<HTMLButtonElement>('button');
  for (const btn of allButtons) {
    if (btn.querySelector('.fa-cogs, .fas.fa-cogs')) {
      return _getContentContainerFromButton(btn, root);
    }
  }

  return null;
}

/** От кнопки меню поднимаемся к контейнеру контента */
function _getContentContainerFromButton(btn: HTMLElement, root: HTMLElement): HTMLElement | null {
  // Пробуем найти ближайший data-tab / data-category контейнер
  const tabContainer = btn.closest<HTMLElement>('[data-tab], [data-category]');
  if (tabContainer && !tabContainer.matches('button, a, nav, aside')) return tabContainer;

  // Ищем ближайший scrollable / content-area
  const scrollable = btn.closest<HTMLElement>('.scrollable, .content, .content-body');
  if (scrollable && !scrollable.matches('nav, aside')) return scrollable;

  // Ищем form-group и берём его родителя
  const formGroup = btn.closest<HTMLElement>('.form-group, .submenu');
  if (formGroup?.parentElement && formGroup.parentElement !== root) {
    return formGroup.parentElement;
  }

  return formGroup ?? btn.parentElement;
}
