// Глобальный трекер: только один попап может быть открыт одновременно
let activeMenuClose: (() => void) | null = null;

/** Закрыть текущий открытый попап (если есть) */
export function closeActivePopup() {
  if (activeMenuClose) {
    activeMenuClose();
    activeMenuClose = null;
  }
}

/** Установить текущий активный попап (вызывается из PopupMenu.svelte) */
export function setActiveMenuClose(closeFn: (() => void) | null) {
  activeMenuClose = closeFn;
}
