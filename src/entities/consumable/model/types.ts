import type { I18nKey } from '../../../shared/i18n';

export type ActivationType = 'action' | 'bonus' | 'reaction';
export type PerType = 'charges' | 'uses' | 'turns';
export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ConsumableType = 'potion' | 'bomb' | 'scroll' | 'food' | 'poison';

export interface ActivationData {
  type: ActivationType;
  cost: number;
}

export interface UsesData {
  value: number;
  max: number;
  per: PerType;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
}
