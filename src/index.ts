import { ShwActor } from './documents/Actor/ShwActor';
import { ShwItem } from './documents/Item/ShwItem';
import { ShwTokenDocument } from './documents/ShwTokenDocument.js';
import { CharacterApp } from './view/BaseCharacter/CharacterApp.js';
import { ConsumableItemApp } from './view/ConsumableItem/ItemApp';
import { NpcApp } from './view/NpcCharacter/NpcApp';

(globalThis as any).MIN_WINDOW_HEIGHT = 200;
(globalThis as any).MIN_WINDOW_WIDTH = 200;

Hooks.once('init', () => {
  //@ts-ignore
  CONFIG.Actor.documentClass = ShwActor;
  //@ts-ignore
  CONFIG.Item.documentClass = ShwItem;
  CONFIG.Token.documentClass = ShwTokenDocument;
  CONFIG.Combat.initiative = {
    formula: '1d20 + @initiative',
    decimals: 0,
  };
});

Hooks.once('setup', () => {
  Actors.registerSheet('shw', CharacterApp, { types: ['character'], makeDefault: true });
  Actors.registerSheet('shw', NpcApp, { types: ['npc'], makeDefault: true });
  Items.registerSheet('shw', ConsumableItemApp, { types: ['consumable'], makeDefault: true });
});

Hooks.on('preCreateToken', (tokenDocument: any, tokenData: any) => {
  const actor = (game as any).actors.get(tokenData.actorId);
  if (actor?.type === 'character') {
    tokenDocument.updateSource({ actorLink: true });
  }
});
