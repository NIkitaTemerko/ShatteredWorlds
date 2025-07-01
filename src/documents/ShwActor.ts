export interface ShwActorSystem {
  health: { value: number; max: number };
  attributes: {
    fortune: { value: number };
    force: { value: number };
    perception:  { value: number };
    psyDefence: { value: number };
    diplomacy: { value: number };

  };
}

export class ShwActor extends Actor {
  /** Заполняем дефолты — LANCER делает то же в prepareBaseData */
  declare update: (
    data?: object,
    operation?: Partial<Omit<foundry.abstract.types.DatabaseUpdateOperation, "updates">>,
  ) => Promise<undefined | foundry.abstract.Document<object, any>>;
  declare system: ShwActorSystem;
  prepareBaseData() {
    const sys = this.system;

    sys.health     ??= { value: 10, max: 10 };
    sys.attributes ??= {
      fortune: { value: 0 },
      force: { value: 0 },
      perception:  { value: 0 },
      psyDefence: { value: 0 },
      diplomacy: { value: 0 },
    };
  }

  /** Пример метода, который дергает Svelte-лист */
  async rollAbility(ability: keyof ShwActorSystem["attributes"]) {
    const mod = Math.floor(this.system.attributes[ability].value / 5);
    const roll = await new Roll(`1d20+${mod}`).evaluate({ async: false });
    roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }) });
  }
}