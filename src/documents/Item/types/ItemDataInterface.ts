export interface BaseItemData {
  name: string;
  description: string;
  price: number;
  weight: number;
  quantity: number;
  stackLimit: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  img: string;
}

export type ItemType = 'weapon' | 'armor' | 'consumable' | 'equipment' | 'treasure';
