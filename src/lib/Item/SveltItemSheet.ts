import type { SvelteComponent } from 'svelte';

export class ShwItemSheet extends ItemSheet {
   _svelte: SvelteComponent | null = null;

   static override get defaultOptions() {
      return mergeObject(ItemSheet.defaultOptions, {
         width: 500,
         height: 500,
      });
   }

   async _render(...args: Parameters<ItemSheet['_render']>) {
      await super._render(...args);

      const target = this.element[0].querySelector('.svelte-sheet-body');
      if (target) {
         this._svelte?.$destroy();
         this._svelte = new (this.constructor as any).Shell({
            target,
            props: { item: this.item },
         });
      }

      this.element
         .find('img[data-edit="img"]')
         .off('click')
         .on('click', (event) => {
            event.preventDefault();
            const typedEvent = event as unknown as MouseEvent;
            this._onEditImage(typedEvent);
         });
   }

   override close(options?: any) {
      this._svelte?.$destroy();
      return super.close(options);
   }
}
