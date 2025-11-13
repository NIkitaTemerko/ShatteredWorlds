import { SvelteActorSheet } from '../../lib/Actor/SvelteActorSheet';
import RootCharacterShell from './ui/RootCharacterShell.svelte';

export class NpcApp extends SvelteActorSheet {
  /* обязательное статическое свойство, чтобы оболочка знала, какой Shell монтировать */
  static Shell = RootCharacterShell;

  get template() {
    return 'systems/shattered-worlds/templates/actor/ShwCharacterSheet.hbs';
  }

  getData() {
    // можно прокинуть доп-данные в Svelte, если нужно
    return super.getData();
  }
}
