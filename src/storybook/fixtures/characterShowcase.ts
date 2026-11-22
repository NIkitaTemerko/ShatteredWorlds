import type { ShwActor } from '../../documents/Actor/ShwActor';
import type { ShwActorSystem } from '../../documents/Actor/types/ShwActorSystem';
import type { ShwItem } from '../../documents/Item/ShwItem';
import { prepareCharacterDerivedData } from '../../shared/helpers/Character/prepareCharacterDerivedData';
import { createCharacterActorFixture } from './characterActor';
import { createMutableDoc } from './createMutableDoc';
import {
  createAbilityItemFixture,
  createConsumableItemFixture,
  createEquipmentItemFixture,
  createSpellItemFixture,
} from './items';

type FixtureItem =
  | ReturnType<typeof createEquipmentItemFixture>
  | ReturnType<typeof createAbilityItemFixture>
  | ReturnType<typeof createConsumableItemFixture>
  | ReturnType<typeof createSpellItemFixture>;

/** A populated actor using the production derivation helpers; mutations stay local to this story. */
export function createCharacterShowcase(
  onChange: (actor: ShwActor<'character'>) => void,
  resourceState: 'normal' | 'empty' | 'overcharge' = 'normal',
) {
  let actor: ShwActor<'character'>;
  let notification = '';
  const owned: ShwItem[] = [];
  const world = new Map<string, ShwItem>();
  let serial = 0;
  function refresh() {
    if (!actor) return;
    // Rebuild from persisted fields, as Foundry does before preparing derived data.
    const sys = structuredClone(actor.system);
    const barrier = sys.barrier.value;
    prepareCharacterDerivedData(sys, actor);
    sys.barrier.value = barrier;
    actor = { ...actor, system: sys } as ShwActor<'character'>;
    onChange(actor);
  }
  function item(base: FixtureItem, external = false): ShwItem {
    const id = `showcase-${++serial}`;
    const doc = createMutableDoc({ ...base, id, _id: id }, () => refresh());
    const result = Object.assign(doc, {
      async delete() {
        const index = owned.findIndex((value) => value.id === id);
        if (index >= 0) owned.splice(index, 1);
        refresh();
      },
      toObject() {
        return {
          name: doc.name,
          type: doc.type,
          img: doc.img,
          system: structuredClone(doc.system),
        };
      },
      sheet: {
        render() {
          notification = `Карточка: ${doc.name}`;
          refresh();
        },
      },
    }) as unknown as ShwItem;
    if (external) world.set(id, result);
    else owned.push(result);
    return result;
  }
  const linked = [
    'Рывок',
    'Шаг сквозь тень',
    'Крепкая хватка',
    'Покров',
    'Устойчивость',
    'Чуткость',
    'Проводник',
  ].map((name, index) =>
    item(createAbilityItemFixture({ name, category: index === 0 ? 'active' : 'passive' }), true),
  );
  const armor = item(createEquipmentItemFixture({ name: 'Кольчуга путника' }));
  if (armor.isEquipment()) {
    armor.system.equipped = true;
    armor.system.statBonuses = {
      modifiers: [
        { stat: 'attributes.force.value', mode: 'add', value: 1 },
        { stat: 'attributes.force.extra', mode: 'add', value: 12 },
      ],
    };
  }
  const cloak = item(createEquipmentItemFixture({ name: 'Плащ путника' }));
  if (cloak.isEquipment()) {
    cloak.system.slot = 'cloak';
    cloak.system.equipped = true;
    cloak.system.linkedItemIds = linked.map((value) => value.id ?? '');
    cloak.system.statBonuses = null;
  }
  for (let index = 0; index < 5; index++) {
    const ring = item(createEquipmentItemFixture({ name: `Кольцо ${index + 1}` }));
    if (ring.isEquipment()) {
      ring.system.slot = 'ring';
      ring.system.equipped = true;
      ring.system.statBonuses = null;
    }
  }
  for (const name of ['Кожаный доспех', 'Стёганый доспех', 'Латный панцирь'])
    item(createEquipmentItemFixture({ name }));
  for (let index = 0; index < 51; index++) {
    const gear = item(createEquipmentItemFixture({ name: `Снаряжение ${index + 1}` }));
    if (gear.isEquipment())
      gear.system.slot = ['head', 'cloak', 'hands', 'boots', 'ring'][
        index % 5
      ] as typeof gear.system.slot;
  }
  for (let index = 0; index < 67; index++)
    item(
      createConsumableItemFixture({ name: index === 0 ? 'Огненная бомба' : `Припасы ${index}` }),
    );
  const spellNames = [
    'Spark',
    'Огненная стрела',
    'Ледяное касание',
    'Порыв ветра',
    'Каменный шип',
    'Пламя',
    'Ледяная преграда',
    'Удар молнии',
    'Гром',
    'Искра',
    'Волна',
    'Шквал',
  ];
  for (let index = 0; index < 42; index++)
    item(
      createSpellItemFixture({
        name: spellNames[index] ?? `Заклинание ${index + 1}`,
        category:
          index < 12
            ? 'elemental'
            : index < 20
              ? 'holy'
              : index < 28
                ? 'dark'
                : index < 35
                  ? 'code'
                  : 'arcane',
      }),
    );
  for (const name of [
    'Удар искры',
    'Быстрый выпад',
    'Защитная стойка',
    'Перехват',
    'Толчок',
    'Прицельный удар',
    'Уклонение',
    'Ответный удар',
    'Размах',
    'Натиск',
    'Прыжок',
  ])
    item(createAbilityItemFixture({ name }));
  for (const name of ['Каменная кожа', 'Закалка', 'Бдительность'])
    item(createAbilityItemFixture({ name, category: 'passive' }));
  const collection = Object.assign(owned, {
    get(id: string) {
      return owned.find((value) => value.id === id) ?? world.get(id);
    },
  });
  const fixture = createCharacterActorFixture();
  const values = {
    fortune: [16, 10],
    force: [11, 4],
    finesse: [15, 8],
    will: [20, 12],
    presence: [10, 4],
  };
  for (const key of Object.keys(values) as (keyof ShwActorSystem['attributes'])[])
    Object.assign(fixture.system.attributes[key], { value: values[key][0], extra: values[key][1] });
  fixture.system.additionalAttributes.massCategory = 0;
  fixture.system.attributes.force.charBonusBase = 1;
  fixture.system.health = { value: resourceState === 'empty' ? 0 : 45, max: 50, extra: 30 };
  fixture.system.barrier.value =
    resourceState === 'overcharge' ? 15 : resourceState === 'empty' ? 0 : 5;
  const mutable = createMutableDoc({ ...fixture, items: collection }, (next) => {
    actor = next as unknown as ShwActor<'character'>;
    refresh();
  });
  actor = Object.assign(mutable, {
    async updateEmbeddedDocuments(
      _type: string,
      updates: { _id: string; 'system.equipped': boolean }[],
    ) {
      for (const update of updates) {
        const entry = collection.get(update._id);
        if (entry?.isEquipment()) entry.system.equipped = update['system.equipped'];
      }
      refresh();
      return [];
    },
    async roll(
      key: string,
      isSave: boolean,
      mode: string,
      dice: number,
      bonus: number,
      count: number,
    ) {
      notification = `${isSave ? 'Спасбросок' : 'Бросок'}: ${key}, ${count} × d${dice}, ${mode}, +${bonus}`;
      refresh();
    },
    sheet: {
      close() {
        notification = 'Карточка закрыта (демонстрация)';
        refresh();
      },
    },
  }) as unknown as ShwActor<'character'>;
  const initialBarrier = actor.system.barrier.value;
  prepareCharacterDerivedData(actor.system, actor);
  actor.system.barrier.value = initialBarrier;
  return { actor, getNotification: () => notification };
}
