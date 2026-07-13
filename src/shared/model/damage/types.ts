import type { I18nKey } from '../../i18n';

/** Боевые типы урона из Патчища (раздел «ТИПЫ УРОНА»). */
export type CombatDamageType =
  | 'physical'
  | 'force'
  | 'elemental'
  | 'magical'
  | 'mental'
  | 'necrotic'
  | 'radiant'
  | 'void'
  | 'soul'
  | 'fall';

/** Типы урона для предметов/способностей (без fall/soul). */
export type ItemDamageType = Exclude<CombatDamageType, 'fall' | 'soul'>;

export type DamageInputKind = 'amount' | 'fallHeight';

export type DefenseLayer = 'armorClass' | 'damageReduction' | 'psiDefense';

export interface DamageTypeDefinition {
  id: CombatDamageType;
  labelKey: I18nKey;
  inputKind: DamageInputKind;
  defenseLayers: DefenseLayer[];
  allowsPenetration: boolean;
  ignoresArmor?: boolean;
  ignoresPsiDefense?: boolean;
  /** false — только попап HP на листе персонажа */
  selectableInItems?: boolean;
}

export interface DamageEntry {
  id: string;
  type: CombatDamageType;
  amount: number;
  penetration?: number;
  fallHeight?: number;
}

export interface ActorCombatDefenses {
  armorClass: number;
  damageReduction: number;
  psiDefense: number;
  massCategory: number;
}

export interface ActorCombatState extends ActorCombatDefenses {
  barrier: number;
  health: number;
}

export interface DefenseStepBreakdown {
  layer: DefenseLayer;
  stat: number;
  /** Эффективное значение (для брони с учётом пробития). */
  effectiveStat?: number;
  penetration?: number;
  blocked: number;
}

export interface DamageEntryBreakdown {
  id: string;
  type: CombatDamageType;
  order: number;
  raw: number;
  barrierBefore: number;
  barrierAbsorbed: number;
  overflow: number;
  defenseSteps: DefenseStepBreakdown[];
  hpDamage: number;
  barrierAfter: number;
  healthAfter: number;
}

export interface DamageSequenceResult {
  barrierLost: number;
  healthLost: number;
  finalBarrier: number;
  finalHealth: number;
  entries: DamageEntryBreakdown[];
}

export interface DamageTypeOption {
  value: CombatDamageType;
  labelKey: I18nKey;
}
