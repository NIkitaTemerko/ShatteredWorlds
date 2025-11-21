import type { RollMode, RollType } from '../../entities/character/model';
import type { ShwActor } from '../../documents/Actor/ShwActor';
import { t, localize } from '../../shared/i18n';
import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';

// I18n keys for attribute names
const STAT_NAME_KEYS = {
  fortune: 'attributes.fortune',
  force: 'attributes.force',
  perception: 'attributes.perception',
  psyDefence: 'attributes.psyDefence',
  diplomacy: 'attributes.diplomacy',
  natural: 'attributes.natural',
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

  const expr = `${core}${bonus ? ` + ${bonus}` : ''}${mod ? ` + ${mod}` : ''}`;
  const count = Number(actions ?? 1);

  // формируем формулу: одиночный бросок или пул { expr, expr, ... }
  const formula = count > 1 ? `{ ${Array.from({ length: count }, () => expr).join(', ')} }` : expr;

  const roll = await new Roll(formula).evaluate({});

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

  // Build flavor text with i18n
  const statName = t(STAT_NAME_KEYS[key]);
  const rollTypePrefix = isSave ? localize('roll.flavorSave', { attribute: statName }) : localize('roll.flavorRoll', { attribute: statName });
  const bonusText = bonus ? localize('roll.withBonus', { bonus: String(bonus) }) : '';
  const advantageText = 
    advantage === 'adv' ? t('roll.withAdvantage') : 
    advantage === 'dis' ? t('roll.withDisadvantage') : '';
  const multipleText = count > 1 ? localize('roll.multiple', { count: String(count) }) : '';
  
  const flavor = `${rollTypePrefix}${bonusText}${advantageText}${multipleText}`;

  await (ChatMessage as any).create({
    speaker: ChatMessage.getSpeaker({
      actor: actor as unknown as Actor<'base' | foundry.abstract.Document.ModuleSubType>,
    }),
    flavor,
    rolls: [roll],
    content: wrapper.innerHTML,
  });

  return;
}
