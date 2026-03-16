// Ленивая загрузка foundryIcons.json — вынесен из бандла (~315 kB экономии).
// Кеш нужен для синхронного доступа через getFoundryIconsCached().

let cachedIcons: string[] | null = null;
let loadPromise: Promise<string[]> | null = null;

export async function loadFoundryIcons(): Promise<string[]> {
  if (cachedIcons) return cachedIcons;
  if (loadPromise) return loadPromise;

  loadPromise = fetch('/systems/shattered-worlds/data/foundryIcons.json')
    .then((res) => {
      if (!res.ok) throw new Error(`Не удалось загрузить foundryIcons: ${res.status}`);
      return res.json() as Promise<string[]>;
    })
    .then((icons) => {
      cachedIcons = icons;
      return icons;
    });

  return loadPromise;
}

export function getFoundryIconsCached(): string[] {
  if (!cachedIcons)
    throw new Error('foundryIcons не загружены. Вызовите loadFoundryIcons() первым.');
  return cachedIcons;
}
