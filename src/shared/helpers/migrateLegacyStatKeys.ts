const LEGACY_ATTRIBUTE_KEYS = {
  perception: 'finesse',
  psyDefence: 'will',
  diplomacy: 'presence',
} as const;

const LEGACY_HELPER_KEYS = {
  totalPerception: 'totalFinesse',
  totalPsyDefence: 'totalWill',
  totalDiplomacy: 'totalPresence',
} as const;

const LEGACY_ABILITY_KEYS = LEGACY_ATTRIBUTE_KEYS;

const LEGACY_STAT_PATH_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['attributes.perception.', 'attributes.finesse.'],
  ['attributes.psyDefence.', 'attributes.will.'],
  ['attributes.diplomacy.', 'attributes.presence.'],
  ['helpers.totalPerception', 'helpers.totalFinesse'],
  ['helpers.totalPsyDefence', 'helpers.totalWill'],
  ['helpers.totalDiplomacy', 'helpers.totalPresence'],
];

type LegacyAttributeKey = keyof typeof LEGACY_ATTRIBUTE_KEYS;
type LegacyAbilityKey = keyof typeof LEGACY_ABILITY_KEYS;

export function migrateLegacyAbilityKey(value: string): string {
  if (value in LEGACY_ABILITY_KEYS) {
    return LEGACY_ABILITY_KEYS[value as LegacyAbilityKey];
  }
  return value;
}

export function migrateLegacyStatPath(path: string): string {
  let result = path;
  for (const [from, to] of LEGACY_STAT_PATH_REPLACEMENTS) {
    result = result.replaceAll(from, to);
  }
  return result;
}

export function migrateLegacyStatKeys(sys: {
  attributes?: object;
  helpers?: object;
}): void {
  const attrs = sys.attributes as Record<string, unknown> | undefined;
  if (attrs) {
    for (const [oldKey, newKey] of Object.entries(LEGACY_ATTRIBUTE_KEYS)) {
      if (oldKey in attrs && !(newKey in attrs)) {
        attrs[newKey] = attrs[oldKey];
        delete attrs[oldKey];
      }
    }
  }

  const helpers = sys.helpers as Record<string, unknown> | undefined;
  if (helpers) {
    for (const [oldKey, newKey] of Object.entries(LEGACY_HELPER_KEYS)) {
      if (oldKey in helpers && !(newKey in helpers)) {
        helpers[newKey] = helpers[oldKey];
        delete helpers[oldKey];
      }
    }
  }
}

export function migrateActorSystem(system: {
  attributes?: object;
  helpers?: object;
}): boolean {
  const before = JSON.stringify({
    attributes: system.attributes,
    helpers: system.helpers,
  });
  migrateLegacyStatKeys(system);
  return (
    JSON.stringify({
      attributes: system.attributes,
      helpers: system.helpers,
    }) !== before
  );
}

function migrateStringField(
  container: Record<string, unknown>,
  field: string,
): boolean {
  const value = container[field];
  if (typeof value !== 'string') return false;

  const migrated = migrateLegacyAbilityKey(value);
  if (migrated === value) return false;

  container[field] = migrated;
  return true;
}

export function migrateItemSystem(system: Record<string, unknown>): boolean {
  let changed = false;

  const save = system.save;
  if (save && typeof save === 'object') {
    changed = migrateStringField(save as Record<string, unknown>, 'type') || changed;
  }

  const requirements = system.requirements;
  if (requirements && typeof requirements === 'object') {
    changed =
      migrateStringField(requirements as Record<string, unknown>, 'ability') || changed;
  }

  const effects = system.effects;
  if (Array.isArray(effects)) {
    for (const effect of effects) {
      if (!effect || typeof effect !== 'object') continue;
      changed = migrateStringField(effect as Record<string, unknown>, 'attribute') || changed;
    }
  }

  const statBonuses = system.statBonuses;
  if (statBonuses && typeof statBonuses === 'object') {
    const modifiers = (statBonuses as { modifiers?: unknown }).modifiers;
    if (Array.isArray(modifiers)) {
      for (const modifier of modifiers) {
        if (!modifier || typeof modifier !== 'object') continue;
        const mod = modifier as Record<string, unknown>;
        const stat = mod.stat;
        if (typeof stat !== 'string') continue;

        const migrated = migrateLegacyStatPath(stat);
        if (migrated === stat) continue;

        mod.stat = migrated;
        changed = true;
      }
    }
  }

  return changed;
}

export function actorSystemNeedsMigration(system: {
  attributes?: object;
  helpers?: object;
}): boolean {
  const attrs = system.attributes as Record<string, unknown> | undefined;
  if (attrs) {
    for (const oldKey of Object.keys(LEGACY_ATTRIBUTE_KEYS) as LegacyAttributeKey[]) {
      if (oldKey in attrs) return true;
    }
  }

  const helpers = system.helpers as Record<string, unknown> | undefined;
  if (helpers) {
    for (const oldKey of Object.keys(LEGACY_HELPER_KEYS)) {
      if (oldKey in helpers) return true;
    }
  }

  return false;
}

export function itemSystemNeedsMigration(system: Record<string, unknown>): boolean {
  const save = system.save;
  if (save && typeof save === 'object') {
    const type = (save as { type?: unknown }).type;
    if (typeof type === 'string' && type in LEGACY_ABILITY_KEYS) return true;
  }

  const requirements = system.requirements;
  if (requirements && typeof requirements === 'object') {
    const ability = (requirements as { ability?: unknown }).ability;
    if (typeof ability === 'string' && ability in LEGACY_ABILITY_KEYS) return true;
  }

  const effects = system.effects;
  if (Array.isArray(effects)) {
    for (const effect of effects) {
      if (!effect || typeof effect !== 'object') continue;
      const attribute = (effect as { attribute?: unknown }).attribute;
      if (typeof attribute === 'string' && attribute in LEGACY_ABILITY_KEYS) return true;
    }
  }

  const statBonuses = system.statBonuses;
  if (statBonuses && typeof statBonuses === 'object') {
    const modifiers = (statBonuses as { modifiers?: unknown }).modifiers;
    if (Array.isArray(modifiers)) {
      for (const modifier of modifiers) {
        if (!modifier || typeof modifier !== 'object') continue;
        const stat = (modifier as { stat?: unknown }).stat;
        if (typeof stat === 'string' && stat !== migrateLegacyStatPath(stat)) return true;
      }
    }
  }

  return false;
}
