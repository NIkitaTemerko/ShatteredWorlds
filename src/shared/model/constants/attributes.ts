import type { I18nKey } from "../../i18n";
import type { AdditionalAttributes } from "../types";

/** Labels for additional attributes (i18n keys) */
export const ADDITIONAL_ATTRIBUTE_LABELS: Record<keyof AdditionalAttributes, I18nKey> = {
  actions: 'additionalAttributes.actions',
  bonusActions: 'additionalAttributes.bonusActions',
  reactions: 'additionalAttributes.reactions',
  impulse: 'additionalAttributes.impulse',
  additionalCloseCombatDamage: 'additionalAttributes.additionalCloseCombatDamage',
  additionalRangeDamage: 'additionalAttributes.additionalRangeDamage',
  range: 'additionalAttributes.range',
  initiative: 'additionalAttributes.initiative',
  damageReduction: 'additionalAttributes.damageReduction',
  armorClass: 'additionalAttributes.armorClass',
};