/** Данные предмета для стекирования и идентификации */
export interface ItemDataLike {
  type: string;
  name: string;
  system?: Record<string, unknown> & {
    baseId?: string;
    quantity?: number;
  };
}
