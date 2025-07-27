import type { SvelteComponent } from 'svelte';
import type { ShwActor } from '../../documents/Actor/ShwActor'; // <-- добавили

export abstract class SvelteActorSheet extends ActorSheet {
   /* храните как SvelteComponent (или просто any) — у него точно есть $destroy */
   _svelte: SvelteComponent | null = null;

   async _render(...args: Parameters<ActorSheet['_render']>) {
      await super._render(...args);
      this._renderSvelte();
   }

   _renderSvelte() {
      const target = this.element[0].querySelector('.svelte-sheet-body');
      if (!target) return;
      this._svelte?.$destroy();

      /*  Shell — статическое свойство потомка (CharacterApp.Shell)  */
      this._svelte = new (this.constructor as any).Shell({
         target,
         props: { actor: this.actor },
      }) as SvelteComponent;
   }

   close(options?: any) {
      this._svelte?.$destroy();
      return super.close(options);
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
         const actor: ShwActor<'character'> | ShwActor<'npc'> = this.actor;

         let damage = parseInt(input.val() as string) || 0;
         const defense = actor.system.additionalAttributes.armorClass ?? 0; // ← путь к защите
         const damageReduction =
            actor.type === 'character'
               ? (actor.system.additionalAttributes.damageReduction ?? 0)
               : actor.system.helpers.totalDamageReduction; // ← путь к снижению урона

         // Если щит «горит» — учитываем защиту
         if (shield.hasClass('active')) {
            damage = Math.max(0, damage - defense);
         }

         if (damage > 0) {
            const current = this.actor.system.health.value;
            const newHP = Math.max(0, current - Math.max(0, damage - damageReduction));
            this.actor.update({ 'system.health.value': newHP });
         }

         input.val(0); // обнуляем поле
      });
   }
}
