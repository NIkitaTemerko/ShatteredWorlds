import type { ShwActorSystem } from '../documents/ShwActor';

const STAT_KEYS = ['fortune', 'force', 'perception', 'psyDefence', 'diplomacy'] as const;

export function prepareCharacterDerivedData(sys: ShwActorSystem) {
   const attrs = sys.attributes;
   for (const k of STAT_KEYS) {
      const a = attrs[k];
      a.charBonus = Math.floor(a.value / 5);
      a.saveBonus = Math.floor(a.value / 5);
   }
}
