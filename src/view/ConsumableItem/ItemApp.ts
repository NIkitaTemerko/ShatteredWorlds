import { ShwItemSheet } from '../../sheets/Item/SveltItemSheet';
import ReactiveItemWrapper from './ui/ReactiveItemWrapper.svelte';

export class ConsumableItemApp extends ShwItemSheet {
  /* обязательное статическое свойство, чтобы оболочка знала, какой Shell монтировать */
  static Shell = ReactiveItemWrapper;
  static preserveSvelteOnUpdate = true;

  static override get defaultOptions() {
    const options = ShwItemSheet.defaultOptions;
    return foundry.utils.mergeObject(options, {
      width: 860 as 500,
      height: 790 as 500,
      resizable: true,
    });
  }

  get template() {
    return 'systems/shattered-worlds/templates/item/ShwItemSheet.hbs';
  }

  async getData() {
    // можно прокинуть доп-данные в Svelte, если нужно
    return super.getData();
  }
}
