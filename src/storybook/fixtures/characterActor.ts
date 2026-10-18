import { CHAR_DEFAULTS } from '../../shared/model/constants/characterDefaults';
import type {
  AttributeKey,
  AttributeStatSourceBreakdown,
  ShwActorSystem,
  StatSourceValues,
} from '../../documents/Actor/types/ShwActorSystem';
import { STORY_PLACEHOLDER_IMG } from './placeholderImg';

function emptySources(): StatSourceValues {
  return { base: 0, growth: 0, equipment: 0, abilities: 0, extra: 0 };
}

function attrFields(value = 2) {
  return {
    value,
    extra: 0,
    charBonus: 0,
    saveBonus: 0,
    charBonusBase: 0,
    saveBonusBase: 0,
    coefficient: 0,
  };
}

function attrBreakdown(base = 2): AttributeStatSourceBreakdown {
  return {
    value: { base, equipment: 0, abilities: 0 },
    extra: { equipment: 0, abilities: 0, extra: 0 },
    charBonus: { base: 0, equipment: 0, abilities: 0, extra: 0 },
    saveBonus: { base: 0, equipment: 0, abilities: 0, extra: 0 },
  };
}

const ATTRIBUTE_KEYS: AttributeKey[] = ['fortune', 'force', 'finesse', 'will', 'presence'];

function buildAttributeStatSources() {
  return Object.fromEntries(ATTRIBUTE_KEYS.map((key) => [key, attrBreakdown(2)])) as Record<
    AttributeKey,
    AttributeStatSourceBreakdown
  >;
}

function buildAdditionalStatSources() {
  const keys = Object.keys(
    CHAR_DEFAULTS.additionalAttributes,
  ) as (keyof ShwActorSystem['additionalAttributes'])[];
  return Object.fromEntries(
    keys.map((key) => [key, emptySources()]),
  ) as ShwActorSystem['additionalStatSources'];
}

export function createCharacterSystem(overrides: Partial<ShwActorSystem> = {}): ShwActorSystem {
  const attributes = {
    fortune: attrFields(3),
    force: attrFields(2),
    finesse: attrFields(2),
    will: attrFields(2),
    presence: attrFields(1),
  };

  return {
    health: { value: 18, max: 20, extra: 0 },
    barrier: { value: 0 },
    attributes,
    additionalAttributes: { ...CHAR_DEFAULTS.additionalAttributes, massCategory: 2 },
    utility: { ...CHAR_DEFAULTS.utility, speed: 20, level: 3 },
    totals: {
      ...CHAR_DEFAULTS.totals,
      fortune: 3,
      force: 2,
      finesse: 2,
      will: 2,
      presence: 1,
      actions: 2,
      bonusActions: 1,
      reactions: 1,
      health: 20,
      healthCoefficient: 2,
      speed: 20,
      massCategory: 2,
    },
    additionalStatSources: buildAdditionalStatSources(),
    healthStatSources: { base: 20, equipment: 0, abilities: 0, extra: 0 },
    speedStatSources: { ...emptySources(), base: 20 },
    attributeStatSources: buildAttributeStatSources(),
    ...overrides,
  };
}

export function createCharacterActorFixture(options?: {
  name?: string;
  img?: string;
  items?: unknown[];
  system?: Partial<ShwActorSystem>;
}) {
  const items = options?.items ?? [];

  return {
    id: 'story-character-1',
    _id: 'story-character-1',
    name: options?.name ?? 'Арена Вейл',
    img: options?.img ?? STORY_PLACEHOLDER_IMG,
    type: 'character' as const,
    system: createCharacterSystem(options?.system),
    items,
    isCharacter() {
      return true;
    },
    isNpc() {
      return false;
    },
    async roll(...args: unknown[]) {
      console.log('[story actor] roll', ...args);
    },
  };
}
