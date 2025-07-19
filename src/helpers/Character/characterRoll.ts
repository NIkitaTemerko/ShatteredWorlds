import type { ShwActor } from '../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';

const STAT_NAMES = {
   fortune: 'Фортуна',
   force: 'Напор',
   perception: 'Восприятие',
   psyDefence: 'Пси-защита',
   diplomacy: 'Дипломатия',
} as const;

export async function characterRoll(
   actor: ShwActor,
   isSave: boolean,
   key: keyof ShwActorSystem['attributes'] | 'natural' = 'natural',
   advantage: 'adv' | 'dis' | 'normal' = 'normal',
   rollValue: number = 20,
   bonus?: number,
   cubes?: number,
) {
   const core =
      advantage === 'adv'
         ? `${cubes ?? 2}d${rollValue}kh1`
         : advantage === 'dis'
           ? `${cubes ?? 2}d${rollValue}kl1`
           : `${cubes ?? 1}d${rollValue}`;
   if (key === 'natural') {
      const roll = bonus
         ? await new Roll(`${core} + ${bonus}`).evaluate({ async: false })
         : await new Roll(`${core}`).evaluate({ async: false });
      await roll.toMessage({
         speaker: ChatMessage.getSpeaker({ actor }),
         flavor: `Натуральный бросок ${
            advantage === 'adv' ? ' с преимуществом' : advantage === 'dis' ? ' с помехой' : ''
         }`,
      });
      return;
   }
   const mod = isSave
      ? actor.system.attributes[key].saveBonus
      : actor.system.attributes[key].charBonus;

   const roll = await new Roll(`${core}+${mod}`).evaluate({ async: false });
   await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `${isSave ? 'Спас б' : 'Б'}росок ${STAT_NAMES[key]} ${
         advantage === 'adv' ? ' с преимуществом' : advantage === 'dis' ? ' с помехой' : ''
      }`,
   });
}
