import { SvelteActorSheet } from '../../lib/SvelteActorSheet';
import CharacterShell from './CharacterShell.svelte';

export class CharacterApp extends SvelteActorSheet {
   /* обязательное статическое свойство, чтобы оболочка знала, какой Shell монтировать */
   static Shell = CharacterShell;

   getData() {
      // можно прокинуть доп-данные в Svelte, если нужно
      return super.getData();
   }
}
