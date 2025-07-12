import { SvelteActorSheet } from '../../lib/Actor/SvelteActorSheet';
import CharacterShell from './ui/RootCharacterShell.svelte';

export class CharacterApp extends SvelteActorSheet {
   /* обязательное статическое свойство, чтобы оболочка знала, какой Shell монтировать */
   static Shell = CharacterShell;

   get template() {
      return 'systems/shattered-worlds/templates/actor/ShwCharacterSheet.hbs';
   }

   getData() {
      // можно прокинуть доп-данные в Svelte, если нужно
      return super.getData();
   }
}
