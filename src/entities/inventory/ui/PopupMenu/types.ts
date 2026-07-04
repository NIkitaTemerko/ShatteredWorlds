/** Пункт меню — действие (кнопка с иконкой и текстом) */
export interface MenuActionItem {
  type: 'action';
  label: string;
  icon?: string;
  danger?: boolean;
  onClick: (e: Event) => void;
}

/** Пункт меню — управление количеством (+/−/input) */
export interface MenuQuantityItem {
  type: 'quantity';
  label: string;
  value: number;
  min?: number;
  max?: number | null;
  onChange: (newValue: number) => void;
}

export type PopupMenuItem = MenuActionItem | MenuQuantityItem;
