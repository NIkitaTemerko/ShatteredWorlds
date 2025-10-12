import type { ShwActor } from '../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';

const STAT_NAMES = {
  fortune: 'Фортуна',
  force: 'Напор',
  perception: 'Восприятие',
  psyDefence: 'Пси-защита',
  diplomacy: 'Дипломатия',
  natural: 'Натуральный',
} as const;

function buildDiceFormula(advantage: 'adv' | 'dis' | 'normal', diceSize: number): string {
  if (advantage === 'adv') {
    return `2d${diceSize}kh1`;
  }
  if (advantage === 'dis') {
    return `2d${diceSize}kl1`;
  }
  return `1d${diceSize}`;
}

function getBonus(
  actor: ShwActor,
  key: keyof ShwActorSystem['attributes'] | 'natural',
  isSave: boolean,
) {
  if (key === 'natural') {
    return 0;
  }

  return isSave ? actor.system.attributes[key].saveBonus : actor.system.attributes[key].charBonus;
}

export async function characterRoll(
  actor: ShwActor,
  isSave: boolean,
  key: keyof ShwActorSystem['attributes'] | 'natural',
  advantage: 'adv' | 'dis' | 'normal' = 'normal',
  rollValue: number = 20,
  bonus?: number,
  actions?: number,
) {
  const core = buildDiceFormula(advantage, rollValue);

  const mod = getBonus(actor, key, isSave);

  const expr = bonus ? `${core} + ${bonus} + ${mod}` : `${core} + ${mod}`;
  const count = Number(actions ?? 1);

  // формируем формулу: одиночный бросок или пул { expr, expr, ... }
  const formula = count > 1 ? `{ ${Array.from({ length: count }, () => expr).join(', ')} }` : expr;

  const roll = await new Roll(formula).evaluate({ async: false });

  // достаём тоталы под-роллов пула (adv/dis уже учтены внутри total)
  let results: number[];
  const poolTerm = roll.terms.find((t: any) => t?.rolls && Array.isArray(t.rolls));

  if (poolTerm) {
    results = (poolTerm as any).rolls.map((r: any) => Number(r.total ?? 0));
  } else {
    results = [Number(roll.total ?? 0)];
  }

  // рендер стандартной карточки и замена нижней "суммы" на список значений
  const rendered = await roll.render();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = rendered;

  const totalEl = wrapper.querySelector('.dice-total');
  if (totalEl) totalEl.textContent = results.join(', ');

  await (ChatMessage as any).create({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `${isSave ? 'Спасб' : 'Б'}росок ${STAT_NAMES[key]}${bonus ? ` +${bonus}` : ''}${
      advantage === 'adv' ? ' с преимуществом' : advantage === 'dis' ? ' с помехой' : ''
    }${count > 1 ? ` ×${count}` : ''}`,
    rolls: [roll],
    content: wrapper.innerHTML,
  });

  return;
}
