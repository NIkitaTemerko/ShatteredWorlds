export const ABILITY_CATEGORIES = [
  { value: 'active', label: 'ability.category.active' },
  { value: 'passive', label: 'ability.category.passive' },
];

export const ACTIVE_KINDS = [
  { value: 'attack', label: 'ability.activeKind.attack' },
  { value: 'heal', label: 'ability.activeKind.heal' },
  { value: 'support', label: 'ability.activeKind.support' },
  { value: 'debuff', label: 'ability.activeKind.debuff' },
  { value: 'control', label: 'ability.activeKind.control' },
  { value: 'movement', label: 'ability.activeKind.movement' },
  { value: 'summon', label: 'ability.activeKind.summon' },
  { value: 'utility', label: 'ability.activeKind.utility' },
];

export const PASSIVE_KINDS = [
  { value: 'stat-bonus', label: 'ability.passiveKind.statBonus' },
  { value: 'aura', label: 'ability.passiveKind.aura' },
  { value: 'triggered', label: 'ability.passiveKind.triggered' },
  { value: 'mechanic', label: 'ability.passiveKind.mechanic' },
];

export const ACTION_TYPES = [
  { value: 'action', label: 'ability.actionType.action' },
  { value: 'bonus', label: 'ability.actionType.bonus' },
  { value: 'reaction', label: 'ability.actionType.reaction' },
  { value: 'free', label: 'ability.actionType.free' },
];

export const RANGE_KINDS = [
  { value: 'self', label: 'ability.rangeKind.self' },
  { value: 'melee', label: 'ability.rangeKind.melee' },
  { value: 'ranged', label: 'ability.rangeKind.ranged' },
  { value: 'area', label: 'ability.rangeKind.area' },
];

export const AREA_SHAPES = [
  { value: 'circle', label: 'ability.areaShape.circle' },
  { value: 'cone', label: 'ability.areaShape.cone' },
  { value: 'line', label: 'ability.areaShape.line' },
];

export const TARGET_TYPES = [
  { value: 'self', label: 'ability.targetType.self' },
  { value: 'ally', label: 'ability.targetType.ally' },
  { value: 'enemy', label: 'ability.targetType.enemy' },
  { value: 'any', label: 'ability.targetType.any' },
];

export const PASSIVE_MODES = [
  { value: 'always-on', label: 'ability.passiveMode.alwaysOn' },
  { value: 'toggle', label: 'ability.passiveMode.toggle' },
  { value: 'triggered', label: 'ability.passiveMode.triggered' },
];

export const AURA_AFFECTS = [
  { value: 'self', label: 'ability.targetType.self' },
  { value: 'allies', label: 'ability.passiveDetails.allies' },
  { value: 'enemies', label: 'ability.passiveDetails.enemies' },
  { value: 'everyone', label: 'ability.passiveDetails.everyone' },
];
