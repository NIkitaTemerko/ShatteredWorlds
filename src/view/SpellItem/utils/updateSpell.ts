import { getSpellImage, ItemFactory } from '../../../documents/Item/ItemFactory';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { SpellCategory, SpellKind } from '../../../documents/Item/types/SpellDataTypes';

export const getUpdateSpell = (item: ShwItem) =>
  async function updateSpell(path: string, value: any, e?: Event) {
    e?.stopPropagation();

    // Handle category change - recreate spell with new category and update icon
    if (path === 'category') {
      const category = value as SpellCategory;
      const system = item.system as any;

      const spell = ItemFactory.createSpell(category, system.spellKind || 'attack', {
        name: item.name,
        description: item.system.description,
        rarity: item.system.rarity,
      });

      const img = getSpellImage(category);

      await item.update({
        system: spell,
        img: img,
      });
      return;
    }

    // Handle kind change - recreate spell with new kind
    if (path === 'spellKind') {
      const system = item.system as any;

      const spell = ItemFactory.createSpell(system.category, value as SpellKind, {
        name: item.name,
        description: item.system.description,
        rarity: item.system.rarity,
      });

      await item.update({
        system: spell,
      });
      return;
    }

    // Default update for other fields
    await item.update({
      system: item.system, // Preserve current data
      [`system.${path}`]: value, // Update specific path
    });
  };
