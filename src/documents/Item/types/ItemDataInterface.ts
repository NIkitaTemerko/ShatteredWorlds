// Core item fields - minimal base for all items
export interface BaseItemData {
  name: string;
  description: string;
  weight: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  baseId?: string; // Unique identifier for stacking/duplicate detection
}

// Price mixin for items that can be bought/sold
export interface PricedItem {
  price: number;
}

// Stack mixin for items with quantity/stacks
export interface StackableItem {
  quantity: number;
  stackLimit: number;
}

export type ItemType = 'weapon' | 'armor' | 'consumable' | 'equipment' | 'treasure' | 'ability';
