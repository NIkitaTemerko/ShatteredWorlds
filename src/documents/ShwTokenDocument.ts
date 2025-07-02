// systems/shw/module/token.js (ESM/TS — важен экспорт default)
export class ShwTokenDocument extends TokenDocument {
   /**
    * movement : { x, y, dx, dy, ... }
    * Если возвращаем false → апдейт токена отменяется.
    */
   async _preUpdateMovement(movement: any, operation: any) {
      // если сценарий НЕ боевой — всегда пропускаем
      // @ts-ignore
      if (!(game as any).combat?.started) return super._preUpdateMovement(movement, operation);

      // (дополнительно можно проверить, что двигается именно combatant)
      // @ts-ignore
      if (!this.inCombat) return super._preUpdateMovement(movement, operation);

      // 1. расстояние в клетках (учитывает диагонали настроек сцены)
      const distCells = canvas.grid.measureDistance(movement.origin, movement.destination);

      // 2. берём скорость из актора
      const steps = (this as any)._movementHistory.length;
      const actions = this.actor.system.utility.actions;
      const stepLimit = (this.actor.system.utility.speed / 5) * (actions + 1);

      // если игрок превысил лимит — отменяем действие
      if (distCells / 5 + steps > stepLimit) {
         ui.notifications.warn(
            `${(this as any).name} может пройти только ${stepLimit} клеток за раунд.`,
         );
         return false; // отменить
      }

      // иначе разрешаем обычное обновление
      // @ts-ignore
      return super._preUpdateMovement(movement, operation);
   }
}
