import type { AttributeKey, ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';

export type RollAttribute = AttributeKey | 'natural';
export type RollMode = 'adv' | 'normal' | 'dis';

export function buildCharacterRollExpression(
  attributes: ShwActorSystem['attributes'],
  key: RollAttribute,
  isSave: boolean,
  mode: RollMode,
  sides: number,
  bonus = 0,
): string {
  const dice = mode === 'normal' ? `1d${sides}` : `2d${sides}${mode === 'adv' ? 'kh1' : 'kl1'}`;
  const statBonus = key === 'natural' ? 0 : attributes[key][isSave ? 'saveBonus' : 'charBonus'];
  const modifier = statBonus + (Number.isFinite(bonus) ? bonus : 0);

  if (modifier === 0) return dice;
  return `${dice} ${modifier < 0 ? '-' : '+'} ${Math.abs(modifier)}`;
}
