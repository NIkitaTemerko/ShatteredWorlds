// src/lib/svelte-host.ts
import { mount, unmount } from 'svelte';

export type SvelteHandle = { destroy: () => Promise<void> };

export function mountSvelte(
  Component: any,
  target: Element,
  props?: Record<string, any>,
): SvelteHandle {
  const inst = mount(Component, { target, props });
  return { destroy: () => unmount(inst, { outro: true }) };
}

export class ShwItemSheet extends foundry.appv1.sheets.ItemSheet {
  /** Хэндл смонтированного Svelte-компонента (Svelte 5) */
  private _svelte: SvelteHandle | null = null;

  /** Потомок должен объявить:  static Shell = RootItemShell; */
  static Shell: any;

  static override get defaultOptions() {
    return foundry.utils.mergeObject(foundry.appv1.sheets.ItemSheet.defaultOptions, {
      width: 500,
      height: 500,
      // scrollY можно оставить, но используем ручное восстановление скролла ниже
    });
  }

  /** сохраняем scroll, вызываем super, монтируем Svelte и только потом возвращаем прокрутку */
  override async _render(...args: Parameters<ItemSheet['_render']>) {
    // 1) Сохраняем текущий scrollTop до перерендера
    const wrapper = this.element?.find('.window-content')[0] as HTMLElement | undefined;
    const savedScroll = wrapper?.scrollTop ?? 0;

    // 2) Перерисовываем форму Foundry
    await super._render(...args);

    // 3) Монтируем (или пересоздаём) Svelte
    const target = this.element[0]?.querySelector('.svelte-sheet-body') as Element | null;
    if (target) {
      // Корректно размонтируем предыдущий инстанс
      await this._svelte?.destroy?.();

      const Shell = (this.constructor as typeof ShwItemSheet).Shell;
      const sheet = this;
      const getItem = () => sheet.item;
      this._svelte = mountSvelte(Shell, target, { getItem });
    }

    // 4) Восстанавливаем scrollTop после монтирования
    const newWrapper = this.element?.find('.window-content')[0] as HTMLElement | undefined;
    if (newWrapper) newWrapper.scrollTop = savedScroll;

    // 5) Патч для клика по картинке (редактирование изображения)
    this.element
      .find('img[data-edit="img"]')
      .off('click')
      .on('click', (event) => {
        event.preventDefault();
        // базовый ItemSheet содержит _onEditImage, тип кастуем к MouseEvent
        this._onEditImage(event as unknown as MouseEvent);
      });
  }

  override async close(options?: any) {
    try {
      await this._svelte?.destroy?.();
      this._svelte = null;
      return super.close(options);
    } catch (error) {
      this._svelte = null;
      throw error;
    }
  }
}
