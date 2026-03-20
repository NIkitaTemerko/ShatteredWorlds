import type { CharacterStatPath } from '../characterStatPaths';

type SplitPath<T extends string> = T extends `${infer First}.${infer Rest}`
  ? First | SplitPath<Rest>
  : T;

/** Сегмент пути к характеристике персонажа */
export type PathPart = SplitPath<CharacterStatPath>;

/** Режим применения модификатора к характеристике */
export type ModifierMode = 'add' | 'mul' | 'override';

/** Результат подчёта бонусов от предметов */
export interface ItemBonusResult {
  bonuses: Map<CharacterStatPath, number>;
}

/** Разобранный путь к характеристике */
export interface ParsedPath {
  parts: PathPart[];
  isAttributeValue: boolean;
  isEditableStat: boolean;
  attributeKey?: PathPart;
}
