/** Доля характеристики в одном коэффициенте (1 коэффициент = 25% от характеристики). */
export const ATTRIBUTE_COEFFICIENT_RATIO = 0.25;
export const ATTRIBUTE_COEFFICIENT_MAX_BASE = 200;
export const ATTRIBUTE_COEFFICIENT_MAX = ATTRIBUTE_COEFFICIENT_MAX_BASE * ATTRIBUTE_COEFFICIENT_RATIO;

/** Доля максимального здоровья в одном коэффициенте здоровья. */
export const HEALTH_COEFFICIENT_RATIO = 0.1;

/** Значение одного коэффициента от итогового доп. стата с ограничением базы. */
export function attributeCoefficientValue(extraTotal: number): number {
  return Math.floor(Math.min(extraTotal, ATTRIBUTE_COEFFICIENT_MAX_BASE) * ATTRIBUTE_COEFFICIENT_RATIO);
}

/** Значение одного коэффициента здоровья от максимального HP. */
export function healthCoefficientValue(maxHealth: number): number {
  return Math.floor(maxHealth * HEALTH_COEFFICIENT_RATIO);
}

/** Барьер от доп. фортуны = ½ итогового доп. стата. */
export function fortuneBarrierFromExtra(extraTotal: number): number {
  return Math.floor(extraTotal / 2);
}

/** Суммарное значение нескольких коэффициентов от доп. стата. */
export function scaleAttributeCoefficients(count: number, extraTotal: number): number {
  return count * attributeCoefficientValue(extraTotal);
}

/** Суммарное значение нескольких коэффициентов здоровья. */
export function scaleHealthCoefficients(count: number, maxHealth: number): number {
  return count * healthCoefficientValue(maxHealth);
}
