type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function setByPath(target: PlainObject, path: string, value: unknown) {
  const parts = path.split('.');
  let cursor: PlainObject = target;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cursor[key];
    if (!isPlainObject(next)) {
      cursor[key] = {};
    }
    cursor = cursor[key] as PlainObject;
  }

  cursor[parts[parts.length - 1]] = value;
}

function deepMerge(target: PlainObject, source: PlainObject): PlainObject {
  const result: PlainObject = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (key.includes('.')) {
      setByPath(result, key, value);
      continue;
    }

    const existing = result[key];
    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = deepMerge(existing, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export type MutableDoc<T extends object> = T & {
  update: (data?: object) => Promise<MutableDoc<T>>;
};

/**
 * Storybook helper: wraps a plain fixture so `doc.update({...})` mutates via callback.
 * Supports Foundry-style dotted paths (`system.health.value`).
 */
export function createMutableDoc<T extends object>(
  initial: T,
  onChange: (next: MutableDoc<T>) => void,
): MutableDoc<T> {
  const doc = initial as MutableDoc<T>;

  doc.update = async (data?: object) => {
    const merged = deepMerge(doc as unknown as PlainObject, (data ?? {}) as PlainObject);
    Object.assign(doc, merged);
    onChange(doc);
    return doc;
  };

  return doc;
}
