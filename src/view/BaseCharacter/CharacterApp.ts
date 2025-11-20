import { SvelteActorSheet } from '../../sheets/Actor/SvelteActorSheet';
import ReactiveActorWrapper from './ui/ReactiveActorWrapper.svelte';

export class CharacterApp extends SvelteActorSheet {
  /* обязательное статическое свойство, чтобы оболочка знала, какой Shell монтировать */
  static Shell = ReactiveActorWrapper;

  static override get defaultOptions() {
    const options = SvelteActorSheet.defaultOptions;
    return foundry.utils.mergeObject(options, {
      width: 800,
      height: 770,
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
