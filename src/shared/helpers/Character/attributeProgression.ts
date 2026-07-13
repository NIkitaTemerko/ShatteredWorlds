import type { ShwActorSystem } from '../../../documents/Actor/types/ShwActorSystem';
import { CHAR_DEFAULTS } from '../../model/constants/characterDefaults';
import { fortuneBarrierFromExtra } from './coefficients';

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

export interface AttributeProgressionBonuses {
  impulse: number;
  reactions: number;
  bonusActions: number;
  initiative: number;
  barrier: number;
  psiDefense: number;
  absorption: number;
  speedBonus: number;
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

type ProgressionAttributeTotals = Pick<ShwActorSystem['totals'], 'fortune' | 'force' | 'finesse' | 'will'>;

/** Бонусы производных ресурсов от итоговых значений характеристик (не перезаписывают ручные значения). */
export function calculateAttributeProgressionBonuses(
  attributes: ShwActorSystem['attributes'],
  totals?: ProgressionAttributeTotals,
  fortuneExtraTotal?: number,
): AttributeProgressionBonuses {
  const force = totals?.force ?? getAttributeValue(attributes, 'force');
  const finesse = totals?.finesse ?? getAttributeValue(attributes, 'finesse');
  const will = totals?.will ?? getAttributeValue(attributes, 'will');
  const fortuneValue = totals?.fortune ?? getAttributeValue(attributes, 'fortune');
  const fortuneExtra = fortuneExtraTotal ?? attributes.fortune.extra;

  return {
    impulse: force >= 20 ? 1 : 0,
    reactions: finesse >= 15 ? 1 : 0,
    bonusActions: will >= 20 ? 1 : 0,
    initiative: lookupThresholdTable(finesse, FINESSE_INITIATIVE_TABLE),
    /** Барьер от доп. фортуны (½ доп.) только при значении фортуны > 15. */
    barrier: fortuneValue > 15 ? fortuneBarrierFromExtra(fortuneExtra) : 0,
    psiDefense: lookupThresholdTable(will, WILL_PSI_DEFENSE_TABLE),
    absorption: lookupThresholdTable(will, WILL_ABSORPTION_TABLE),
    speedBonus: lookupThresholdTable(finesse, FINESSE_STEPS_TABLE),
  };
}

/** Применяет только полностью вычисляемые поля (скорость). */
export function applyComputedResourceFields(
  sys: ShwActorSystem,
  bonuses: AttributeProgressionBonuses,
): void {
  sys.utility.speed = CHAR_DEFAULTS.utility.speed + bonuses.speedBonus;
}
