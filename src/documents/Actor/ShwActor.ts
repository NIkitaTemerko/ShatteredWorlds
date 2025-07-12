import { characterRoll } from '../../helpers/Character/characterRoll';
import { prepareCharacterBaseData } from '../../helpers/Character/prepareCharacterBaseData';
import { prepareCharacterDerivedData } from '../../helpers/Character/prepareCharacterDerivedData';
import type { ShwActorSystem } from './types/ShwActorSystem';

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
