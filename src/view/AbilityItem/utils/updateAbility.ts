import { ItemFactory, getAbilityImage } from '../../../documents/Item/ItemFactory';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { AbilityCategory, ActiveAbilityKind, PassiveAbilityKind } from '../../../documents/Item/types/AbilityDataTypes';

export const getUpdateAbility = (item: ShwItem) =>
  async function updateAbility(path: string, value: any, e?: Event) {
    e?.stopPropagation();

    // Handle category change - recreate ability with new type
    if (path === 'category') {
      const category = value as AbilityCategory;
      const defaultKind: any = category === 'active' ? 'attack' : 'stat-bonus';
      
      const ability = category === 'active'
        ? ItemFactory.createAbility('active', defaultKind, {
            name: item.name,
            description: item.system.description,
            weight: item.system.weight,
            rarity: item.system.rarity,
          })
        : ItemFactory.createAbility('passive', defaultKind, {
            name: item.name,
            description: item.system.description,
            weight: item.system.weight,
            rarity: item.system.rarity,
          });
      
      const img = getAbilityImage(category);

      await item.update({
        system: ability,
        img: img,
      });
      return;
    }

    // Handle kind change - recreate ability with new kind
    if (path === 'kind') {
      const system = item.system as any;
      
      const ability = system.category === 'active'
        ? ItemFactory.createAbility('active', value as ActiveAbilityKind, {
            name: item.name,
            description: item.system.description,
            weight: item.system.weight,
            rarity: item.system.rarity,
          })
        : ItemFactory.createAbility('passive', value as PassiveAbilityKind, {
            name: item.name,
            description: item.system.description,
            weight: item.system.weight,
            rarity: item.system.rarity,
          });

      await item.update({
        system: ability,
      });
      return;
    }

    await item.update({
      system: item.system,
      [`system.${path}`]: value,
    });
  };
