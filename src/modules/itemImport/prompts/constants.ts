import type { ShwItemType } from '../model';

/** Примеры по типам предметов */
export const EXAMPLES_BY_TYPE: Record<ShwItemType, string> = {
  consumable: `### Consumable — Potion
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

### Consumable — Bomb
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

### Consumable — Scroll
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

### Consumable — Food
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

### Consumable — Poison
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
\`\`\``,

  ability: `### Ability — Active
\`\`\`json
{
  "baseId": "ability-backstab",
  "type": "ability",
  "name": "Удар в спину",
  "system": {
    "category": "active",
    "activeKind": "attack",
    "description": "Стремительный выпад из тени, направленный в уязвимое место противника. Мастера этой техники обучаются годами в гильдиях воров, оттачивая точность до совершенства. Наносит утроенный урон скрытому врагу.",
    "range": { "kind": "melee" },
    "targeting": { "targetType": "enemy" }
  }
}
\`\`\`

### Ability — Passive
\`\`\`json
{
  "baseId": "ability-danger-sense",
  "type": "ability",
  "name": "Чувство опасности",
  "system": {
    "category": "passive",
    "passiveKind": "triggered",
    "description": "Обострённое шестое чувство, выработанное выживанием в подземельях. За мгновение до удара тело инстинктивно уклоняется, предчувствуя угрозу. Даёт преимущество на спасброски от ловушек и засад."
  }
}
\`\`\``,

  spell: `### Spell
\`\`\`json
{
  "baseId": "spell-fireball",
  "type": "spell",
  "name": "Огненный шар",
  "system": {
    "category": "elemental",
    "spellKind": "attack",
    "description": "Сгусток чистой огненной маны, сжатый до предела и выпущенный в цель. При столкновении взрывается, испепеляя всё в радиусе шести метров. Одно из первых боевых заклинаний, которым обучают в Академии Элементов.",
    "range": { "kind": "ranged", "distance": 30 },
    "targeting": { "targetType": "enemy", "maxTargets": "all" }
  }
}
\`\`\``,

  equipment: `### Equipment
\`\`\`json
{
  "baseId": "equipment-body-chainmail",
  "type": "equipment",
  "name": "Кольчуга стражника",
  "system": {
    "slot": "body",
    "description": "Прочная кольчуга из стальных колец, выкованная в кузницах Стального Бастиона. Стандартная экипировка городской стражи — надёжно защищает корпус, не сковывая движений.",
    "armorClass": 3,
    "price": 150
  }
}
\`\`\`

### Equipment — с бонусами характеристик
\`\`\`json
{
  "baseId": "equipment-ring-fortune",
  "type": "equipment",
  "name": "Кольцо удачи",
  "system": {
    "slot": "ring",
    "description": "Тонкий золотой обруч с мерцающим изумрудом. Легенды гласят, что камень впитал удачу сотни авантюристов, павших в Расколотых Землях. Владелец чувствует необъяснимую уверенность в каждом броске.",
    "rarity": "rare",
    "statBonuses": {
      "modifiers": [
        { "stat": "attributes.fortune.value", "mode": "add", "value": 2 }
      ]
    }
  }
}
\`\`\``,
};

/** Правила, специфичные для типов предметов */
export const RULES_BY_TYPE: Partial<Record<ShwItemType, string>> = {
  consumable: '- **consumableType** — ОБЯЗАТЕЛЬНО для консьюмаблов',
  equipment:
    '- **slot** — ОБЯЗАТЕЛЬНО для снаряжения (head, cloak, amulet, hands, body, belt, one-hand, two-hand, boots, ring)',
};
