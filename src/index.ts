import { ShwActor } from './documents/ShwActor.js';
import { ShwTokenDocument } from './documents/ShwTokenDocument.js';
import { CharacterApp } from './view/BaseCharacter/CharacterApp.js';

(globalThis as any).MIN_WINDOW_HEIGHT = 200;
(globalThis as any).MIN_WINDOW_WIDTH = 200;

Hooks.once('init', () => {
   CONFIG.Actor.documentClass = ShwActor;
   CONFIG.Token.documentClass = ShwTokenDocument;
});

Hooks.once('setup', () => {
   Actors.registerSheet('shw', CharacterApp, { types: ['character'], makeDefault: true });
});
