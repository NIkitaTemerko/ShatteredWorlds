import { ADDITIONAL_KEYS } from '../../../shared/model/constants/actorKeys';
import type { AdditionalAttributes } from '../../../shared/model/types';

/** У NPC все additionalAttributes редактируются напрямую. */
export const NPC_EDITABLE_KEYS = new Set<keyof AdditionalAttributes>(ADDITIONAL_KEYS);
