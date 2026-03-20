import { FOLDER_STRUCTURE } from '../../model/constants/folderStructure';

/** Кеш: "itemType" или "itemType/subtype" → folderId */
const folderCache = new Map<string, string>();

function localize(key: string): string {
  return game.i18n?.localize(key) ?? key;
}

function findFolder(name: string, parentId: string | null): Folder | undefined {
  const folders = game.folders as unknown as Collection<Folder>;
  return folders.find(
    (f: Folder) => f.type === 'Item' && f.name === name && (f.folder?.id ?? null) === parentId,
  );
}

async function ensureFolder(name: string, parentId: string | null): Promise<string> {
  const existing = findFolder(name, parentId);
  if (existing?.id) return existing.id;

  const data: Record<string, unknown> = { name, type: 'Item', sorting: 'a' };
  if (parentId) data.folder = parentId;

  // @ts-expect-error — Foundry Folder.create принимает Record
  const created = (await Folder.create(data)) as Folder;
  return created.id ?? '';
}

/** Создаёт структуру папок и заполняет кеш. Вызывается один раз при ready. */
export async function ensureFolderStructure(): Promise<void> {
  folderCache.clear();

  for (const [itemType, def] of Object.entries(FOLDER_STRUCTURE)) {
    const rootId = await ensureFolder(localize(def.rootKey), null);
    folderCache.set(itemType, rootId);

    for (const [subType, subKey] of Object.entries(def.subfolders ?? {})) {
      const subId = await ensureFolder(localize(subKey), rootId);
      folderCache.set(`${itemType}/${subType}`, subId);
    }
  }
}

/** Определяет ID целевой папки для предмета по типу и system-данным. */
export function getTargetFolderId(
  itemType: string,
  systemData: Record<string, unknown>,
): string | null {
  const def = FOLDER_STRUCTURE[itemType];
  if (!def) return null;

  const subtype = def.subtypeField
    ? (systemData[def.subtypeField] as string | undefined)
    : undefined;
  const cacheKey = subtype ? `${itemType}/${subtype}` : itemType;

  return folderCache.get(cacheKey) ?? folderCache.get(itemType) ?? null;
}
