import { ShwActor } from '../../../documents/Actor/ShwActor';
import type { ShwItem } from '../../../documents/Item/ShwItem';
import { localize } from '../../i18n';
import type { ItemDataLike } from '../../model/types/itemHelpers';

/** Проверяет, стекируется ли предмет данного типа */
export function isStackable(itemData: ItemDataLike): boolean {
  return itemData.type === 'consumable' || itemData.type === 'resource';
}

/**
 * Генерирует ключ идентификации предмета.
 * Использует baseId если есть, иначе type + name.
 */
export function getIdentityKey(itemData: ItemDataLike): string {
  if (itemData.system?.baseId) {
    return itemData.system.baseId;
  }
  // Fallback: тип + нормализованное имя
  return `${itemData.type}:${itemData.name?.toLowerCase().trim()}`;
}

/**
 * Находит существующий стек в инвентаре актёра.
 * Приоритет у незаполненных стеков.
 */
export function findExistingStack(actor: ShwActor, itemData: ItemDataLike): ShwItem | null {
  const identityKey = getIdentityKey(itemData);
  let firstMatch: ShwItem | null = null;

  for (const item of actor.items) {
    const existingKey = getIdentityKey({
      type: item.type,
      name: item.name,
      system: item.system as unknown as ItemDataLike['system'],
    });

    if (existingKey === identityKey) {
      // Для стекируемых: приоритет у незаполненных
      if (item.isConsumable() || item.isResource()) {
        const currentQty = item.system.quantity || 0;
        const stackLimit = item.system.stackLimit || Number.POSITIVE_INFINITY;

        // Нашли незаполненный стек
        if (currentQty < stackLimit) {
          return item;
        }

        // Запоминаем первое совпадение (даже если полный) как fallback
        if (!firstMatch) {
          firstMatch = item;
        }
      } else {
        // Нестекируемый предмет — возвращаем первое совпадение
        return item;
      }
    }
  }

  // Возвращаем первое совпадение (может быть полным, incrementStack обработает overflow)
  return firstMatch;
}

// Глобальный флаг предотвращения рекурсии при создании overflow-стеков
let isCreatingOverflowStacks = false;

/** Проверка, идёт ли сейчас создание overflow-стеков */
export function isInOverflowCreation(): boolean {
  return isCreatingOverflowStacks;
}

/**
 * Увеличивает количество в стеке.
 * При превышении stackLimit заполняет текущий и создаёт новые.
 * Выполняет обновления асинхронно, возвращает контроль сразу.
 */
export function incrementStack(existingItem: ShwItem, incomingData: ItemDataLike): void {
  if (!existingItem.isConsumable() && !existingItem.isResource()) return;

  const currentQuantity = existingItem.system.quantity || 0;
  const incomingQuantity = incomingData.system?.quantity || 1;
  const stackLimit = existingItem.system.stackLimit || Number.POSITIVE_INFINITY;
  const totalQuantity = currentQuantity + incomingQuantity;

  // Case 1: вмещается в текущий стек
  if (totalQuantity <= stackLimit) {
    existingItem
      .update({
        'system.quantity': totalQuantity,
      })
      .then(() => {
        ui.notifications?.info(
          localize('stack.increased', {
            name: existingItem.name,
            from: String(currentQuantity),
            to: String(totalQuantity),
          }),
        );
      });
    return;
  }

  // Case 2: переполнение — заполняем текущий и создаём новые
  const overflow = totalQuantity - stackLimit;

  // Заполняем текущий стек до максимума
  existingItem
    .update({
      'system.quantity': stackLimit,
    })
    .then(() => {
      ui.notifications?.info(
        localize('stack.filledToMax', {
          name: existingItem.name,
          from: String(currentQuantity),
          to: String(stackLimit),
        }),
      );
    });

  // Создаём дополнительные стеки для остатка
  const parent = existingItem.parent;
  if (parent && parent instanceof ShwActor) {
    const fullStacks = Math.floor(overflow / stackLimit);
    const partialStack = overflow % stackLimit;

    const newStacks: Array<{
      name: string;
      type: string;
      img: string;
      system: Record<string, unknown>;
    }> = [];

    // Полные стеки
    for (let i = 0; i < fullStacks; i++) {
      newStacks.push({
        name: existingItem.name,
        type: existingItem.type,
        img: existingItem.img,
        system: {
          ...(existingItem.system as unknown as Record<string, unknown>),
          quantity: stackLimit,
        },
      });
    }

    // Частичный стек если есть остаток
    if (partialStack > 0) {
      newStacks.push({
        name: existingItem.name,
        type: existingItem.type,
        img: existingItem.img,
        system: {
          ...(existingItem.system as unknown as Record<string, unknown>),
          quantity: partialStack,
        },
      });
    }

    if (newStacks.length > 0) {
      // Устанавливаем флаг против рекурсии
      isCreatingOverflowStacks = true;

      parent.createEmbeddedDocuments('Item', newStacks as never).then(() => {
        // Сбрасываем флаг после создания
        isCreatingOverflowStacks = false;
        ui.notifications?.info(
          localize('stack.additionalCreated', {
            name: existingItem.name,
            count: String(newStacks.length),
          }),
        );
      });
    }
  }
}

/**
 * Обрабатывает добавление предмета в инвентарь с логикой стекирования.
 * - 'allow': разрешить создание
 * - 'stacked': предмет добавлен в стек, создание не нужно
 * - 'blocked': дубликат, создание заблокировано
 */
export function handleAddItem(
  actor: ShwActor,
  itemData: ItemDataLike,
): 'allow' | 'stacked' | 'blocked' {
  // Пропускаем логику при создании overflow-стеков (предотвращаем бесконечный цикл)
  if (isInOverflowCreation()) {
    return 'allow';
  }

  const existing = findExistingStack(actor, itemData);

  // Нет существующего предмета — разрешаем создание
  if (!existing) {
    return 'allow';
  }

  // Стекируемый предмет — увеличиваем и блокируем создание
  if (isStackable(itemData)) {
    incrementStack(existing, itemData);
    return 'stacked';
  }

  // Нестекируемый дубликат — блокируем
  ui.notifications?.warn(localize('stack.duplicateExists', { name: itemData.name }));
  return 'blocked';
}
