import { SvelteActorSheet } from '../../sheets/Actor/SvelteActorSheet';
import RootCharacterShell from './ui/RootCharacterShell.svelte';

export class NpcApp extends SvelteActorSheet {
  /* обязательное статическое свойство, чтобы оболочка знала, какой Shell монтировать */
  static Shell = RootCharacterShell;

  static override get defaultOptions() {
    const options = SvelteActorSheet.defaultOptions;
    return foundry.utils.mergeObject(options, {
      width: 820,
      height: 750,
      resizable: false,
    });
  }

  get template() {
    return 'systems/shattered-worlds/templates/actor/ShwCharacterSheet.hbs';
  }

  getData() {
    // можно прокинуть доп-данные в Svelte, если нужно
    return super.getData();
  }
}
