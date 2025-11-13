// src/lib/Actor/SvelteActorSheet.ts

// src/lib/svelte-host.ts
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

export abstract class SvelteActorSheet extends ActorSheet {
  /** Хэндл смонтированного Svelte-компонента (Svelte 5) */
  private _svelte: SvelteHandle | null = null;

  async _render(...args: Parameters<ActorSheet['_render']>) {
    await super._render(...args);
    await this._renderSvelte();
  }

  /** Монтируем/перемонтируем Svelte Shell */
  private async _renderSvelte() {
    const target = this.element[0]?.querySelector('.svelte-sheet-body') as Element | null;
    if (!target) return;

    // корректно размонтируем предыдущий инстанс
    await this._svelte?.destroy?.();

    // Потомок обязан объявить:  static Shell = RootCharacterShell;
    const Shell = (this.constructor as any).Shell as any;

    // Svelte 5: монтирование через mount(...)
    this._svelte = mountSvelte(Shell, target, { actor: this.actor });
  }

  async close(options?: any) {
    try {
      await this._svelte?.destroy?.();
      this._svelte = null;
      return super.close(options);
    } catch (error) {
      this._svelte = null;
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

      let damage = parseInt(input.val() as string) || 0;
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
