import foundryIconsList from '../../../shared/data/foundryIcons.json';

// Категории иконок по типам предметов
const ICON_CATEGORIES: Record<string, string[]> = {
  potion: ['icons/consumables/potions/'],
  bomb: ['icons/weapons/thrown/bomb'],
  scroll: ['icons/sundries/scrolls/'],
  food: ['icons/consumables/food/'],
  poison: ['icons/consumables/potions/', 'icons/consumables/poison/'],
  ability: ['icons/skills/'],
  spell: ['icons/magic/'],
};

/**
 * Фильтрует иконки по типу предмета
 */
function getIconsForType(type: string, consumableType?: string): string[] {
  const category = consumableType || type;
  const prefixes = ICON_CATEGORIES[category] || [];
  if (prefixes.length === 0) return [];

  return (foundryIconsList as string[]).filter((icon) =>
    prefixes.some((prefix) => icon.startsWith(prefix)),
  );
}

/**
 * Генерирует промпт со схемами для ИИ (без иконок - они опциональны)
 */
export function generateSchemaPrompt(): string {
  return `# Shattered Worlds Item Import Schema

Создай JSON массив предметов для импорта в систему Shattered Worlds (Foundry VTT).

---

## Базовая структура предмета

\`\`\`typescript
interface ItemCore {
  baseId: string;                    // ОБЯЗАТЕЛЬНО. Уникальный ID, например "potion-heal-greater"
  type: "consumable" | "ability" | "spell";  // ОБЯЗАТЕЛЬНО
  name: string;                      // ОБЯЗАТЕЛЬНО. Название на русском
  img?: string;                      // Опционально. Путь к иконке Foundry VTT
  system: ConsumableSystem | AbilitySystem | SpellSystem;  // ОБЯЗАТЕЛЬНО. Зависит от type
}
\`\`\`

---

## CONSUMABLE (расходники)

### Общие поля для всех консьюмаблов

\`\`\`typescript
interface BaseConsumableFields {
  consumableType: "potion" | "bomb" | "scroll" | "food" | "poison";  // ОБЯЗАТЕЛЬНО - дискриминатор
  quantity?: number;         // По умолчанию: 1
  stackLimit?: number;       // По умолчанию: 99
  price?: number;            // По умолчанию: 0
  weight?: number;           // По умолчанию: 0
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";  // По умолчанию: "common"
  description?: string;      // По умолчанию: ""
  activation?: {
    type?: "action" | "bonus" | "reaction";  // По умолчанию: "action"
    cost?: number;           // По умолчанию: 1
  };
  uses?: {
    value?: number;          // По умолчанию: 1
    max?: number;            // По умолчанию: 1
    per?: "charges" | "uses" | "turns";  // По умолчанию: "charges"
  };
}
\`\`\`

---

### Potion (зелье)

\`\`\`typescript
interface PotionSystem extends BaseConsumableFields {
  consumableType: "potion";   // ОБЯЗАТЕЛЬНО, литерал
  effects: PotionEffect[];    // ОБЯЗАТЕЛЬНО, минимум 1 элемент
}

interface PotionEffect {
  type: "heal" | "buff" | "cure";  // ОБЯЗАТЕЛЬНО
  amount: number;                   // ОБЯЗАТЕЛЬНО
  duration: number;                 // ОБЯЗАТЕЛЬНО (0 = мгновенный)
  attribute?: string;               // Опционально, например "health", "mana"
}
\`\`\`

**Пример:**
\`\`\`json
{
  "baseId": "potion-heal-greater",
  "type": "consumable",
  "name": "Большое зелье лечения",
  "img": "icons/consumables/potions/bottle-round-label-cork-red.webp",
  "system": {
    "consumableType": "potion",
    "rarity": "uncommon",
    "price": 100,
    "effects": [{ "type": "heal", "amount": 50, "duration": 0 }]
  }
}
\`\`\`

---

### Bomb (бомба)

\`\`\`typescript
interface BombSystem extends BaseConsumableFields {
  consumableType: "bomb";   // ОБЯЗАТЕЛЬНО, литерал
  damage: {                 // ОБЯЗАТЕЛЬНО
    amount: number;         // Урон (число), например 50, 100
    type: "fire" | "acid" | "cold" | "lightning" | "poison" | "physical" | "force";
  };
  radius: number;           // ОБЯЗАТЕЛЬНО, >= 1 (в клетках)
  save: {                   // ОБЯЗАТЕЛЬНО
    type: "force" | "perception" | "psyDefence" | "fortune" | "diplomacy";  // Тип спасброска
    dc: number;             // Сложность спасброска
  };
}
\`\`\`

**Пример:**
\`\`\`json
{
  "baseId": "bomb-fire-standard",
  "type": "consumable",
  "name": "Огненная бомба",
  "img": "icons/weapons/thrown/bomb-fuse-red.webp",
  "system": {
    "consumableType": "bomb",
    "rarity": "uncommon",
    "price": 75,
    "damage": { "amount": 50, "type": "fire" },
    "radius": 3,
    "save": { "type": "perception", "dc": 14 }
  }
}
\`\`\`

---

### Scroll (свиток)

\`\`\`typescript
interface ScrollSystem extends BaseConsumableFields {
  consumableType: "scroll";   // ОБЯЗАТЕЛЬНО, литерал
  spell: {                    // ОБЯЗАТЕЛЬНО
    name: string;             // Название заклинания (не пустое)
    level: number;            // Уровень заклинания
    school: string;           // Школа магии: "evocation", "conjuration" и т.д.
  };
  requirements: {             // ОБЯЗАТЕЛЬНО
    ability: "fortune" | "force" | "perception" | "psyDefence" | "diplomacy";  // Требуемая характеристика
    dc: number;               // Сложность использования
  };
}
\`\`\`

**Пример:**
\`\`\`json
{
  "baseId": "scroll-fireball",
  "type": "consumable",
  "name": "Свиток огненного шара",
  "img": "icons/sundries/scrolls/scroll-magical-red.webp",
  "system": {
    "consumableType": "scroll",
    "rarity": "rare",
    "price": 300,
    "spell": { "name": "Fireball", "level": 3, "school": "evocation" },
    "requirements": { "ability": "perception", "dc": 13 }
  }
}
\`\`\`

---

### Food (еда)

\`\`\`typescript
interface FoodSystem extends BaseConsumableFields {
  consumableType: "food";   // ОБЯЗАТЕЛЬНО, литерал
  nutrition: {              // ОБЯЗАТЕЛЬНО
    value: number;          // Сила насыщения
    duration: number;       // Продолжительность в часах
  };
  effects?: FoodEffect[];   // Опционально, по умолчанию []
}

interface FoodEffect {
  type: string;     // Тип эффекта, например "fire_resistance"
  duration: number; // Длительность в часах
  value: number;    // Значение эффекта
}
\`\`\`

**Пример:**
\`\`\`json
{
  "baseId": "food-dragon-steak",
  "type": "consumable",
  "name": "Стейк дракона",
  "img": "icons/consumables/food/meat-cooked-steak.webp",
  "system": {
    "consumableType": "food",
    "rarity": "epic",
    "price": 500,
    "nutrition": { "value": 8, "duration": 24 },
    "effects": [{ "type": "fire_resistance", "duration": 8, "value": 50 }]
  }
}
\`\`\`

---

### Poison (яд)

\`\`\`typescript
interface PoisonSystem extends BaseConsumableFields {
  consumableType: "poison";   // ОБЯЗАТЕЛЬНО, литерал
  damage: {                   // ОБЯЗАТЕЛЬНО
    initial: string | number;   // Начальный урон
    recurring: string | number; // Повторяющийся урон
    duration: number;           // Длительность в раундах
  };
  save: {                     // ОБЯЗАТЕЛЬНО
    type: "force" | "perception" | "psyDefence" | "fortune" | "diplomacy";  // Тип спасброска
    dc: number;               // Сложность
  };
  application: "contact" | "injury" | "ingested" | "inhaled";  // ОБЯЗАТЕЛЬНО
}
\`\`\`

**Пример:**
\`\`\`json
{
  "baseId": "poison-sleep",
  "type": "consumable",
  "name": "Сонный яд",
  "img": "icons/consumables/potions/bottle-round-corked-purple.webp",
  "system": {
    "consumableType": "poison",
    "rarity": "uncommon",
    "price": 100,
    "damage": { "initial": "1d4", "recurring": "1d4", "duration": 3 },
    "save": { "type": "force", "dc": 14 },
    "application": "injury"
  }
}
\`\`\`

---

## ABILITY (способность)

\`\`\`typescript
interface AbilitySystem {
  abilityType?: "active" | "passive";  // По умолчанию: "active"
  description?: string;                // По умолчанию: ""
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  
  // Для активных способностей (abilityType: "active")
  activeKind?: "attack" | "defense" | "utility" | "movement";
  actionType?: "action" | "bonus" | "reaction";
  castTime?: number;
  
  // Для пассивных способностей (abilityType: "passive")
  passiveKind?: "stat-bonus" | "aura" | "triggered";
  mode?: "always-on" | "toggle";
  
  // Общие опциональные поля
  maxRank?: number;        // По умолчанию: 1
  currentRank?: number;    // По умолчанию: 1
  cooldown?: unknown;      // По умолчанию: null
  resourceCosts?: unknown[];  // По умолчанию: []
}
\`\`\`

**Пример активной способности:**
\`\`\`json
{
  "baseId": "ability-backstab",
  "type": "ability",
  "name": "Удар в спину",
  "img": "icons/skills/melee/strike-dagger-orange.webp",
  "system": {
    "abilityType": "active",
    "activeKind": "attack",
    "actionType": "action",
    "rarity": "uncommon",
    "description": "Наносит тройной урон скрытому врагу"
  }
}
\`\`\`

**Пример пассивной способности:**
\`\`\`json
{
  "baseId": "ability-danger-sense",
  "type": "ability",
  "name": "Чувство опасности",
  "img": "icons/skills/social/intimidation-imp-orange.webp",
  "system": {
    "abilityType": "passive",
    "passiveKind": "triggered",
    "mode": "always-on",
    "rarity": "rare",
    "description": "Преимущество на спасброски от ловушек"
  }
}
\`\`\`

---

## SPELL (заклинание)

\`\`\`typescript
interface SpellSystem {
  category?: "code" | "elemental" | "dark" | "holy" | "arcane";  // По умолчанию: "arcane"
  spellKind?: "attack" | "defense" | "utility" | "movement";     // По умолчанию: "attack"
  level?: number;           // По умолчанию: 1
  description?: string;     // По умолчанию: ""
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  castTime?: number;        // По умолчанию: 0
  resourceCosts?: unknown[];  // По умолчанию: []
  effects?: unknown[];      // По умолчанию: []
}
\`\`\`

**Пример:**
\`\`\`json
{
  "baseId": "spell-fireball",
  "type": "spell",
  "name": "Огненный шар",
  "img": "icons/magic/fire/projectile-fireball-orange.webp",
  "system": {
    "category": "elemental",
    "spellKind": "attack",
    "level": 3,
    "rarity": "rare",
    "description": "Взрыв огня радиусом 6м, 8d6 огненного урона"
  }
}
\`\`\`

---

## Иконки (опционально)

Поле \`img\` опционально. Если не указано - система подставит иконку по умолчанию.
Если указываешь иконку, используй формат: \`icons/{category}/{subcategory}/{name}.webp\`

Примеры валидных путей:
- Зелья: \`icons/consumables/potions/bottle-round-corked-red.webp\`
- Бомбы: \`icons/weapons/thrown/bomb-fuse-black.webp\`
- Свитки: \`icons/sundries/scrolls/scroll-bound-gold-tan.webp\`
- Еда: \`icons/consumables/food/cooked-drumstick-bone-brown.webp\`
- Способности: \`icons/skills/melee/blade-tip-orange.webp\`
- Заклинания: \`icons/magic/fire/projectile-fireball-orange.webp\`

**Рекомендация:** Не указывай \`img\` при генерации. Иконки можно подобрать отдельно.

---

## Требования к ответу

1. **baseId** - уникальный для каждого предмета
2. **type** - обязательно указать "consumable", "ability" или "spell"
3. **consumableType** - ОБЯЗАТЕЛЬНО для консьюмаблов (дискриминатор)
4. **Названия** - на русском языке
5. **Описания** - краткие, лорные (механика уже в полях)

## ВАЖНО - Формат ответа:
- Верни ТОЛЬКО JSON массив, без markdown-разметки и комментариев
- Верни ПОЛНЫЕ объекты со ВСЕМИ полями, не сокращай
- JSON должен быть готов к копированию целиком

---

## Обязательные поля по типам (summary)

| Type | consumableType | Обязательные поля в system |
|------|----------------|----------------------------|
| consumable | potion | effects[] (min 1) |
| consumable | bomb | damage, radius, save |
| consumable | scroll | spell, requirements |
| consumable | food | nutrition |
| consumable | poison | damage, save, application |
| ability | - | (нет обязательных, есть дефолты) |
| spell | - | (нет обязательных, есть дефолты) |
`;
}

/**
 * Генерирует промпт с ошибками для исправления ИИ
 */
export function generateErrorPrompt(errorMessage: string, jsonText: string): string {
  // Определяем нужны ли иконки для исправления
  const needsIcons =
    errorMessage.toLowerCase().includes('иконк') ||
    errorMessage.toLowerCase().includes('icon') ||
    errorMessage.toLowerCase().includes('img');

  let iconSection = '';
  if (needsIcons) {
    // Парсим JSON чтобы понять какие типы предметов
    try {
      const items = JSON.parse(jsonText);
      const types = new Set<string>();
      for (const item of items) {
        if (item.system?.consumableType) {
          types.add(item.system.consumableType);
        } else if (item.type) {
          types.add(item.type);
        }
      }

      // Собираем релевантные иконки
      const relevantIcons: string[] = [];
      for (const type of types) {
        relevantIcons.push(...getIconsForType(type, type));
      }

      if (relevantIcons.length > 0) {
        iconSection = `

## Доступные иконки для этих типов предметов:
\`\`\`json
${JSON.stringify(relevantIcons.slice(0, 200), null, 2)}
\`\`\`
${relevantIcons.length > 200 ? `\n(показано 200 из ${relevantIcons.length})` : ''}
`;
      }
    } catch {
      // Если не удалось распарсить - не добавляем иконки
    }
  }

  return `# Исправь ошибки в JSON

## Ошибки валидации:
\`\`\`
${errorMessage}
\`\`\`

## Исходный JSON:
\`\`\`json
${jsonText}
\`\`\`
${iconSection}
## Требования:
1. Исправь все указанные ошибки
2. Сохрани ВСЕ поля и данные каждого объекта

## ВАЖНО - Формат ответа:
- Верни ПОЛНЫЙ JSON массив со ВСЕМИ объектами и ВСЕМИ их полями
- Не сокращай, не пропускай поля
- JSON должен быть готов к копированию целиком
`;
}

/**
 * Генерирует промпт для подбора иконок к предметам
 */
export function generateIconsPrompt(jsonText: string): string {
  let items: Array<Record<string, unknown>> = [];
  try {
    items = JSON.parse(jsonText);
  } catch {
    return 'Ошибка: невалидный JSON';
  }

  // Собираем уникальные типы
  const types = new Set<string>();
  for (const item of items) {
    const system = item.system as { consumableType?: string } | undefined;
    const type = system?.consumableType || (item.type as string) || 'unknown';
    types.add(type);
  }

  // Собираем все релевантные иконки
  const allIcons: string[] = [];
  for (const type of types) {
    allIcons.push(...getIconsForType(type, type));
  }
  const uniqueIcons = [...new Set(allIcons)];

  return `# Подбери иконки для предметов Shattered Worlds

## Исходные предметы:
\`\`\`json
${jsonText}
\`\`\`

## Доступные иконки (выбирай ТОЛЬКО из этого списка):
\`\`\`json
${JSON.stringify(uniqueIcons, null, 2)}
\`\`\`

## Задача:
1. Для КАЖДОГО предмета добавь или замени поле "img" на подходящую иконку
2. Выбирай иконку по смыслу: potions для зелий, bomb для бомб, scrolls для свитков, food для еды, skills для способностей, magic для заклинаний
3. Верни ПОЛНЫЙ JSON массив со ВСЕМИ полями каждого предмета

## ВАЖНО:
- Верни ВЕСЬ JSON целиком, не только изменённые поля
- Каждый объект должен содержать ВСЕ оригинальные поля + обновлённое "img"
- Формат: готовый к копированию JSON массив
`;
}
