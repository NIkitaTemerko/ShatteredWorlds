import type { BaseItemData, PricedItem, StackableItem } from './ItemDataInterface';

/** Фиксированные категории ресурсов для группировки в UI */
export type ResourceCategory = 'raw' | 'refined' | 'magical' | 'organic' | 'special';

export interface ResourceData extends BaseItemData, PricedItem, StackableItem {
  kind: 'resource';
  category: ResourceCategory;
  /** Свободное поле типа ресурса — можно использовать пресет или произвольную строку */
  resourceType: string;
}
