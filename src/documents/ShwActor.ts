import { characterRoll } from '../helpers/characterRoll';
import { prepareCharacterBaseData } from '../helpers/prepareCharacterBaseData';
import { prepareCharacterDerivedData } from '../helpers/prepareCharacterDerivedData';

export interface ShwActorSystem {
   health: { value: number; max: number };
   attributes: {
      fortune: { value: number; extra: number; charBonus: number; saveBonus: number };
      force: { value: number; extra: number; charBonus: number; saveBonus: number };
      perception: { value: number; extra: number; charBonus: number; saveBonus: number };
      psyDefence: { value: number; extra: number; charBonus: number; saveBonus: number };
      diplomacy: { value: number; extra: number; charBonus: number; saveBonus: number };
   };
   additionalAttributes: {
      actions: number;
      bonusActions: number;
      reactions: number;
      impulse: number;
      initiative: number;

      damage: number;
      range: number;
      discount: number;
      damageReduction: number;
      armorClass: number;
      aoeResist: number;
   };
   utility: {
      speed: number;
      level: number;
   };
   helpers: {
      totalHealth: number;
      totalImpulse: number;
      totalSpeed: number;
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

   override getRollData() {
      // берём базовый набор, который делает Foundry
      const data: any = super.getRollData();

      // гарантируем, что initiative — число
      const init = Number(this.system?.additionalAttributes?.initiative ?? 0);
      // одновременно кладём дублирующее короткое поле,
      // чтобы формула '1d20 + @initiative' тоже работала
      data.initiative = init;

      return data;
   }
}
