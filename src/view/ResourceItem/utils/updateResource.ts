import { getResourceImage, ItemFactory } from '../../../documents/Item/ItemFactory';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import type { ResourceCategory } from '../../../documents/Item/types/ResourceDataTypes';

export const getUpdateResource = (item: ShwItem) =>
  async function updateResource(path: string, value: unknown, e?: Event) {
    e?.stopPropagation();

    if (!item.isResource()) return;

    if (path === 'category') {
      const resource = ItemFactory.createResource(
        value as ResourceCategory,
        item.system.resourceType,
        { name: item.name },
      );
      const img = getResourceImage(value as ResourceCategory);

      await item.update({
        system: resource,
        img: img,
      });
      return;
    }

    await item.update({
      system: item.system,
      [`system.${path}`]: value,
    });
  };
