import { type Component, mount, unmount } from 'svelte';
import type { ShwActor } from '../../documents/Actor/ShwActor';

export type SvelteHandle = { destroy: () => Promise<void> };

export function mountSvelte(
  component: Component<any>,
  target: Element,
  props?: Record<string, unknown>,
): SvelteHandle {
  const inst = mount(component, { target, props });
  return { destroy: () => unmount(inst, { outro: true }) };
}

export abstract class SvelteActorSheet extends foundry.appv1.sheets.ActorSheet {
  /** Хэндл смонтированного Svelte-компонента (Svelte 5) */
  private _svelte: ReturnType<typeof mount> | null = null;
  /** ID актёра, для которого смонтирован компонент */
  private _mountedActorId: string | null = null;
  override render(force?: boolean, options?: object): this {
    // Only do full render if not yet rendered or force=true
    if (force || !this.rendered) {
      super.render(force, options);
      return this;
    }

    // Already rendered - no need to recreate or bring to top
    return this;
  }

  async _render(...args: Parameters<ActorSheet['_render']>) {
    await super._render(...args);
    await this._renderSvelte();
  }

  /** Монтируем Svelte Shell (только при первом рендере или смене актёра) */
  private async _renderSvelte() {
    const target = this.element[0]?.querySelector('.svelte-sheet-body') as Element | null;
    if (!target) return;

    // Remount if actor changed
    const actorChanged = this._mountedActorId !== null && this._mountedActorId !== this.actor.id;

    if (actorChanged) {
      if (this._svelte) {
        unmount(this._svelte);
      }
      this._svelte = null;
      this._mountedActorId = null;
    }

    // Mount component with getter function for reactivity
    if (!this._svelte) {
      const Shell = (this.constructor as { Shell?: Component<any> }).Shell;
      if (!Shell) return;
      const getActor = () => this.actor;
      this._svelte = mount(Shell, { target, props: { getActor } });
      this._mountedActorId = this.actor.id;
    }

    // Патч для клика по картинке (редактирование изображения)
    this.element
      .find('img[data-edit="img"]')
      .off('click')
      .on('click', (event) => {
        event.preventDefault();
        // базовый ActorSheet содержит _onEditImage
        this._onEditImage(event as unknown as MouseEvent);
      });
  }

  async close(options?: object) {
    try {
      if (this._svelte) {
        unmount(this._svelte);
      }
      this._svelte = null;
      this._mountedActorId = null;
      return super.close(options);
    } catch (error) {
      this._svelte = null;
      this._mountedActorId = null;
      throw error;
    }
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    html.find('[data-action="toggle-defense"]').click((ev: JQuery.ClickEvent) => {
      $(ev.currentTarget).toggleClass('active');
    });

    html.find('[data-action="apply-damage"]').click((ev: JQuery.ClickEvent) => {
      const wrapper = $(ev.currentTarget).closest('.hp-damage-wrapper');
      const input = wrapper.find('.damage-input');
      const shield = wrapper.find('.shield-icon');
      const actor = this.actor as unknown as ShwActor<'character'> | ShwActor<'npc'>;

      let damage = parseInt(input.val() as string, 10) || 0;
      const defense = actor.system.additionalAttributes.armorClass ?? 0;
      const damageReduction =
        actor.type === 'character'
          ? (actor.system.additionalAttributes.damageReduction ?? 0)
          : actor.system.helpers.totalDamageReduction;

      if (shield.hasClass('active')) {
        damage = Math.max(0, damage - defense);
      }

      if (damage > 0) {
        const current = actor.system.health.value;
        const newHP = Math.max(0, current - Math.max(0, damage - damageReduction));
        actor.update({ 'system.health.value': newHP });
      }

      input.val(0);
    });
  }

  getData() {
    return super.getData();
  }
}
