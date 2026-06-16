import {
  ADDITIONAL_STAT_BASE,
  type AdditionalStatBaseKey,
} from '../model/constants/characterDefaults';

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

const HELPER_TO_TOTAL: Record<string, string> = {
  totalFortune: 'fortune',
  totalForce: 'force',
  totalFinesse: 'finesse',
  totalWill: 'will',
  totalPresence: 'presence',
  totalActions: 'actions',
  totalBonusActions: 'bonusActions',
  totalReactions: 'reactions',
  totalInitiative: 'initiative',
  totalImpulse: 'impulse',
  totalBarrier: 'barrier',
  totalPsiDefense: 'psiDefense',
  totalDamageReduction: 'damageReduction',
  totalHealth: 'health',
  totalSpeed: 'speed',
  totalArmorClass: 'armorClass',
  totalRange: 'range',
};

const MANUAL_CONVERSION_KEYS: AdditionalStatBaseKey[] = ['actions', 'bonusActions', 'reactions'];

const LEGACY_STAT_PATH_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['attributes.perception.', 'attributes.finesse.'],
  ['attributes.psyDefence.', 'attributes.will.'],
  ['attributes.diplomacy.', 'attributes.presence.'],
  ['helpers.totalPerception', 'totals.finesse'],
  ['helpers.totalPsyDefence', 'totals.will'],
  ['helpers.totalDiplomacy', 'totals.presence'],
  ...Object.entries(HELPER_TO_TOTAL).map(
    ([from, to]) => [`helpers.${from}`, `totals.${to}`] as const,
  ),
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

function mapHelpersToTotals(helpers: Record<string, unknown>): Record<string, unknown> {
  const totals: Record<string, unknown> = {};
  for (const [oldKey, value] of Object.entries(helpers)) {
    if (typeof value !== 'number') continue;
    const newKey = HELPER_TO_TOTAL[oldKey];
    if (newKey) totals[newKey] = value;
  }
  return totals;
}

function convertStoredAbsoluteToManual(additional: Record<string, unknown>): void {
  for (const key of MANUAL_CONVERSION_KEYS) {
    const stored = additional[key];
    if (typeof stored !== 'number') continue;
    additional[key] = Math.max(0, stored - ADDITIONAL_STAT_BASE[key]);
  }
}

function stripPersistedTotals(system: Record<string, unknown>): void {
  delete system.totals;
}

export function migrateLegacyStatKeys(sys: {
  attributes?: object;
  helpers?: object;
  totals?: object;
  additionalAttributes?: object;
}): void {
  const record = sys as Record<string, unknown>;

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
  const hadLegacyHelpers = helpers !== undefined;

  if (helpers) {
    for (const [oldKey, newKey] of Object.entries(LEGACY_HELPER_KEYS)) {
      if (oldKey in helpers && !(newKey in helpers)) {
        helpers[newKey] = helpers[oldKey];
        delete helpers[oldKey];
      }
    }

    if (!sys.totals) {
      sys.totals = mapHelpersToTotals(helpers) as object;
    }
    delete record.helpers;
  }

  stripPersistedTotals(record);

  const additional = sys.additionalAttributes as Record<string, unknown> | undefined;
  if (additional && hadLegacyHelpers) {
    convertStoredAbsoluteToManual(additional);
  }
}

export function migrateActorSystem(system: Record<string, unknown>): boolean {
  const before = JSON.stringify({
    attributes: system.attributes,
    helpers: system.helpers,
    totals: system.totals,
    additionalAttributes: system.additionalAttributes,
  });
  migrateLegacyStatKeys(system);

  const additional = system.additionalAttributes as Record<string, unknown> | undefined;
  if (additional) {
    convertStoredAbsoluteToManual(additional);
  }

  return (
    JSON.stringify({
      attributes: system.attributes,
      helpers: system.helpers,
      totals: system.totals,
      additionalAttributes: system.additionalAttributes,
    }) !== before
  );
}

function migrateStringField(container: Record<string, unknown>, field: string): boolean {
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

export function actorSystemNeedsMigration(system: Record<string, unknown>): boolean {
  const attrs = system.attributes as Record<string, unknown> | undefined;
  if (attrs) {
    for (const oldKey of Object.keys(LEGACY_ATTRIBUTE_KEYS) as LegacyAttributeKey[]) {
      if (oldKey in attrs) return true;
    }
  }

  if ('helpers' in system && system.helpers !== undefined) return true;
  if ('totals' in system && system.totals !== undefined) return true;

  const additional = system.additionalAttributes as Record<string, unknown> | undefined;
  if (additional) {
    for (const key of MANUAL_CONVERSION_KEYS) {
      const stored = additional[key];
      if (typeof stored === 'number' && stored >= ADDITIONAL_STAT_BASE[key]) return true;
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
  if (effects && Array.isArray(effects)) {
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
