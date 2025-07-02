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
   };
}

const STAT_NAMES = {
   fortune: 'Фортуна',
   force: 'Сила',
   perception: 'Восприятие',
   psyDefence: 'Пси‑защита',
   diplomacy: 'Дипломатия',
};

const STAT_KEYS = ['fortune', 'force', 'perception', 'psyDefence', 'diplomacy'] as const;

function emptyAttr() {
   return { value: 0, extra: 0, charBonus: 0, saveBonus: 0 };
}

const UTIL_KEYS = ['actions', 'reactions', 'bonusActions', 'impulses', 'speed'] as const;
const emptyUtilMap = {
   actions: 2,
   reactions: 0,
   bonusActions: 1,
   impulses: 0,
   speed: 20,
};

export class ShwActor extends Actor {
   /** Заполняем дефолты — LANCER делает то же в prepareBaseData */
   declare update: (
      data?: object,
      operation?: Partial<Omit<foundry.abstract.types.DatabaseUpdateOperation, 'updates'>>,
   ) => Promise<undefined | foundry.abstract.Document<object, any>>;
   declare system: ShwActorSystem;

   prepareBaseData() {
      const sys = this.system;

      sys.health ??= {} as ShwActorSystem['health'];
      sys.health.max ??= 10;
      sys.health.value ??= 10;
      sys.speed ??= 20;
      sys.attributes ??= {} as ShwActorSystem['attributes'];
      sys.utility ??= {} as ShwActorSystem['utility'];

      // гарантируем, что у любого актора есть ВСЕ 5 статов
      for (const k of STAT_KEYS) {
         sys.attributes[k] ??= emptyAttr();
      }

      // гарантируем, что у любого актора есть ВСЕ 5 утилит
      for (const k of UTIL_KEYS) {
         sys.utility[k] ??= emptyUtilMap[k];
      }
   }

   prepareDerivedData() {
      const attrs = this.system.attributes;

      // пересчитываем каждый стат одинаково
      for (const k of STAT_KEYS) {
         const a = attrs[k];
         a.charBonus = Math.floor(a.value / 5);
         a.saveBonus = Math.floor(a.value / 5);
      }
   }

   /** Пример метода, который дергает Svelte-лист */

   async roll(
      key: keyof ShwActorSystem['attributes'],
      isSave = false,
      advantage?: 'adv' | 'dis' | 'normal',
   ) {
      const mod = isSave
         ? this.system.attributes[key].saveBonus
         : this.system.attributes[key].charBonus;

      const core = advantage === 'adv' ? '2d20kh1' : advantage === 'dis' ? '2d20kl1' : '1d20';

      const roll = await new Roll(`${core}+${mod}`).evaluate({ async: false });
      roll.toMessage({
         speaker: ChatMessage.getSpeaker({ actor: this }),
         flavor: `${isSave ? 'Спас б' : 'Б'}росок ${STAT_NAMES[key]} ${advantage === 'adv' ? 'Преимущество' : advantage === 'dis' ? 'Помеха' : ''}`,
      });
   }
}
