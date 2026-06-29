// Глобальный трекер: только один попап может быть открыт одновременно
let activePopupClose: (() => void) | null = null;

/** Закрыть текущий открытый попап (если есть) */
export function closeActivePopup() {
  if (activePopupClose) {
    activePopupClose();
    activePopupClose = null;
  }
}

/** Установить текущий активный попап */
export function setActivePopupClose(closeFn: (() => void) | null) {
  activePopupClose = closeFn;
}
