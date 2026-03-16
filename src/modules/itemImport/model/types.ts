/**
 * Типы для импорта item cores
 */
export type ShwItemType = 'consumable' | 'ability' | 'spell';

export interface ItemCore {
  baseId: string;
  type: ShwItemType;
  name: string;
  img?: string;
  system: Record<string, unknown>;
  effects?: unknown[];
  flags?: Record<string, unknown>;
  pendingLinks?: unknown;
}

export interface ValidationError {
  index: number;
  baseId?: string;
  message: string;
}

export interface ValidationReport {
  valid: boolean;
  errors: ValidationError[];
  duplicates: string[];
}

export interface ImportResult {
  itemId: string;
  baseId: string;
  status: 'created' | 'updated' | 'skipped';
  error?: string;
}

export interface ImportReport {
  dryRun: boolean;
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  results: ImportResult[];
}
