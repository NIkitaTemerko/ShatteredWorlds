import { mount, unmount } from 'svelte';
import ImportItemsDialogShell from './ui/ImportItemsDialog.svelte';

export class ImportItemsApp extends Application {
  private _svelte: unknown = null;

  static get defaultOptions() {
    return foundry.utils.mergeObject(Application.defaultOptions, {
      id: 'import-items',
      classes: ['shw-import-items', 'sheet'],
      template: 'systems/shattered-worlds/templates/import/import-items.hbs',
      width: 900,
      height: 700,
      title: 'Импорт предметов (Core Items)',
      resizable: true,
    });
  }

  async _renderSvelte() {
    const container = this.element?.find('.svelte-import-body');
    if (!container || container.length === 0) return;

    if (this._svelte) return;

    this._svelte = mount(ImportItemsDialogShell, {
      target: container[0],
      props: {
        onClose: () => this.close(),
      },
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
