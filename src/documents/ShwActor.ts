import { characterRoll } from '../helpers/characterRoll';
import { prepareCharacterBaseData } from '../helpers/prepareCharacterBaseData';
import { prepareCharacterDerivedData } from '../helpers/prepareCharacterDerivedData';

export interface ShwActorSystem {
   health: { value: number; max: number };
   speed: number;
   attributes: {
      fortune: { value: number; extra: number; charBonus: number; saveBonus: number };
      force: { value: number; extra: number; charBonus: number; saveBonus: number };
      perception: { value: number; extra: number; charBonus: number; saveBonus: number };
      psyDefence: { value: number; extra: number; charBonus: number; saveBonus: number };
      diplomacy: { value: number; extra: number; charBonus: number; saveBonus: number };
   };
   utility: {
      actions: number;
      reactions: number;
      bonusActions: number;
      impulses: number;
      speed: number;
      initiative: number;
   };
}

// -----------------------------------------------------------------------

export class ShwActor extends Actor {
   declare system: ShwActorSystem;
   declare type: 'character';
   declare update: (
      data?: object,
      operation?: Partial<Omit<foundry.abstract.types.DatabaseUpdateOperation, 'updates'>>,
   ) => Promise<undefined | foundry.abstract.Document<object, any>>;

   /* ---------- базовые данные ---------- */
   prepareBaseData(): void {
      switch (this.type) {
         /* единственный кейс — персонаж */
         case 'character': {
            prepareCharacterBaseData(this.system);
            break;
         }

         /* другие типы — добавите позже */
         // case 'npc': …
         // case 'vehicle': …
      }
   }

   /* ---------- производные данные ---------- */
   prepareDerivedData(): void {
      switch (this.type) {
         case 'character': {
            prepareCharacterDerivedData(this.system);
            break;
         }
      }
   }

   /* ---------- бросок характеристики / спасброска ---------- */
   async roll(
      key: keyof ShwActorSystem['attributes'],
      isSave = false,
      advantage: 'adv' | 'dis' | 'normal' = 'normal',
   ) {
      switch (this.type) {
         case 'character': {
            characterRoll(this, isSave, key, advantage);
            break;
         }
      }
   }
}
