import type { SvelteComponent } from 'svelte'; // <-- добавили

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
}
