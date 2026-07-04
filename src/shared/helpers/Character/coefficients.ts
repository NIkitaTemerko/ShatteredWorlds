/** Доля характеристики в одном коэффициенте (1 коэффициент = 25% от характеристики). */
export const ATTRIBUTE_COEFFICIENT_RATIO = 0.25;

/** Доля максимального здоровья в одном коэффициенте здоровья. */
export const HEALTH_COEFFICIENT_RATIO = 0.1;

/** Значение одного коэффициента от итоговой характеристики (base + extra + бонусы предметов). */
export function attributeCoefficientValue(attributeTotal: number): number {
  return Math.floor(attributeTotal * ATTRIBUTE_COEFFICIENT_RATIO);
}

/** Значение одного коэффициента здоровья от максимального HP. */
export function healthCoefficientValue(maxHealth: number): number {
  return Math.floor(maxHealth * HEALTH_COEFFICIENT_RATIO);
}

/** Суммарное значение нескольких коэффициентов от одной характеристики. */
export function scaleAttributeCoefficients(count: number, attributeTotal: number): number {
  return count * attributeCoefficientValue(attributeTotal);
}

/** Суммарное значение нескольких коэффициентов здоровья. */
export function scaleHealthCoefficients(count: number, maxHealth: number): number {
  return count * healthCoefficientValue(maxHealth);
}
