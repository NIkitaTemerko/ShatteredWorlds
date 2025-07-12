import type { BaseItemData } from './ItemDataInterface';

export type ConsumableType = 'potion' | 'bomb' | 'scroll' | 'food' | 'poison';

interface BaseConsumableData extends BaseItemData {
   type: 'consumable';
   consumableType: ConsumableType;
   activation: {
      type: 'action' | 'bonus' | 'reaction';
      cost: number;
   };
   uses: {
      value: number;
      max: number;
      per: 'charges' | 'uses' | 'turns';
   };
}

export interface PotionData extends BaseConsumableData {
   consumableType: 'potion';
   effects: {
      type: 'heal' | 'buff' | 'cure';
      amount: number;
      duration: number;
      attribute?: string;
   }[];
}

export interface BombData extends BaseConsumableData {
   consumableType: 'bomb';
   damage: {
      amount: string | number;
      type: 'fire' | 'acid' | 'cold' | 'lightning' | 'thunder' | 'force';
   };
   radius: number;
   save: {
      type: string;
      dc: number;
   };
}

export interface ScrollData extends BaseConsumableData {
   consumableType: 'scroll';
   spell: {
      name: string;
      level: number;
      school: string;
   };
   requirements: {
      ability: string;
      dc: number;
   };
}

export interface FoodData extends BaseConsumableData {
   consumableType: 'food';
   nutrition: {
      value: number;
      duration: number;
   };
   effects: {
      type: string;
      duration: number;
      value: number;
   }[];
}

export interface PoisonData extends BaseConsumableData {
   consumableType: 'poison';
   damage: {
      initial: string | number;
      recurring: string | number;
      duration: number;
   };
   save: {
      type: string;
      dc: number;
   };
   application: 'contact' | 'injury' | 'ingested' | 'inhaled';
}

export type ConsumableData = PotionData | BombData | ScrollData | FoodData | PoisonData;
