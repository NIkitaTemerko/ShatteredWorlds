import type { SvelteComponent } from 'svelte';

export class ShwItemSheet extends ItemSheet {
   _svelte: SvelteComponent | null = null;

   static override get defaultOptions() {
      return foundry.utils.mergeObject(ItemSheet.defaultOptions, {
         width: 500,
         height: 500,
         // scrollY можно оставить, но сработает именно ручная логика ниже
      });
   }

   /** сохраняем scroll, вызываем super, монтируем Svelte и только потом возвращаем прокрутку */
   async _render(...args: Parameters<ItemSheet['_render']>) {
      // 1) Сохраняем текущее scrollTop
      const wrapper = this.element?.find('.window-content')[0];
      const saved = wrapper?.scrollTop || 0;

      // 2) Перерисовываем форму Foundry
      await super._render(...args);

      // 3) Монтируем (или пересоздаём) Svelte
      const target = this.element[0].querySelector('.svelte-sheet-body');
      if (target) {
         this._svelte?.$destroy();
         this._svelte = new (this.constructor as any).Shell({
            target,
            props: { item: this.item },
         });
      }

      // 4) ВОССТАНАВЛИВАЕМ scrollTop
      const newWrapper = this.element?.find('.window-content')[0];
      if (newWrapper) newWrapper.scrollTop = saved;

      // 5) Патч для клика по картинке
      this.element
         .find('img[data-edit="img"]')
         .off('click')
         .on('click', (event) => {
            event.preventDefault();
            this._onEditImage(event as unknown as MouseEvent);
         });
   }

   override close(options?: any) {
      this._svelte?.$destroy();
      return super.close(options);
   }
}
