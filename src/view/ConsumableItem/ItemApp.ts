import { ShwItemSheet } from '../../sheets/Item/SveltItemSheet';
import ItemShell from './ui/RootItemShell.svelte';

export class ConsumableItemApp extends ShwItemSheet {
  /* обязательное статическое свойство, чтобы оболочка знала, какой Shell монтировать */
  static Shell = ItemShell;

  get template() {
    return 'systems/shattered-worlds/templates/item/ShwItemSheet.hbs';
  }

  async getData() {
    // можно прокинуть доп-данные в Svelte, если нужно
    return super.getData();
  }
}
