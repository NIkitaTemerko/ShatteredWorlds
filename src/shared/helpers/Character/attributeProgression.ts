import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { CHAR_DEFAULTS } from '../../model/constants/characterDefaults';
import { scaleAttributeCoefficients } from './coefficients';

type ThresholdEntry = readonly [threshold: number, value: number];

const FINESSE_STEPS_TABLE: ThresholdEntry[] = [
  [0, 0],
  [5, 5],
  [10, 10],
  [15, 10],
  [20, 15],
  [25, 20],
];

const FINESSE_INITIATIVE_TABLE: ThresholdEntry[] = [
  [0, 0],
  [5, 0],
  [10, 2],
  [15, 2],
  [20, 5],
  [25, 5],
];

const WILL_PSI_DEFENSE_TABLE: ThresholdEntry[] = [
  [0, 0],
  [5, 5],
  [10, 15],
  [15, 20],
  [20, 25],
  [25, 35],
];

/** Поглощение от вех Воли: 15 → +5, 20 → +10, 25 → +20. */
const WILL_ABSORPTION_TABLE: ThresholdEntry[] = [
  [0, 0],
  [15, 5],
  [20, 10],
  [25, 20],
];

const HEALTH_BASE = 10;

export interface AttributeProgressionBonuses {
  impulse: number;
  reactions: number;
  bonusActions: number;
  initiative: number;
  barrier: number;
  psiDefense: number;
  absorption: number;
  speedBonus: number;
  healthMax: number;
}

function lookupThresholdTable(attributeValue: number, table: readonly ThresholdEntry[]): number {
  let result = table[0][1];
  for (const [threshold, value] of table) {
    if (attributeValue >= threshold) {
      result = value;
    } else {
      break;
    }
  }
  return result;
}

function getAttributeValue(
  attributes: ShwActorSystem['attributes'],
  key: keyof ShwActorSystem['attributes'],
): number {
  return attributes[key].value;
}

function calculateHealthBonus(attributes: ShwActorSystem['attributes']): number {
  return (
    Math.floor(getAttributeValue(attributes, 'force') / 10) * 15 +
    Math.floor(getAttributeValue(attributes, 'will') / 10) * 10 +
    Math.floor(getAttributeValue(attributes, 'presence') / 10) * 10 +
    Math.floor(getAttributeValue(attributes, 'fortune') / 10) * 5 +
    Math.floor(getAttributeValue(attributes, 'finesse') / 10) * 5
  );
}

/** Бонусы производных ресурсов от базовых характеристик (не перезаписывают ручные значения). */
export function calculateAttributeProgressionBonuses(
  attributes: ShwActorSystem['attributes'],
): AttributeProgressionBonuses {
  const force = getAttributeValue(attributes, 'force');
  const finesse = getAttributeValue(attributes, 'finesse');
  const fortune = getAttributeValue(attributes, 'fortune');
  const will = getAttributeValue(attributes, 'will');

  return {
    impulse: force >= 20 ? 1 : 0,
    reactions: finesse >= 15 ? 1 : 0,
    bonusActions: will >= 20 ? 1 : 0,
    initiative: lookupThresholdTable(finesse, FINESSE_INITIATIVE_TABLE),
    barrier: scaleAttributeCoefficients(2, fortune),
    psiDefense: lookupThresholdTable(will, WILL_PSI_DEFENSE_TABLE),
    absorption: lookupThresholdTable(will, WILL_ABSORPTION_TABLE),
    speedBonus: lookupThresholdTable(finesse, FINESSE_STEPS_TABLE),
    healthMax: HEALTH_BASE + calculateHealthBonus(attributes),
  };
}

/** Применяет только полностью вычисляемые поля (скорость, макс. HP). */
export function applyComputedResourceFields(
  sys: ShwActorSystem,
  bonuses: AttributeProgressionBonuses,
): void {
  sys.utility.speed = CHAR_DEFAULTS.utility.speed + bonuses.speedBonus;
  sys.health.max = bonuses.healthMax;
}
