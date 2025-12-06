import type { ShwActor } from '../../documents/Actor/ShwActor';
import type { AbilitySystem } from '../../documents/Item/types/AbilityDataTypes';
import type { CharacterStatPath } from '../../shared/model/characterStatPaths';

/**
 * Результат расчёта бонусов от предметов
 */
export interface ItemBonusResult {
  /** Карта путей к характеристикам -> итоговый бонус */
  bonuses: Map<CharacterStatPath, number>;
}

/**
 * Вычисляет все бонусы от предметов актёра
 * Обрабатывает:
 * - Passive abilities со statBonuses
 * - Будущие типы предметов с бонусами (оружие, броня и т.д.)
 */
export function calculateItemBonuses(actor: ShwActor<'character'>): ItemBonusResult {
  const bonuses = new Map<CharacterStatPath, number>();

  for (const item of actor.items) {
    const system = item.system;

    // Обрабатываем пассивные способности
    if ('category' in system && system.category === 'passive') {
      const abilitySystem = system as AbilitySystem;

      if (
        abilitySystem.category === 'passive' &&
        abilitySystem.statBonuses &&
        abilitySystem.statBonuses.modifiers
      ) {
        for (const modifier of abilitySystem.statBonuses.modifiers) {
          const stat = modifier.stat as CharacterStatPath;
          const currentBonus = bonuses.get(stat) ?? 0;

          let newBonus = currentBonus;
          switch (modifier.mode) {
            case 'add':
              newBonus = currentBonus + modifier.value;
              break;
            case 'mul':
              // Сейчас просто складываем
              newBonus = currentBonus + modifier.value;
              break;
            case 'override':
              // При override берём максимальное значение из всех модификаторов
              newBonus = Math.max(currentBonus, modifier.value);
              break;
          }

          bonuses.set(stat, newBonus);
        }
      }
    }

    // Здесь можно добавить обработку других типов предметов:
    // - consumable с постоянными бонусами
    // - equipment (оружие, броня) с бонусами к статам
  }

  return { bonuses };
}

/**
 * Применяет бонус к характеристике персонажа
 * 
 * Логика:
 * 1. Для attributes.*.value и 4 editable stats (actions, bonusActions, reactions, initiative):
 *    - Бонус применяется ТОЛЬКО к соответствующему total полю в helpers
 *    - Оригинальное поле не трогается
 * 2. Для всех остальных ключей (attributes.*.extra, health.max и т.д.):
 *    - Бонус просто прибавляется к оригинальному полю
 */
export function applyBonus(
  system: any,
  path: CharacterStatPath,
  bonus: number,
): void {
  const parts = path.split('.');
  
  // Проверяем, есть ли для этого пути total поле
  let totalKey: string | null = null;
  
  // Обработка attributes.*.value -> totalX
  if (parts[0] === 'attributes' && parts.length === 3 && parts[2] === 'value') {
    const attrKey = parts[1];
    totalKey = `total${attrKey.charAt(0).toUpperCase()}${attrKey.slice(1)}`;
    if (totalKey in system.helpers && typeof system.helpers[totalKey] === 'number') {
      // Применяем ТОЛЬКО к total полю
      system.helpers[totalKey] += bonus;
      return;
    }
  }
  
  // Обработка editable additionalAttributes
  if (parts[0] === 'additionalAttributes' && parts.length === 2) {
    const attrKey = parts[1];
    const editableKeys = ['actions', 'bonusActions', 'reactions', 'initiative', 'impulse'];
    
    if (editableKeys.includes(attrKey)) {
      totalKey = `total${attrKey.charAt(0).toUpperCase()}${attrKey.slice(1)}`;
      if (totalKey in system.helpers && typeof system.helpers[totalKey] === 'number') {
        // Применяем ТОЛЬКО к total полю
        system.helpers[totalKey] += bonus;
        return;
      }
    }
  }
  
  // Для всех остальных путей - применяем к оригинальному полю
  let current = system;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current)) return;
    current = current[parts[i]];
  }
  
  const lastKey = parts[parts.length - 1];
  if (typeof current[lastKey] === 'number') {
    current[lastKey] += bonus;
  }
}
