import { mount, unmount } from 'svelte';
import type { ShwActor } from '../../documents/Actor/ShwActor';

export type SvelteHandle = { destroy: () => Promise<void> };

export function mountSvelte(
  Component: any,
  target: Element,
  props?: Record<string, any>,
): SvelteHandle {
  const inst = mount(Component, { target, props });
  return { destroy: () => unmount(inst, { outro: true }) };
}

export abstract class SvelteActorSheet extends foundry.appv1.sheets.ActorSheet {
  /** Хэндл смонтированного Svelte-компонента (Svelte 5) */
  private _svelte: any = null;
  /** ID актёра, для которого смонтирован компонент */
  private _mountedActorId: string | null = null;

  override render(force?: boolean, options?: any): this {
    // Only do full render if not yet rendered or force=true
    if (force || !this.rendered) {
      super.render(force, options);
      return this;
    }

    // Already rendered - just bring to top, don't recreate
    this.bringToTop();
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
      const Shell = (this.constructor as any).Shell as any;
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

  async close(options?: any) {
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

  activateListeners(html: any) {
    super.activateListeners(html);

    html.find('[data-action="toggle-defense"]').click((ev: any) => {
      $(ev.currentTarget).toggleClass('active');
    });

    html.find('[data-action="apply-damage"]').click((ev: any) => {
      const wrapper = $(ev.currentTarget).closest('.hp-damage-wrapper');
      const input = wrapper.find('.damage-input');
      const shield = wrapper.find('.shield-icon');
      const actor: ShwActor<'character'> | ShwActor<'npc'> = this.actor as any;

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
