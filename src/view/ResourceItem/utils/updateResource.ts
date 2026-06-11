import { getResourceImage, ItemFactory } from '../../../documents/Item/ItemFactory';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { ResourceCategory, ResourceData } from '../../../documents/Item/types/ResourceDataTypes';
import { getTypeOptions } from '../../../entities/resource';

function resourceBaseData(item: ShwItem) {
  const sys = item.system as ResourceData;
  return {
    name: item.name,
    description: sys.description ?? '',
    weight: sys.weight ?? 0,
    rarity: sys.rarity ?? 'common',
    price: sys.price ?? 0,
    quantity: sys.quantity ?? 1,
    stackLimit: sys.stackLimit ?? 99,
  };
}

export const getUpdateResource = (item: ShwItem) =>
  async function updateResource(path: string, value: unknown, e?: Event) {
    e?.stopPropagation();

    if (!item.isResource()) return;

    const sys = item.system as ResourceData;

    if (path === 'category') {
      const category = value as ResourceCategory;
      const resourceType = getTypeOptions(category)[0]?.value ?? 'ore';

      await item.update({
        system: ItemFactory.createResource(category, resourceType, resourceBaseData(item)),
        img: getResourceImage(category),
      });
      return;
    }

    if (path === 'resourceType') {
      await item.update({
        system: ItemFactory.createResource(
          sys.category ?? 'raw',
          value as string,
          resourceBaseData(item),
        ),
      });
      return;
    }

    await item.update({ [`system.${path}`]: value });
  };
