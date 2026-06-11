import { ShwItemSheet } from '../../sheets/Item/SveltItemSheet';
import ReactiveItemWrapper from './ui/ReactiveItemWrapper.svelte';

export class ResourceItemApp extends ShwItemSheet {
  static Shell = ReactiveItemWrapper;

  static override get defaultOptions() {
    const options = ShwItemSheet.defaultOptions;
    return foundry.utils.mergeObject(options, {
      width: 500 as 500,
      height: 450 as 500,
      resizable: false,
    });
  }

  get template() {
    return 'systems/shattered-worlds/templates/item/ShwItemSheet.hbs';
  }

  async getData() {
    return super.getData();
  }
}
