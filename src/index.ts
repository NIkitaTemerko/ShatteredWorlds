import { ShwActor } from './documents/ShwActor.js';
import { CharacterApp } from './view/BaseCharacter/Character.js';
import { BasicApp } from './view/BasicApp.js';

(globalThis as any).MIN_WINDOW_HEIGHT = 200;
(globalThis as any).MIN_WINDOW_WIDTH = 200;

Hooks.once('ready', () => new BasicApp().render(true, { focus: true }));
Hooks.once('init', () => {
   CONFIG.Actor.documentClass = ShwActor;
});

Hooks.once('setup', () => {
   Actors.registerSheet('shw', CharacterApp, { types: ['character'], makeDefault: true });
});
