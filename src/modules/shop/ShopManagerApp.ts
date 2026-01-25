import { mount, unmount } from 'svelte';
import ShopManagerShell from './ui/ShopManagerShell.svelte';

export class ShopManagerApp extends Application {
  private _svelte: any = null;

  static get defaultOptions() {
    return foundry.utils.mergeObject(Application.defaultOptions, {
      id: 'shop-manager',
      classes: ['shw-shop-manager', 'sheet'],
      template: 'systems/shattered-worlds/templates/shop/shop-manager.hbs',
      width: 800,
      height: 600,
      title: 'Магазины',
      resizable: true,
    });
  }

  async _renderSvelte() {
    const container = this.element?.find('.svelte-shop-body');
    if (!container || container.length === 0) return;

    if (this._svelte) return;

    this._svelte = mount(ShopManagerShell, {
      target: container[0],
      props: {},
    });
  }

  async _render(force: boolean, options = {}) {
    await super._render(force, options);
    await this._renderSvelte();
  }

  async close(options = {}) {
    if (this._svelte) {
      unmount(this._svelte);
      this._svelte = null;
    }
    return super.close(options);
  }
}
