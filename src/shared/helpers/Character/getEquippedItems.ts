import type { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwItem } from '../../../documents/Item/ShwItem';

/**
 * Возвращает надетую экипировку актора.
 * TODO: заменить на фильтр по worn-слотам, когда механизм «надето» будет реализован.
 */
export function getEquippedItems(_actor: ShwActor<'character'>): ShwItem[] {
  return [];
}
