import { ShwItemSheet } from '../../sheets/Item/SveltItemSheet';
import ItemShell from './ui/RootItemShell.svelte';

export class ConsumableItemApp extends ShwItemSheet {
  /* обязательное статическое свойство, чтобы оболочка знала, какой Shell монтировать */
  static Shell = ItemShell;

  static override get defaultOptions() {
    const options = ShwItemSheet.defaultOptions;
    return foundry.utils.mergeObject(options, {
      width: 600 as 500, // Foundry typings bug
      height: 650 as 500,
      resizable: false,
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
