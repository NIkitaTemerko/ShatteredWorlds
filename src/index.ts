import { ShwActor } from './documents/Actor/ShwActor';
import { ShwItem } from './documents/Item/ShwItem';
import { ShwTokenDocument } from './documents/ShwTokenDocument.js';
import { CharacterApp } from './view/BaseCharacter/CharacterApp.js';
import { ItemApp } from './view/Item/ItemApp';

(globalThis as any).MIN_WINDOW_HEIGHT = 200;
(globalThis as any).MIN_WINDOW_WIDTH = 200;

Hooks.once('init', () => {
   CONFIG.Actor.documentClass = ShwActor;
   CONFIG.Item.documentClass = ShwItem;
   CONFIG.Token.documentClass = ShwTokenDocument;
   CONFIG.Combat.initiative = {
      formula: '1d20 + @initiative',
      decimals: 0,
   };
});

Hooks.once('setup', () => {
   Actors.registerSheet('shw', CharacterApp, { types: ['character', 'npc'], makeDefault: true });
   Items.registerSheet('shw', ItemApp, { types: ['consumable'], makeDefault: true });
});
