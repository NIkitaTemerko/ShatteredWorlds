import type { ShwActor } from '../documents/ShwActor';
import type { ShwActorSystem } from '../documents/ShwActor';

const STAT_NAMES = {
   fortune: 'Фортуна',
   force: 'Сила',
   perception: 'Восприятие',
   psyDefence: 'Пси-защита',
   diplomacy: 'Дипломатия',
} as const;

export async function characterRoll(
   actor: ShwActor,
   isSave: boolean,
   key: keyof ShwActorSystem['attributes'],
   advantage: 'adv' | 'dis' | 'normal' = 'normal',
) {
   const mod = isSave
      ? actor.system.attributes[key].saveBonus
      : actor.system.attributes[key].charBonus;

   const core = advantage === 'adv' ? '2d20kh1' : advantage === 'dis' ? '2d20kl1' : '1d20';

   const roll = await new Roll(`${core}+${mod}`).evaluate({ async: false });
   roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `${isSave ? 'Спас б' : 'Б'}росок ${STAT_NAMES[key]} ${
         advantage === 'adv' ? ' с преимуществом' : advantage === 'dis' ? ' с помехой' : ''
      }`,
   });
}
