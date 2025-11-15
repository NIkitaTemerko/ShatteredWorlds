import { characterRoll } from '../../helpers/Character/characterRoll';
import { prepareCharacterBaseData } from '../../helpers/Character/prepareCharacterBaseData';
import { prepareCharacterDerivedData } from '../../helpers/Character/prepareCharacterDerivedData';
import { prepareNpcBaseData } from '../../helpers/Npc/prepareNpcBaseData';
import { prepareNpcDerivedData } from '../../helpers/Npc/prepareNpcDerivedData';
import type { ShwItem } from '../Item/ShwItem';
import type { ShwActorSystem, ShwNpcSystem } from './types/ShwActorSystem';

type ActorKind = 'character' | 'npc'; // можно расширять

type SystemByKind = {
  character: ShwActorSystem;
  npc: ShwNpcSystem;
};

export class ShwActor<K extends keyof SystemByKind = ActorKind> extends Actor {
  // @ts-expect-error - Override Foundry's base type system
  declare type: K;
  // @ts-expect-error - Override Foundry's base system type
  declare system: SystemByKind[K];
  // @ts-expect-error - Override Foundry's items collection type
  declare items: Collection<ShwItem>;
  declare update: (
    data?: object,
    operation?: Partial<Omit<foundry.abstract.types.DatabaseUpdateOperation, 'updates'>>,
  ) => Promise<undefined | this>;

  isCharacter(): this is ShwActor<'character'> {
    return this.type === 'character';
  }
  isNpc(): this is ShwActor<'npc'> {
    return this.type === 'npc';
  }

  prepareBaseData(): void {
    if (this.isCharacter()) {
      prepareCharacterBaseData(this.system);
    } else if (this.isNpc()) {
      prepareNpcBaseData(this.system);
    }
  }

  prepareDerivedData(): void {
    if (this.isCharacter()) {
      prepareCharacterDerivedData(this.system);
    } else if (this.isNpc()) {
      prepareNpcDerivedData(this.system);
    }
  }

  async roll(
    key: keyof ShwActorSystem['attributes'] | 'natural' = 'natural',
    isSave = false,
    advantage: 'adv' | 'dis' | 'normal' = 'normal',
    rolValue?: number,
    bonus?: number,
    actions?: number,
  ) {
    switch (this.type) {
      case 'character': {
        await characterRoll(this, isSave, key, advantage, rolValue, bonus, actions);
        break;
      }
      case 'npc': {
        await characterRoll(this, isSave, key, advantage, rolValue, bonus, actions);
        break;
      }
    }
  }

  override getRollData() {
    // берём базовый набор, который делает Foundry
    const data: Record<string, unknown> = super.getRollData();

    // гарантируем, что initiative — число
    const init = Number(this.system?.additionalAttributes?.initiative ?? 0);
    // одновременно кладём дублирующее короткое поле,
    // чтобы формула '1d20 + @initiative' тоже работала
    data.initiative = init;

    return data;
  }
}
