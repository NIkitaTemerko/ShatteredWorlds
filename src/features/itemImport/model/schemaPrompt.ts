/**
 * Генерирует промпт со схемами для ИИ (без иконок — они опциональны)
 */
export function generateSchemaPrompt(): string {
  return `# Shattered Worlds Item Import Schema

Создай JSON массив предметов для импорта в систему Shattered Worlds (Foundry VTT).

---

## СТРОГИЕ ПРАВИЛА (нарушение = невалидный результат)

1. **НЕ УКАЗЫВАЙ опциональные поля** если пользователь не задал конкретное значение. Система автоматически подставит значения по умолчанию. Если поле помечено "По умолчанию: X" — НЕ включай его в JSON.
2. **quantity** — ЗАПРЕЩЕНО указывать. Это поле управляется инвентарём, не предметом.
3. **Указывай ТОЛЬКО**: обязательные поля (помечены "ОБЯЗАТЕЛЬНО") + поля, которые пользователь явно попросил задать.
4. **description** — ОБЯЗАТЕЛЬНО заполняй развёрнутым лорным описанием (2-4 предложения). Описание должно раскрывать суть предмета, его историю или применение в мире.
5. **baseId** — формат: \`{type}-{subtype}-{name}\`, например \`potion-heal-greater\`, \`bomb-fire-cluster\`. Только латиница, kebab-case.
6. **name** — на русском языке, лорное название.
7. **Числовые значения** (damage, amount, dc, radius и т.д.) — указывай ТОЛЬКО если пользователь задал или описал силу предмета. Иначе используй минимальные разумные значения из примеров.
8. **rarity** — указывай ТОЛЬКО если пользователь явно попросил определённую редкость.
9. **img** — НЕ указывай. Иконки подбираются отдельным шагом.
10. **Формат ответа** — ТОЛЬКО валидный JSON массив без markdown, комментариев, пояснений.

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
  description: string;       // ОБЯЗАТЕЛЬНО — лорное описание предмета (2-4 предложения)
  // ↓ Опциональные поля — НЕ УКАЗЫВАЙ если пользователь не просил ↓
  stackLimit?: number;       // НЕ УКАЗЫВАЙ (дефолт: 99)
  price?: number;            // НЕ УКАЗЫВАЙ (дефолт: 0)
  weight?: number;           // НЕ УКАЗЫВАЙ (дефолт: 0)
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";  // НЕ УКАЗЫВАЙ (дефолт: "common")
  activation?: {             // НЕ УКАЗЫВАЙ (дефолт: action, cost 1)
    type?: "action" | "bonus" | "reaction";
    cost?: number;
  };
  uses?: {                   // НЕ УКАЗЫВАЙ (дефолт: 1/1, charges)
    value?: number;
    max?: number;
    per?: "charges" | "uses" | "turns";
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
  "system": {
    "consumableType": "potion",
    "description": "Густая алая жидкость, мерцающая в свете факелов. Варится алхимиками Красной Гильдии из корня мандрагоры и крови феникса. Мгновенно затягивает раны и восстанавливает силы.",
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
  "system": {
    "consumableType": "bomb",
    "description": "Глиняная сфера, начинённая алхимическим огнём. При ударе о поверхность воспламеняется, разбрызгивая горящую смесь в радиусе нескольких метров. Излюбленное оружие горных разбойников.",
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
  "system": {
    "consumableType": "scroll",
    "description": "Пергамент из драконьей кожи, испещрённый пылающими рунами. При активации руны вырываются с поверхности и формируют разрушительную сферу пламени. Одноразовый — после прочтения рассыпается в пепел.",
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
  "system": {
    "consumableType": "food",
    "description": "Щедрый кусок мяса огненного дракона, прожаренный на его же пламени. Волокна пронизаны остаточной магией, дающей едоку временную устойчивость к огню. Деликатес, доступный лишь сильнейшим охотникам.",
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
  "system": {
    "consumableType": "poison",
    "description": "Бесцветная маслянистая жидкость, добываемая из шипов лунного цветка. Парализует нервную систему жертвы, погружая в глубокий неестественный сон. Ассасины Южного Берега щедро сдабривают ею клинки.",
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
  description: string;     // ОБЯЗАТЕЛЬНО — лорное описание (2-4 предложения)
  // ↓ Опциональные поля — НЕ УКАЗЫВАЙ если пользователь не просил ↓
  abilityType?: "active" | "passive";  // НЕ УКАЗЫВАЙ (дефолт: "active")
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";  // НЕ УКАЗЫВАЙ (дефолт: "common")
  
  // Для активных способностей (abilityType: "active")
  activeKind?: "attack" | "defense" | "utility" | "movement";
  actionType?: "action" | "bonus" | "reaction";
  castTime?: number;
  
  // Для пассивных способностей (abilityType: "passive")
  passiveKind?: "stat-bonus" | "aura" | "triggered";
  mode?: "always-on" | "toggle";
  
  // Общие — НЕ УКАЗЫВАЙ (есть дефолты)
  maxRank?: number;
  currentRank?: number;
  cooldown?: unknown;
  resourceCosts?: unknown[];
}
\`\`\`

**Пример активной способности:**
\`\`\`json
{
  "baseId": "ability-backstab",
  "type": "ability",
  "name": "Удар в спину",
  "system": {
    "abilityType": "active",
    "activeKind": "attack",
    "actionType": "action",
    "description": "Стремительный выпад из тени, направленный в уязвимое место противника. Мастера этой техники обучаются годами в гильдиях воров, оттачивая точность до совершенства. Наносит утроенный урон скрытому врагу."
  }
}
\`\`\`

**Пример пассивной способности:**
\`\`\`json
{
  "baseId": "ability-danger-sense",
  "type": "ability",
  "name": "Чувство опасности",
  "system": {
    "abilityType": "passive",
    "passiveKind": "triggered",
    "mode": "always-on",
    "description": "Обострённое шестое чувство, выработанное выживанием в подземельях. За мгновение до удара тело инстинктивно уклоняется, предчувствуя угрозу. Даёт преимущество на спасброски от ловушек и засад."
  }
}
\`\`\`

---

## SPELL (заклинание)

\`\`\`typescript
interface SpellSystem {
  description: string;     // ОБЯЗАТЕЛЬНО — лорное описание (2-4 предложения)
  // ↓ Опциональные поля — НЕ УКАЗЫВАЙ если пользователь не просил ↓
  category?: "code" | "elemental" | "dark" | "holy" | "arcane";  // НЕ УКАЗЫВАЙ (дефолт: "arcane")
  spellKind?: "attack" | "defense" | "utility" | "movement";     // НЕ УКАЗЫВАЙ (дефолт: "attack")
  level?: number;           // НЕ УКАЗЫВАЙ (дефолт: 1)
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";  // НЕ УКАЗЫВАЙ (дефолт: "common")
  castTime?: number;        // НЕ УКАЗЫВАЙ (дефолт: 0)
  resourceCosts?: unknown[];  // НЕ УКАЗЫВАЙ (дефолт: [])
  effects?: unknown[];      // НЕ УКАЗЫВАЙ (дефолт: [])
}
\`\`\`

**Пример:**
\`\`\`json
{
  "baseId": "spell-fireball",
  "type": "spell",
  "name": "Огненный шар",
  "system": {
    "category": "elemental",
    "spellKind": "attack",
    "level": 3,
    "description": "Сгусток чистой огненной маны, сжатый до предела и выпущенный в цель. При столкновении взрывается, испепеляя всё в радиусе шести метров. Одно из первых боевых заклинаний, которым обучают в Академии Элементов."
  }
}
\`\`\`

---

## Иконки

**НЕ УКАЗЫВАЙ поле \`img\`.** Иконки подбираются отдельным шагом после генерации.

---

## Требования к ответу

1. **baseId** — уникальный, kebab-case, латиница
2. **type** — обязательно: "consumable", "ability" или "spell"
3. **consumableType** — ОБЯЗАТЕЛЬНО для консьюмаблов
4. **name** — на русском, лорное название
5. **description** — ОБЯЗАТЕЛЬНО, развёрнутое лорное описание (2-4 предложения)
6. **Опциональные поля** — НЕ ВКЛЮЧАЙ если пользователь не задал конкретные значения

## ВАЖНО - Формат ответа:
- Верни ТОЛЬКО JSON массив, без markdown-разметки и комментариев
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

