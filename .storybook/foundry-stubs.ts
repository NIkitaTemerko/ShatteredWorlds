/**
 * Minimal Foundry globals so sheet widgets that touch Hooks/game
 * don't crash the Storybook preview (and leave UI unclickable).
 */
type HookFn = (...args: unknown[]) => void;

const hookBuckets = new Map<string, Set<HookFn>>();

const HooksStub = {
  on(event: string, fn: HookFn) {
    let bucket = hookBuckets.get(event);
    if (!bucket) {
      bucket = new Set();
      hookBuckets.set(event, bucket);
    }
    bucket.add(fn);
    return fn;
  },
  off(event: string, fn: HookFn) {
    hookBuckets.get(event)?.delete(fn);
    return fn;
  },
  call(event: string, ...args: unknown[]) {
    for (const fn of hookBuckets.get(event) ?? []) fn(...args);
  },
  callAll(event: string, ...args: unknown[]) {
    this.call(event, ...args);
  },
};

const gameStub = {
  items: {
    get() {
      return undefined;
    },
  },
  i18n: {
    localize: (key: string) => key,
    format: (key: string) => key,
  },
};

const g = globalThis as typeof globalThis & {
  Hooks?: typeof HooksStub;
  game?: typeof gameStub;
  ui?: { notifications?: { warn?: (m: string) => void; info?: (m: string) => void } };
};

if (typeof g.Hooks === 'undefined') g.Hooks = HooksStub;
if (typeof g.game === 'undefined') g.game = gameStub;
if (typeof g.ui === 'undefined') {
  g.ui = {
    notifications: {
      warn: (m) => console.warn('[storybook]', m),
      info: (m) => console.info('[storybook]', m),
    },
  };
}
