import { ADDITIONAL_KEYS } from '../../../shared/model/constants/actorKeys';
import type { AdditionalAttributes } from '../../../shared/model/types';

/** У NPC additionalAttributes хранят ручной бонус «Доп», как у персонажа. */
export const NPC_EDITABLE_KEYS = new Set<keyof AdditionalAttributes>(ADDITIONAL_KEYS);
